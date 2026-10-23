import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";

// Protect routes
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(" ")[1];
  }

  // Make sure token exists
  if (!token) {
    return next(new ApiError(401, "Not authorized to access this route"));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return next(new ApiError(401, "The user belonging to this token no longer exists."));
    }

    next();
  } catch (err) {
    return next(new ApiError(401, "Not authorized to access this route"));
  }
});

// Grant access to specific roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(
          403,
          `User role ${req.user.role} is not authorized to access this route`
        )
      );
    }
    next();
  };
};

// Enforce multi-tenant data isolation
export const checkTenantAccess = (paramKey = "restaurantId") => {
  return (req, res, next) => {
    // Super admin has platform-wide oversight
    if (req.user.role === "super_admin") {
      return next();
    }

    const targetRestaurantId =
      req.params[paramKey] || req.body[paramKey] || req.query[paramKey];

    if (!targetRestaurantId) {
      return next(new ApiError(400, "Restaurant identifier missing from request"));
    }

    if (
      req.user.role === "restaurant_admin" &&
      req.user.restaurantId &&
      req.user.restaurantId.toString() === targetRestaurantId.toString()
    ) {
      return next();
    }

    return next(
      new ApiError(
        403,
        "Tenant Access Denied: You do not have permission to access data for this restaurant"
      )
    );
  };
};
