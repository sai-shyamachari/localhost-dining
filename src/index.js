import dotenv from "dotenv";
import connectDB from "./config/db.js";
import app from "./app.js";

// Load env vars
dotenv.config();

// Connect to database
connectDB()
  .then(() => {
    const PORT = process.env.PORT || 8000;
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    // Handle unhandled promise rejections
    process.on("unhandledRejection", (err, promise) => {
      console.log(`Error: ${err.message}`);
      // Close server & exit process
      server.close(() => process.exit(1));
    });
  })
  .catch((err) => {
    console.log("MongoDB connection failed !!! ", err);
  });
