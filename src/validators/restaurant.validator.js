import { check } from "express-validator";

export const createRestaurantValidator = [
  check("name", "Restaurant name is required and must be at least 2 characters")
    .trim()
    .isLength({ min: 2 }),
  check("description", "Description is required").trim().notEmpty(),
  check("cuisine", "Please provide at least one cuisine type")
    .custom((val) => {
      if (Array.isArray(val) && val.length > 0) return true;
      if (typeof val === "string" && val.trim().length > 0) return true;
      throw new Error("Cuisine must be an array of strings or a comma-separated string");
    }),
  check("neighborhood", "Neighborhood is required").trim().notEmpty(),
  check("email", "Please provide a valid email").optional({ values: "falsy" }).isEmail(),
  check("slotDurationMinutes", "Slot duration must be between 30 and 240 minutes")
    .optional()
    .isInt({ min: 30, max: 240 }),
];

export const updateRestaurantValidator = [
  check("name", "Restaurant name must be at least 2 characters")
    .optional()
    .trim()
    .isLength({ min: 2 }),
  check("email", "Please provide a valid email").optional({ values: "falsy" }).isEmail(),
  check("status", "Status must be active or inactive")
    .optional()
    .isIn(["active", "inactive"]),
  check("slotDurationMinutes", "Slot duration must be between 30 and 240 minutes")
    .optional()
    .isInt({ min: 30, max: 240 }),
];

export const createTableValidator = [
  check("tableNumber", "Table number or identifier is required").trim().notEmpty(),
  check("capacity", "Capacity must be an integer of at least 1").isInt({ min: 1 }),
  check("location", "Invalid table location")
    .optional()
    .isIn(["main_floor", "patio", "bar", "private_room", "balcony"]),
];

export const updateTableValidator = [
  check("tableNumber", "Table number cannot be empty").optional().trim().notEmpty(),
  check("capacity", "Capacity must be an integer of at least 1").optional().isInt({ min: 1 }),
  check("location", "Invalid table location")
    .optional()
    .isIn(["main_floor", "patio", "bar", "private_room", "balcony"]),
  check("isActive", "isActive must be a boolean").optional().isBoolean(),
];
