import { Router as ExpressRouter } from "express";
import mongoose from "mongoose";

const router = ExpressRouter();

router.get("/", (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatusMap = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };

  const isDbHealthy = dbState === 1;

  res.status(isDbHealthy ? 200 : 503).json({
    success: isDbHealthy,
    status: isDbHealthy ? "UP" : "DOWN",
    message: isDbHealthy
      ? "LocalHost Dining API and Database are operational"
      : "Database connection degraded",
    uptime: `${Math.floor(process.uptime())} seconds`,
    timestamp: new Date().toISOString(),
    database: {
      status: dbStatusMap[dbState] || "unknown",
      host: mongoose.connection.host || null,
      name: mongoose.connection.name || null,
    },
  });
});

export default router;
