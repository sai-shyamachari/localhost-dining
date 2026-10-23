import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { sendEmail } from "../utils/email.js";
import { getVerificationEmailTemplate, getPasswordResetEmailTemplate } from "../utils/emailTemplates.js";
import {
  renderEmailVerifiedHtml,
  renderEmailVerificationErrorHtml,
  renderResetPasswordHtml,
} from "../utils/htmlPages.js";
import crypto from "crypto";

// Helper function to resolve dynamic base URL for email links
const getBaseUrl = (req) => {
  if (process.env.BASE_URL) return process.env.BASE_URL;
  // If host is available on the request, prioritize it so browser clicks work directly
  const host = req?.get("host");
  if (host) {
    return `${req.protocol}://${host}`;
  }
  return process.env.FRONTEND_URL || "http://localhost:8000";
};

// Helper function to get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  res.status(statusCode).json(new ApiResponse(statusCode, { token }, "Authentication successful"));
};

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
export const register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return next(new ApiError(400, "Email already in use"));
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role: role || "diner", // Default to diner
  });

  // Get verification token
  const verificationToken = user.getVerificationToken();
  await user.save({ validateBeforeSave: false });

  // Create verification url pointing to active server host
  const baseUrl = getBaseUrl(req);
  const verificationUrl = `${baseUrl}/verify-email/${verificationToken}`;
  
  // HTML Template
  const htmlTemplate = getVerificationEmailTemplate(user.name, verificationUrl);

  try {
    await sendEmail({
      email: user.email,
      subject: "Please verify your email - LocalHost Dining",
      html: htmlTemplate,
    });

    res.status(201).json(new ApiResponse(201, null, "User registered. Please check your email to verify your account."));
  } catch (err) {
    console.error(err);
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new ApiError(500, "Email could not be sent"));
  }
});

// @desc    Verify Email
// @route   GET /api/v1/auth/verify-email/:verificationtoken or GET /verify-email/:verificationtoken
// @access  Public
export const verifyEmail = asyncHandler(async (req, res, next) => {
  // Check if request is expecting HTML (e.g. direct click from email in browser)
  const isHtmlRequest =
    req.headers.accept?.includes("text/html") ||
    !req.headers.accept?.includes("application/json");

  // Get hashed token
  const verificationToken = crypto
    .createHash("sha256")
    .update(req.params.verificationtoken)
    .digest("hex");

  const user = await User.findOne({
    verificationToken,
    verificationTokenExpiry: { $gt: Date.now() },
  });

  if (!user) {
    if (isHtmlRequest) {
      return res
        .status(400)
        .send(
          renderEmailVerificationErrorHtml(
            "This verification link is invalid, has already been used, or has expired. If your account is verified, you can proceed directly to sign in.",
            "Verification Link Expired",
            "Proceed to Sign In",
            "/login"
          )
        );
    }
    return next(new ApiError(400, "Invalid or expired verification token"));
  }

  // Set new status
  user.isEmailVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpiry = undefined;
  await user.save({ validateBeforeSave: false });

  if (isHtmlRequest) {
    return res.status(200).send(renderEmailVerifiedHtml(user.name, "/login"));
  }

  res.status(200).json(new ApiResponse(200, null, "Email verified successfully"));
});

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Check for user
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ApiError(401, "Invalid credentials"));
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ApiError(401, "Invalid credentials"));
  }

  // Check if email is verified
  if (!user.isEmailVerified) {
    return next(new ApiError(401, "Please verify your email before logging in"));
  }

  sendTokenResponse(user, 200, res);
});

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json(new ApiResponse(200, user, "User details fetched"));
});

// @desc    Forgot password
// @route   POST /api/v1/auth/forgot-password
// @access  Public
export const forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ApiError(404, "There is no user with that email"));
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // Create reset url pointing to active server host
  const baseUrl = getBaseUrl(req);
  const resetUrl = `${baseUrl}/reset-password/${resetToken}`;

  const htmlTemplate = getPasswordResetEmailTemplate(user.name, resetUrl);

  try {
    await sendEmail({
      email: user.email,
      subject: "Password Reset Request - LocalHost Dining",
      html: htmlTemplate,
    });

    res.status(200).json(new ApiResponse(200, null, "Email sent"));
  } catch (err) {
    console.error(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ApiError(500, "Email could not be sent"));
  }
});

// @desc    Render reset password page (or validate token for client)
// @route   GET /api/v1/auth/reset-password/:resettoken or GET /reset-password/:resettoken
// @access  Public
export const renderResetPasswordPage = asyncHandler(async (req, res, next) => {
  const isHtmlRequest =
    req.headers.accept?.includes("text/html") ||
    !req.headers.accept?.includes("application/json");

  // Get hashed token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resettoken)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpiry: { $gt: Date.now() },
  });

  if (!user) {
    if (isHtmlRequest) {
      return res
        .status(400)
        .send(
          renderEmailVerificationErrorHtml(
            "This password reset link is invalid, has already been used, or has expired. Please request a new link.",
            "Reset Link Expired",
            "Request New Link",
            "/forgot-password"
          )
        );
    }
    return next(new ApiError(400, "Invalid or expired reset token"));
  }

  if (isHtmlRequest) {
    // Submit back to standard reset-password endpoint
    const postUrl = `/api/v1/auth/reset-password/${req.params.resettoken}`;
    return res.status(200).send(renderResetPasswordHtml(req.params.resettoken, postUrl, "/login"));
  }

  res.status(200).json(new ApiResponse(200, { valid: true }, "Token is valid"));
});

// @desc    Reset password
// @route   POST /api/v1/auth/reset-password/:resettoken
// @access  Public
export const resetPassword = asyncHandler(async (req, res, next) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resettoken)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpiry: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ApiError(400, "Invalid or expired token"));
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpiry = undefined;
  await user.save();

  sendTokenResponse(user, 200, res);
});
