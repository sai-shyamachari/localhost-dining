import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { errorHandler } from "./middlewares/error.middleware.js";

// Route files
import authRoutes from "./routes/auth.routes.js";
import restaurantRoutes from "./routes/restaurant.routes.js";
import reservationRoutes from "./routes/reservation.routes.js";
import healthRoutes from "./routes/health.routes.js";
import {
  verifyEmail,
  renderResetPasswordPage,
  resetPassword,
} from "./controllers/auth.controller.js";
import {
  resetPasswordValidator,
  validate,
} from "./validators/auth.validator.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Mount API routers
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/restaurants", restaurantRoutes);
app.use("/api/v1/reservations", reservationRoutes);
app.use("/api/v1/healthcheck", healthRoutes);

// Direct browser routes for email button clicks (supports single-port operation on 8000)
app.get("/verify-email/:verificationtoken", verifyEmail);
app.get("/reset-password/:resettoken", renderResetPasswordPage);
app.post("/reset-password/:resettoken", resetPasswordValidator, validate, resetPassword);

// Serve static frontend assets if built
const frontendDist = path.join(__dirname, "../frontend/dist");
app.use(express.static(frontendDist));

// For non-API routes, fallback to index.html to support React Router HTML5 History
app.get(/^(?!\/api).*/, (req, res, next) => {
  const indexPath = path.join(frontendDist, "index.html");
  res.sendFile(indexPath, (err) => {
    if (err) {
      // If frontend dist is not built yet, return 404
      next();
    }
  });
});

// Catch-all 404 for undefined API endpoints
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Endpoint not found: ${req.method} ${req.originalUrl}`,
  });
});

// Use centralized custom error handler
app.use(errorHandler);

export default app;
