import { Router as ExpressRouter } from "express";
import {
  getRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getRestaurantTables,
  addTable,
  updateTable,
  deleteTable,
  getAvailability,
  uploadRestaurantPhoto,
} from "../controllers/restaurant.controller.js";
import { protect, authorize, checkTenantAccess } from "../middlewares/auth.middleware.js";
import { uploadSingleImage } from "../middlewares/upload.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createRestaurantValidator,
  updateRestaurantValidator,
  createTableValidator,
  updateTableValidator,
} from "../validators/restaurant.validator.js";

const router = ExpressRouter();

// Public routes
router.get("/", getRestaurants);
router.get("/:restaurantId", getRestaurantById);
router.get("/:restaurantId/availability", getAvailability);

// Super Admin Only: Onboard & Delete Restaurant
router.post(
  "/",
  protect,
  authorize("super_admin"),
  createRestaurantValidator,
  validate,
  createRestaurant
);

router.delete(
  "/:restaurantId",
  protect,
  authorize("super_admin"),
  deleteRestaurant
);

// Restaurant Profile Update (Super Admin or assigned Restaurant Admin)
router.patch(
  "/:restaurantId",
  protect,
  authorize("super_admin", "restaurant_admin"),
  checkTenantAccess("restaurantId"),
  updateRestaurantValidator,
  validate,
  updateRestaurant
);

// Upload Restaurant Photo (Cloudinary)
router.post(
  "/:restaurantId/images",
  protect,
  authorize("super_admin", "restaurant_admin"),
  checkTenantAccess("restaurantId"),
  uploadSingleImage,
  uploadRestaurantPhoto
);

// Table Inventory Management (Super Admin or assigned Restaurant Admin)
router.get(
  "/:restaurantId/tables",
  protect,
  authorize("super_admin", "restaurant_admin"),
  checkTenantAccess("restaurantId"),
  getRestaurantTables
);

router.post(
  "/:restaurantId/tables",
  protect,
  authorize("super_admin", "restaurant_admin"),
  checkTenantAccess("restaurantId"),
  createTableValidator,
  validate,
  addTable
);

router.patch(
  "/:restaurantId/tables/:tableId",
  protect,
  authorize("super_admin", "restaurant_admin"),
  checkTenantAccess("restaurantId"),
  updateTableValidator,
  validate,
  updateTable
);

router.delete(
  "/:restaurantId/tables/:tableId",
  protect,
  authorize("super_admin", "restaurant_admin"),
  checkTenantAccess("restaurantId"),
  deleteTable
);

export default router;
