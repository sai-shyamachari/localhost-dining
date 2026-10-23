import { check } from "express-validator";

export const createReservationValidator = [
  check("restaurantId", "A valid Restaurant ID is required").isMongoId(),
  check("reservationDate", "A valid reservation date (YYYY-MM-DD) is required").isISO8601(),
  check("startTime", "Start time must be in HH:mm 24-hour format (e.g., 19:30)")
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  check("partySize", "Party size must be between 1 and 20 guests").isInt({ min: 1, max: 20 }),
  check("guestEmail", "Invalid guest email").optional({ values: "falsy" }).isEmail(),
];

export const updateReservationStatusValidator = [
  check("status", "Status must be one of: pending, confirmed, seated, completed, cancelled, no-show")
    .isIn(["pending", "confirmed", "seated", "completed", "cancelled", "no-show"]),
  check("cancellationReason", "Cancellation reason should be text").optional().isString(),
];
