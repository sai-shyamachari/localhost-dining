import { Router as ExpressRouter } from "express";
import {
  createReservation,
  getMyBookings,
  getRestaurantReservations,
  getReservationById,
  updateReservationStatus,
  cancelReservation,
} from "../controllers/reservation.controller.js";
import { protect, authorize, checkTenantAccess } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createReservationValidator,
  updateReservationStatusValidator,
} from "../validators/reservation.validator.js";

const router = ExpressRouter();

// Diner's personal bookings
router.get("/my-bookings", protect, authorize("diner"), getMyBookings);

// Restaurant's daily floor feed
router.get(
  "/restaurant/:restaurantId",
  protect,
  authorize("super_admin", "restaurant_admin"),
  checkTenantAccess("restaurantId"),
  getRestaurantReservations
);

// Create reservation (Diner booking or Restaurant Admin booking walk-in)
router.post(
  "/",
  protect,
  authorize("diner", "restaurant_admin"),
  createReservationValidator,
  validate,
  createReservation
);

// Get specific reservation details
router.get("/:reservationId", protect, getReservationById);

// Update reservation status (seated, completed, no-show, etc.)
router.patch(
  "/:reservationId/status",
  protect,
  authorize("super_admin", "restaurant_admin"),
  updateReservationStatusValidator,
  validate,
  updateReservationStatus
);

// Cancel reservation
router.delete("/:reservationId", protect, cancelReservation);

export default router;
