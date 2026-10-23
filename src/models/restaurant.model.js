import mongoose, { Schema } from "mongoose";

const operatingHoursSchema = new Schema(
  {
    dayOfWeek: {
      type: Number,
      required: true,
      min: 0,
      max: 6, // 0: Sunday, 1: Monday, ..., 6: Saturday
    },
    dayName: {
      type: String,
      enum: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    },
    openTime: {
      type: String,
      required: true,
      default: "11:00", // "HH:mm" in 24h format
    },
    closeTime: {
      type: String,
      required: true,
      default: "22:00", // "HH:mm" in 24h format
    },
    isClosed: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const restaurantSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a restaurant name"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please add a restaurant description"],
      trim: true,
    },
    cuisine: {
      type: [String],
      required: [true, "Please specify at least one cuisine type"],
      validate: [
        (val) => val.length > 0,
        "Please provide at least one cuisine",
      ],
    },
    neighborhood: {
      type: String,
      required: [true, "Please add a neighborhood"],
      trim: true,
      index: true,
    },
    address: {
      street: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      zipCode: { type: String, default: "" },
    },
    phone: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    images: {
      type: [String],
      default: [],
    },
    operatingHours: {
      type: [operatingHoursSchema],
      default: () => [
        { dayOfWeek: 0, dayName: "Sunday", openTime: "11:00", closeTime: "22:00", isClosed: false },
        { dayOfWeek: 1, dayName: "Monday", openTime: "11:00", closeTime: "22:00", isClosed: false },
        { dayOfWeek: 2, dayName: "Tuesday", openTime: "11:00", closeTime: "22:00", isClosed: false },
        { dayOfWeek: 3, dayName: "Wednesday", openTime: "11:00", closeTime: "22:00", isClosed: false },
        { dayOfWeek: 4, dayName: "Thursday", openTime: "11:00", closeTime: "22:00", isClosed: false },
        { dayOfWeek: 5, dayName: "Friday", openTime: "11:00", closeTime: "23:00", isClosed: false },
        { dayOfWeek: 6, dayName: "Saturday", openTime: "11:00", closeTime: "23:00", isClosed: false },
      ],
    },
    slotDurationMinutes: {
      type: Number,
      default: 90,
      min: 30,
      max: 240,
    },
    adminUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for tables
restaurantSchema.virtual("tables", {
  ref: "Table",
  localField: "_id",
  foreignField: "restaurantId",
  justOne: false,
});

export const Restaurant = mongoose.model("Restaurant", restaurantSchema);
