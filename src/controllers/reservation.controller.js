import { Reservation } from "../models/reservation.model.js";
import { Restaurant } from "../models/restaurant.model.js";
import { Table } from "../models/table.model.js";
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
import { sendEmail } from "../utils/email.js";
import {
  getReservationConfirmationEmailTemplate,
  getReservationCancelledEmailTemplate,
} from "../utils/emailTemplates.js";

// @desc    Create a new reservation with robust concurrency checks
// @route   POST /api/v1/reservations
// @access  Private (Diner or Restaurant Admin for walk-ins)
export const createReservation = asyncHandler(async (req, res, next) => {
  const {
    restaurantId,
    reservationDate,
    startTime,
    partySize,
    guestName,
    guestEmail,
    guestPhone,
    specialRequests,
    tableId: requestedTableId,
  } = req.body;

  // 1. Check restaurant existence and status
  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant || restaurant.status !== "active") {
    return next(new ApiError(404, "Active restaurant not found"));
  }

  // 2. Normalize date and verify operating hours
  const normalizedReservationDate = normalizeDate(reservationDate);
  const duration = restaurant.slotDurationMinutes || 90;
  const startMins = timeToMinutes(startTime);
  const endTime = minutesToTime(startMins + duration);

  const hoursCheck = isWithinOperatingHours(
    restaurant.operatingHours,
    reservationDate,
    startTime,
    endTime
  );

  if (!hoursCheck.valid) {
    return next(new ApiError(400, hoursCheck.reason));
  }

  // 3. Find candidate tables
  let candidateTablesQuery = {
    restaurantId,
    isActive: true,
    capacity: { $gte: Number(partySize) },
  };

  if (requestedTableId) {
    candidateTablesQuery._id = requestedTableId;
  }

  // Sort candidate tables by capacity ascending (assign closest fit first)
  const candidateTables = await Table.find(candidateTablesQuery).sort({ capacity: 1 });

  if (candidateTables.length === 0) {
    return next(
      new ApiError(
        400,
        "No tables with sufficient capacity found for this restaurant and party size"
      )
    );
  }

  // 4. Concurrency Control: check overlapping active reservations on the candidate tables
  const candidateTableIds = candidateTables.map((t) => t._id);

  const conflictingReservations = await Reservation.find({
    restaurantId,
    tableId: { $in: candidateTableIds },
    reservationDate: normalizedReservationDate,
    status: { $in: ["pending", "confirmed", "seated"] },
  });

  // Find the first candidate table that has NO overlapping reservation
  const availableTable = candidateTables.find((table) => {
    const hasOverlap = conflictingReservations.some(
      (res) =>
        res.tableId.toString() === table._id.toString() &&
        isTimeOverlap(startTime, endTime, res.startTime, res.endTime)
    );
    return !hasOverlap;
  });

  if (!availableTable) {
    return next(
      new ApiError(
        409,
        "Concurrency Conflict: All tables for this party size are fully booked for the requested time. Please choose another time slot."
      )
    );
  }

  // 5. Create reservation
  const reservation = await Reservation.create({
    restaurantId,
    userId: req.user._id,
    tableId: availableTable._id,
    partySize: Number(partySize),
    reservationDate: normalizedReservationDate,
    startTime,
    endTime,
    guestName: guestName || req.user.name,
    guestEmail: guestEmail || req.user.email,
    guestPhone: guestPhone || "",
    specialRequests: specialRequests || "",
    status: "confirmed",
  });

  const populatedReservation = await Reservation.findById(reservation._id)
    .populate("restaurantId", "name address neighborhood cuisine phone")
    .populate("tableId", "tableNumber capacity location")
    .populate("userId", "name email");

  // Dispatch real-time confirmation email directly to user's phone inbox
  const recipientEmail = populatedReservation.guestEmail || populatedReservation.userId?.email;
  if (recipientEmail) {
    const emailHtml = getReservationConfirmationEmailTemplate(
      populatedReservation,
      populatedReservation.restaurantId,
      populatedReservation.tableId
    );

    sendEmail({
      email: recipientEmail,
      subject: `Reservation Confirmed: ${populatedReservation.restaurantId.name} (${populatedReservation.startTime})`,
      message: `Your reservation at ${populatedReservation.restaurantId.name} for ${populatedReservation.partySize} guests on ${populatedReservation.startTime} is confirmed. Ref: ${populatedReservation._id}`,
      html: emailHtml,
    }).catch((err) => console.error("Reservation confirmation email dispatch failed:", err));
  }

  res.status(201).json(
    new ApiResponse(
      201,
      populatedReservation,
      "Reservation successfully created and table confirmed"
    )
  );
});

// @desc    Get current diner's personal bookings
// @route   GET /api/v1/reservations/my-bookings
// @access  Private (Diner)
export const getMyBookings = asyncHandler(async (req, res) => {
  const reservations = await Reservation.find({ userId: req.user._id })
    .populate("restaurantId", "name address neighborhood phone images")
    .populate("tableId", "tableNumber capacity location")
    .sort({ reservationDate: -1, startTime: -1 });

  res.status(200).json(
    new ApiResponse(200, reservations, "Personal bookings retrieved successfully")
  );
});

// @desc    Get restaurant reservations (daily floor feed)
// @route   GET /api/v1/reservations/restaurant/:restaurantId
// @access  Private (Restaurant Admin of own restaurant, or Super Admin)
export const getRestaurantReservations = asyncHandler(async (req, res, next) => {
  const { restaurantId } = req.params;
  const { date, status } = req.query;

  // Tenant isolation check
  if (
    req.user.role === "restaurant_admin" &&
    req.user.restaurantId?.toString() !== restaurantId.toString()
  ) {
    return next(
      new ApiError(
        403,
        "Tenant Access Denied: You cannot view reservations for another restaurant"
      )
    );
  }

  const query = { restaurantId };

  if (date) {
    query.reservationDate = normalizeDate(date);
  }

  if (status) {
    query.status = status;
  }

  const reservations = await Reservation.find(query)
    .populate("userId", "name email")
    .populate("tableId", "tableNumber capacity location")
    .sort({ reservationDate: 1, startTime: 1 });

  res.status(200).json(
    new ApiResponse(200, reservations, "Restaurant floor feed retrieved successfully")
  );
});

// @desc    Get specific reservation details
// @route   GET /api/v1/reservations/:reservationId
// @access  Private (Role-based: Owner Diner, Assigned Restaurant Admin, or Super Admin)
export const getReservationById = asyncHandler(async (req, res, next) => {
  const { reservationId } = req.params;

  const reservation = await Reservation.findById(reservationId)
    .populate("restaurantId", "name neighborhood phone address")
    .populate("tableId", "tableNumber capacity location")
    .populate("userId", "name email");

  if (!reservation) {
    return next(new ApiError(404, "Reservation not found"));
  }

  // Permission check
  const isOwner = reservation.userId._id.toString() === req.user._id.toString();
  const isRestaurantAdmin =
    req.user.role === "restaurant_admin" &&
    req.user.restaurantId?.toString() === reservation.restaurantId._id.toString();
  const isSuperAdmin = req.user.role === "super_admin";

  if (!isOwner && !isRestaurantAdmin && !isSuperAdmin) {
    return next(
      new ApiError(403, "Not authorized to view details of this reservation")
    );
  }

  res.status(200).json(
    new ApiResponse(200, reservation, "Reservation details retrieved successfully")
  );
});

// @desc    Update reservation status (seated, completed, no-show, etc.)
// @route   PATCH /api/v1/reservations/:reservationId/status
// @access  Private (Restaurant Admin of own restaurant, or Super Admin)
export const updateReservationStatus = asyncHandler(async (req, res, next) => {
  const { reservationId } = req.params;
  const { status, cancellationReason } = req.body;

  const reservation = await Reservation.findById(reservationId);
  if (!reservation) {
    return next(new ApiError(404, "Reservation not found"));
  }

  // Tenant isolation check
  if (
    req.user.role === "restaurant_admin" &&
    req.user.restaurantId?.toString() !== reservation.restaurantId.toString()
  ) {
    return next(
      new ApiError(
        403,
        "Tenant Access Denied: You cannot update status for another restaurant's reservation"
      )
    );
  }

  reservation.status = status;
  if (cancellationReason) {
    reservation.cancellationReason = cancellationReason;
  }

  await reservation.save();

  const updated = await Reservation.findById(reservation._id)
    .populate("restaurantId", "name")
    .populate("tableId", "tableNumber capacity")
    .populate("userId", "name email");

  res.status(200).json(
    new ApiResponse(200, updated, `Reservation status updated to '${status}'`)
  );
});

// @desc    Cancel a reservation
// @route   DELETE /api/v1/reservations/:reservationId
// @access  Private (Diner for own booking, Restaurant Admin for own restaurant, or Super Admin)
export const cancelReservation = asyncHandler(async (req, res, next) => {
  const { reservationId } = req.params;
  const { reason } = req.body;

  const reservation = await Reservation.findById(reservationId);
  if (!reservation) {
    return next(new ApiError(404, "Reservation not found"));
  }

  const isOwner = reservation.userId.toString() === req.user._id.toString();
  const isRestaurantAdmin =
    req.user.role === "restaurant_admin" &&
    req.user.restaurantId?.toString() === reservation.restaurantId.toString();
  const isSuperAdmin = req.user.role === "super_admin";

  if (!isOwner && !isRestaurantAdmin && !isSuperAdmin) {
    return next(
      new ApiError(403, "Not authorized to cancel this reservation")
    );
  }

  if (reservation.status === "cancelled") {
    return next(new ApiError(400, "This reservation is already cancelled"));
  }

  reservation.status = "cancelled";
  reservation.cancellationReason = reason || (isOwner ? "Cancelled by diner" : "Cancelled by admin");
  await reservation.save();

  // Dispatch cancellation email to guest
  const recipientEmail = reservation.guestEmail || req.user.email;
  const restaurant = await Restaurant.findById(reservation.restaurantId);
  if (recipientEmail && restaurant) {
    const emailHtml = getReservationCancelledEmailTemplate(reservation, restaurant);
    sendEmail({
      email: recipientEmail,
      subject: `Reservation Cancelled: ${restaurant.name}`,
      message: `Your reservation at ${restaurant.name} has been cancelled.`,
      html: emailHtml,
    }).catch((err) => console.error("Reservation cancellation email dispatch failed:", err));
  }

  res.status(200).json(
    new ApiResponse(200, reservation, "Reservation cancelled successfully")
  );
});
