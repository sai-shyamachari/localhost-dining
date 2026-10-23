import { check, validationResult } from "express-validator";
import { ApiError } from "../utils/ApiError.js";

// Middleware to catch validation errors
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => `${err.path}: ${err.msg}`).join(", ");
    return next(new ApiError(400, errorMessages));
  }
  next();
};

export const registerValidator = [
  check("name", "Name must be at least 2 characters").isLength({ min: 2, max: 50 }),
  check("email", "Invalid email address").isEmail(),
  check("password", "Password must be at least 6 characters").isLength({ min: 6 }),
  check("role", "Invalid role").optional().isIn(["super_admin", "restaurant_admin", "diner"])
];

export const loginValidator = [
  check("email", "Invalid email address").isEmail(),
  check("password", "Password is required").notEmpty()
];

export const forgotPasswordValidator = [
  check("email", "Invalid email address").isEmail()
];

export const resetPasswordValidator = [
  check("password", "Password must be at least 6 characters").isLength({ min: 6 })
];
