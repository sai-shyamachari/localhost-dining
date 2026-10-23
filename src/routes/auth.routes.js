import { Router as ExpressRouter } from "express";
import {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  renderResetPasswordPage,
  verifyEmail,
} from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import {
  validate,
  registerValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} from "../validators/auth.validator.js";

const router = ExpressRouter();

router.post("/register", registerValidator, validate, register);
router.post("/login", loginValidator, validate, login);
router.get("/verify-email/:verificationtoken", verifyEmail);
router.post("/forgot-password", forgotPasswordValidator, validate, forgotPassword);
router.get("/reset-password/:resettoken", renderResetPasswordPage);
router.post(
  "/reset-password/:resettoken",
  resetPasswordValidator,
  validate,
  resetPassword
);
router.get("/me", protect, getMe);

export default router;
