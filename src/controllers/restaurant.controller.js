import { Restaurant } from "../models/restaurant.model.js";
import { Table } from "../models/table.model.js";
import { Reservation } from "../models/reservation.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  normalizeDate,
  timeToMinutes,
  minutesToTime,
  isTimeOverlap,
  isWithinOperatingHours,
} from "../utils/bookingHelper.js";
import { uploadToCloudinary, isCloudinaryConfigured } from "../config/cloudinary.js";

// @desc    List all restaurants with search and filters
// @route   GET /api/v1/restaurants
// @access  Public
export const getRestaurants = asyncHandler(async (req, res) => {
  const { neighborhood, cuisine, search, status } = req.query;

  const filter = {};

  // Diners only see active restaurants
  if (status && req.user?.role === "super_admin") {
    if (status !== "all") filter.status = status;
  } else {
    filter.status = "active";
  }

  if (neighborhood) {
    filter.neighborhood = { $regex: neighborhood, $options: "i" };
  }

  if (cuisine) {
    filter.cuisine = { $in: [new RegExp(cuisine, "i")] };
  }

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { neighborhood: { $regex: search, $options: "i" } },
    ];
  }

  const restaurants = await Restaurant.find(filter)
    .populate("adminUser", "name email role")
    .sort({ createdAt: -1 });

  res.status(200).json(new ApiResponse(200, restaurants, "Restaurants retrieved successfully"));
});

// @desc    Get restaurant profile and details
// @route   GET /api/v1/restaurants/:restaurantId
// @access  Public
export const getRestaurantById = asyncHandler(async (req, res, next) => {
  const { restaurantId } = req.params;

  const restaurant = await Restaurant.findById(restaurantId)
    .populate("adminUser", "name email")
    .populate("tables");

  if (!restaurant) {
    return next(new ApiError(404, "Restaurant not found"));
  }

  res.status(200).json(new ApiResponse(200, restaurant, "Restaurant details retrieved"));
});

// @desc    Onboard a new restaurant (with optional admin user generation)
// @route   POST /api/v1/restaurants
// @access  Private (Super Admin only)
export const createRestaurant = asyncHandler(async (req, res, next) => {
  const {
    name,
    description,
    cuisine,
    neighborhood,
    address,
    phone,
    email,
    images,
    operatingHours,
    slotDurationMinutes,
    adminEmail,
    adminPassword,
    adminName,
    adminUserId,
  } = req.body;

  // Process cuisine if sent as comma-separated string
  const cuisineList = Array.isArray(cuisine)
    ? cuisine
    : cuisine.split(",").map((c) => c.trim()).filter(Boolean);

  const restaurant = await Restaurant.create({
    name,
    description,
    cuisine: cuisineList,
    neighborhood,
    address: address || {},
    phone,
    email,
    images: images || [],
    operatingHours: operatingHours || undefined,
    slotDurationMinutes: slotDurationMinutes || 90,
  });

  // Handle Admin User Creation or Link
  let assignedAdminUser = null;

  if (adminUserId) {
    assignedAdminUser = await User.findById(adminUserId);
    if (assignedAdminUser) {
      assignedAdminUser.restaurantId = restaurant._id;
      assignedAdminUser.role = "restaurant_admin";
      await assignedAdminUser.save({ validateBeforeSave: false });
      restaurant.adminUser = assignedAdminUser._id;
      await restaurant.save();
    }
  } else if (adminEmail && adminPassword) {
    // Check if user already exists
    let existingUser = await User.findOne({ email: adminEmail });
    if (existingUser) {
      existingUser.restaurantId = restaurant._id;
      existingUser.role = "restaurant_admin";
      await existingUser.save({ validateBeforeSave: false });
      assignedAdminUser = existingUser;
    } else {
      assignedAdminUser = await User.create({
        name: adminName || `${name} Admin`,
        email: adminEmail,
        password: adminPassword,
        role: "restaurant_admin",
        restaurantId: restaurant._id,
        isEmailVerified: true, // Super admin onboarded accounts are verified by default
      });
    }

    restaurant.adminUser = assignedAdminUser._id;
    await restaurant.save();
  }

  const result = await Restaurant.findById(restaurant._id).populate("adminUser", "name email role");

  res.status(201).json(new ApiResponse(201, result, "Restaurant onboarded successfully"));
});

// @desc    Update restaurant profile
// @route   PATCH /api/v1/restaurants/:restaurantId
// @access  Private (Super Admin or assigned Restaurant Admin)
export const updateRestaurant = asyncHandler(async (req, res, next) => {
  const { restaurantId } = req.params;

  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant) {
    return next(new ApiError(404, "Restaurant not found"));
  }

  // Tenant isolation check: restaurant_admin can only update their own restaurant
  if (
    req.user.role === "restaurant_admin" &&
    req.user.restaurantId?.toString() !== restaurant._id.toString()
  ) {
    return next(new ApiError(403, "Not authorized to update another restaurant's profile"));
  }

  // Prepare updates
  const updates = { ...req.body };

  // If cuisine is string, parse to array
  if (updates.cuisine && typeof updates.cuisine === "string") {
    updates.cuisine = updates.cuisine.split(",").map((c) => c.trim()).filter(Boolean);
  }

  // Prevent restaurant_admin from changing adminUser or status
  if (req.user.role !== "super_admin") {
    delete updates.adminUser;
    delete updates.status;
  }

  const updatedRestaurant = await Restaurant.findByIdAndUpdate(
    restaurantId,
    { $set: updates },
    { new: true, runValidators: true }
  ).populate("adminUser", "name email");

  res.status(200).json(new ApiResponse(200, updatedRestaurant, "Restaurant profile updated successfully"));
});

// @desc    Delete restaurant from platform
// @route   DELETE /api/v1/restaurants/:restaurantId
// @access  Private (Super Admin only)
export const deleteRestaurant = asyncHandler(async (req, res, next) => {
  const { restaurantId } = req.params;

  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant) {
    return next(new ApiError(404, "Restaurant not found"));
  }

  // Cascade cleanup: delete tables and reservations
  await Table.deleteMany({ restaurantId });
  await Reservation.deleteMany({ restaurantId });
  await User.updateMany({ restaurantId }, { $set: { restaurantId: null, role: "diner" } });
  await restaurant.deleteOne();

  res.status(200).json(new ApiResponse(200, null, "Restaurant and associated data removed successfully"));
});

// @desc    Get tables for a restaurant
// @route   GET /api/v1/restaurants/:restaurantId/tables
// @access  Private (Super Admin or assigned Restaurant Admin)
export const getRestaurantTables = asyncHandler(async (req, res, next) => {
  const { restaurantId } = req.params;

  const tables = await Table.find({ restaurantId }).sort({ tableNumber: 1 });

  res.status(200).json(new ApiResponse(200, tables, "Restaurant tables retrieved"));
});

// @desc    Add a table to a restaurant
// @route   POST /api/v1/restaurants/:restaurantId/tables
// @access  Private (Super Admin or assigned Restaurant Admin)
export const addTable = asyncHandler(async (req, res, next) => {
  const { restaurantId } = req.params;
  const { tableNumber, capacity, location, isActive } = req.body;

  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant) {
    return next(new ApiError(404, "Restaurant not found"));
  }

  // Check duplicate tableNumber
  const existing = await Table.findOne({ restaurantId, tableNumber });
  if (existing) {
    return next(new ApiError(400, `Table ${tableNumber} already exists in this restaurant`));
  }

  const table = await Table.create({
    restaurantId,
    tableNumber,
    capacity,
    location: location || "main_floor",
    isActive: isActive !== undefined ? isActive : true,
  });

  res.status(201).json(new ApiResponse(201, table, "Table created successfully"));
});

// @desc    Update a table
// @route   PATCH /api/v1/restaurants/:restaurantId/tables/:tableId
// @access  Private (Super Admin or assigned Restaurant Admin)
export const updateTable = asyncHandler(async (req, res, next) => {
  const { restaurantId, tableId } = req.params;

  const table = await Table.findOne({ _id: tableId, restaurantId });
  if (!table) {
    return next(new ApiError(404, "Table not found"));
  }

  const updatedTable = await Table.findByIdAndUpdate(
    tableId,
    { $set: req.body },
    { new: true, runValidators: true }
  );

  res.status(200).json(new ApiResponse(200, updatedTable, "Table updated successfully"));
});

// @desc    Delete a table
// @route   DELETE /api/v1/restaurants/:restaurantId/tables/:tableId
// @access  Private (Super Admin or assigned Restaurant Admin)
export const deleteTable = asyncHandler(async (req, res, next) => {
  const { restaurantId, tableId } = req.params;

  const table = await Table.findOne({ _id: tableId, restaurantId });
  if (!table) {
    return next(new ApiError(404, "Table not found"));
  }

  // Check if active future reservations exist for this table
  const activeReservation = await Reservation.findOne({
    tableId,
    status: { $in: ["pending", "confirmed", "seated"] },
    reservationDate: { $gte: normalizeDate(new Date()) },
  });

  if (activeReservation) {
    return next(
      new ApiError(
        400,
        "Cannot delete table with active upcoming reservations. Cancel or reassign reservations first."
      )
    );
  }

  await table.deleteOne();

  res.status(200).json(new ApiResponse(200, null, "Table deleted successfully"));
});

// @desc    Check live availability for time slots on a given date and party size
// @route   GET /api/v1/restaurants/:restaurantId/availability
// @access  Public
export const getAvailability = asyncHandler(async (req, res, next) => {
  const { restaurantId } = req.params;
  const { date, partySize = 2 } = req.query;

  if (!date) {
    return next(new ApiError(400, "Date query parameter is required (YYYY-MM-DD)"));
  }

  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant || restaurant.status !== "active") {
    return next(new ApiError(404, "Active restaurant not found"));
  }

  const queryDate = normalizeDate(date);
  const dayOfWeek = new Date(date).getUTCDay();
  const daySchedule = restaurant.operatingHours.find((h) => h.dayOfWeek === dayOfWeek);

  if (!daySchedule || daySchedule.isClosed) {
    return res.status(200).json(
      new ApiResponse(
        200,
        { date, isOpen: false, availableSlots: [] },
        "Restaurant is closed on this date"
      )
    );
  }

  // Get all active tables with capacity >= partySize
  const suitableTables = await Table.find({
    restaurantId,
    isActive: true,
    capacity: { $gte: Number(partySize) },
  });

  if (suitableTables.length === 0) {
    return res.status(200).json(
      new ApiResponse(
        200,
        { date, isOpen: true, availableSlots: [] },
        "No tables with suitable capacity available for this party size"
      )
    );
  }

  // Get all active reservations on that day
  const existingReservations = await Reservation.find({
    restaurantId,
    reservationDate: queryDate,
    status: { $in: ["pending", "confirmed", "seated"] },
  });

  // Generate 30-minute time intervals between openTime and (closeTime - slotDuration)
  const openMins = timeToMinutes(daySchedule.openTime);
  const closeMins = timeToMinutes(daySchedule.closeTime);
  const duration = restaurant.slotDurationMinutes || 90;

  const availableSlots = [];

  for (let slotStart = openMins; slotStart + duration <= closeMins; slotStart += 30) {
    const slotStartTime = minutesToTime(slotStart);
    const slotEndTime = minutesToTime(slotStart + duration);

    // Find if at least one suitable table is free during this slot
    const freeTable = suitableTables.find((table) => {
      const hasConflict = existingReservations.some(
        (res) =>
          res.tableId.toString() === table._id.toString() &&
          isTimeOverlap(slotStartTime, slotEndTime, res.startTime, res.endTime)
      );
      return !hasConflict;
    });

    if (freeTable) {
      availableSlots.push({
        startTime: slotStartTime,
        endTime: slotEndTime,
        durationMinutes: duration,
        status: "available",
      });
    }
  }

  res.status(200).json(
    new ApiResponse(
      200,
      {
        restaurantId,
        date,
        partySize: Number(partySize),
        isOpen: true,
        availableSlots,
      },
      "Availability computed successfully"
    )
  );
});

// @desc    Upload photo for a restaurant (Cloudinary with fallback)
// @route   POST /api/v1/restaurants/:restaurantId/images
// @access  Private (Super Admin or assigned Restaurant Admin)
export const uploadRestaurantPhoto = asyncHandler(async (req, res, next) => {
  const { restaurantId } = req.params;

  if (!req.file) {
    return next(new ApiError(400, "Please upload an image file (field name: 'image')"));
  }

  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant) {
    return next(new ApiError(404, "Restaurant not found"));
  }

  let imageUrl = null;

  if (isCloudinaryConfigured()) {
    try {
      const uploadResult = await uploadToCloudinary(
        req.file.buffer,
        `localhost-dining/restaurants/${restaurantId}`
      );
      imageUrl = uploadResult.secure_url;
    } catch (uploadError) {
      console.error("Cloudinary upload failed:", uploadError);
      return next(new ApiError(500, `Cloudinary upload error: ${uploadError.message}`));
    }
  } else {
    // Fallback: Convert to Base64 data URI if Cloudinary credentials are not yet entered in .env
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    imageUrl = `data:${req.file.mimetype};base64,${b64}`;
  }

  // Prepend to restaurant images so the newly uploaded photo is primary
  restaurant.images.unshift(imageUrl);
  await restaurant.save();

  res.status(200).json(
    new ApiResponse(
      200,
      { images: restaurant.images, uploadedUrl: imageUrl },
      "Restaurant image uploaded successfully"
    )
  );
});

