import mongoose, { Schema } from "mongoose";

const reservationSchema = new Schema(
  {
    restaurantId: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
      required: [true, "Restaurant is required"],
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
      index: true,
    },
    tableId: {
      type: Schema.Types.ObjectId,
      ref: "Table",
      required: [true, "Table assignment is required"],
      index: true,
    },
    partySize: {
      type: Number,
      required: [true, "Please specify party size"],
      min: [1, "Party size must be at least 1"],
    },
    reservationDate: {
      type: Date,
      required: [true, "Please specify reservation date"],
      index: true,
    },
    startTime: {
      type: String,
      required: [true, "Start time is required (HH:mm)"],
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Start time must be in HH:mm format"],
    },
    endTime: {
      type: String,
      required: [true, "End time is required (HH:mm)"],
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "End time must be in HH:mm format"],
    },
    guestName: {
      type: String,
      trim: true,
    },
    guestEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    guestPhone: {
      type: String,
      trim: true,
    },
    specialRequests: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "seated", "completed", "cancelled", "no-show"],
      default: "confirmed",
      index: true,
    },
    cancellationReason: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for availability check and fast daily floor feed
reservationSchema.index({ restaurantId: 1, reservationDate: 1, status: 1 });
reservationSchema.index({ tableId: 1, reservationDate: 1, status: 1 });

export const Reservation = mongoose.model("Reservation", reservationSchema);
