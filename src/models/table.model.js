import mongoose, { Schema } from "mongoose";

const tableSchema = new Schema(
  {
    restaurantId: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
      required: [true, "Restaurant reference is required"],
      index: true,
    },
    tableNumber: {
      type: String,
      required: [true, "Please provide a table number or identifier"],
      trim: true,
    },
    capacity: {
      type: Number,
      required: [true, "Please specify seating capacity"],
      min: [1, "Capacity must be at least 1"],
    },
    location: {
      type: String,
      enum: ["main_floor", "patio", "bar", "private_room", "balcony"],
      default: "main_floor",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure tableNumber is unique per restaurant
tableSchema.index({ restaurantId: 1, tableNumber: 1 }, { unique: true });

export const Table = mongoose.model("Table", tableSchema);
