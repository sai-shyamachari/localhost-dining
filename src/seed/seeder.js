import dotenv from "dotenv";
import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { Restaurant } from "../models/restaurant.model.js";
import { Table } from "../models/table.model.js";
import { Reservation } from "../models/reservation.model.js";
import { normalizeDate } from "../utils/bookingHelper.js";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB for Seeding...");
  } catch (err) {
    console.error("MongoDB Connection Failed:", err);
    process.exit(1);
  }
};

export const seedData = async () => {
  await connectDB();

  try {
    console.log("\n🧹 Clearing existing demo data...");
    await Reservation.deleteMany();
    await Table.deleteMany();
    await Restaurant.deleteMany();
    await User.deleteMany();

    console.log("👤 Creating demo users...");
    // 1. Super Admin
    const superAdmin = await User.create({
      name: "Platform Super Admin",
      email: "superadmin@localhostdining.com",
      password: "Password123!",
      role: "super_admin",
      isEmailVerified: true,
    });

    // 2. Restaurant Admins
    const bistroAdmin = await User.create({
      name: "Marco Rossi",
      email: "admin.bistro@localhostdining.com",
      password: "Password123!",
      role: "restaurant_admin",
      isEmailVerified: true,
    });

    const sakuraAdmin = await User.create({
      name: "Kenji Sato",
      email: "admin.sakura@localhostdining.com",
      password: "Password123!",
      role: "restaurant_admin",
      isEmailVerified: true,
    });

    // 3. Diners
    const aliceDiner = await User.create({
      name: "Alice Diner",
      email: "alice.diner@example.com",
      password: "Password123!",
      role: "diner",
      isEmailVerified: true,
    });

    const bobDiner = await User.create({
      name: "Bob Diner",
      email: "bob.diner@example.com",
      password: "Password123!",
      role: "diner",
      isEmailVerified: true,
    });

    console.log("🍽️ Creating demo restaurants...");
    // 4. Restaurant 1: The Gourmet Bistro
    const bistro = await Restaurant.create({
      name: "The Gourmet Bistro",
      description: "Authentic contemporary European & Italian fine dining experience with farm-to-table ingredients.",
      cuisine: ["Italian", "French", "European"],
      neighborhood: "Downtown",
      address: {
        street: "124 Culinary Way",
        city: "Metropolis",
        state: "NY",
        zipCode: "10001",
      },
      phone: "+1 555-019-2831",
      email: "contact@gourmetbistro.com",
      images: [
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
      ],
      slotDurationMinutes: 90,
      adminUser: bistroAdmin._id,
      status: "active",
      operatingHours: [
        { dayOfWeek: 0, dayName: "Sunday", openTime: "11:00", closeTime: "22:00", isClosed: false },
        { dayOfWeek: 1, dayName: "Monday", openTime: "11:00", closeTime: "22:00", isClosed: false },
        { dayOfWeek: 2, dayName: "Tuesday", openTime: "11:00", closeTime: "22:00", isClosed: false },
        { dayOfWeek: 3, dayName: "Wednesday", openTime: "11:00", closeTime: "22:00", isClosed: false },
        { dayOfWeek: 4, dayName: "Thursday", openTime: "11:00", closeTime: "22:00", isClosed: false },
        { dayOfWeek: 5, dayName: "Friday", openTime: "11:00", closeTime: "23:00", isClosed: false },
        { dayOfWeek: 6, dayName: "Saturday", openTime: "11:00", closeTime: "23:00", isClosed: false },
      ],
    });

    // 5. Restaurant 2: Sakura Japanese Dining
    const sakura = await Restaurant.create({
      name: "Sakura Japanese Dining",
      description: "Premium traditional sushi, sashimi, and robata grilled specialties in an authentic zen atmosphere.",
      cuisine: ["Japanese", "Sushi", "Asian"],
      neighborhood: "Midtown",
      address: {
        street: "45 Blossom Boulevard",
        city: "Metropolis",
        state: "NY",
        zipCode: "10018",
      },
      phone: "+1 555-014-9922",
      email: "info@sakuradining.com",
      images: [
        "https://images.unsplash.com/photo-1579027989536-b7b1f875659b?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=800&q=80",
      ],
      slotDurationMinutes: 90,
      adminUser: sakuraAdmin._id,
      status: "active",
      operatingHours: [
        { dayOfWeek: 0, dayName: "Sunday", openTime: "12:00", closeTime: "22:00", isClosed: true }, // Off on Sundays
        { dayOfWeek: 1, dayName: "Monday", openTime: "12:00", closeTime: "22:30", isClosed: false },
        { dayOfWeek: 2, dayName: "Tuesday", openTime: "12:00", closeTime: "22:30", isClosed: false },
        { dayOfWeek: 3, dayName: "Wednesday", openTime: "12:00", closeTime: "22:30", isClosed: false },
        { dayOfWeek: 4, dayName: "Thursday", openTime: "12:00", closeTime: "22:30", isClosed: false },
        { dayOfWeek: 5, dayName: "Friday", openTime: "12:00", closeTime: "23:00", isClosed: false },
        { dayOfWeek: 6, dayName: "Saturday", openTime: "12:00", closeTime: "23:00", isClosed: false },
      ],
    });

    // Link restaurantId to respective admins
    bistroAdmin.restaurantId = bistro._id;
    await bistroAdmin.save({ validateBeforeSave: false });

    sakuraAdmin.restaurantId = sakura._id;
    await sakuraAdmin.save({ validateBeforeSave: false });

    console.log("🪑 Creating demo tables...");
    // 6. Tables for The Gourmet Bistro
    const bistroTables = await Table.insertMany([
      { restaurantId: bistro._id, tableNumber: "T1", capacity: 2, location: "main_floor" },
      { restaurantId: bistro._id, tableNumber: "T2", capacity: 2, location: "patio" },
      { restaurantId: bistro._id, tableNumber: "T3", capacity: 4, location: "main_floor" },
      { restaurantId: bistro._id, tableNumber: "T4", capacity: 4, location: "main_floor" },
      { restaurantId: bistro._id, tableNumber: "T5", capacity: 6, location: "private_room" },
      { restaurantId: bistro._id, tableNumber: "T6", capacity: 8, location: "main_floor" },
    ]);

    // 7. Tables for Sakura Japanese Dining
    const sakuraTables = await Table.insertMany([
      { restaurantId: sakura._id, tableNumber: "S1", capacity: 2, location: "bar" },
      { restaurantId: sakura._id, tableNumber: "S2", capacity: 2, location: "main_floor" },
      { restaurantId: sakura._id, tableNumber: "S3", capacity: 4, location: "main_floor" },
      { restaurantId: sakura._id, tableNumber: "S4", capacity: 4, location: "private_room" },
      { restaurantId: sakura._id, tableNumber: "S5", capacity: 6, location: "main_floor" },
    ]);

    console.log("📅 Creating demo reservations...");
    const today = new Date();
    const todayNorm = normalizeDate(today);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowNorm = normalizeDate(tomorrow);

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayNorm = normalizeDate(yesterday);

    await Reservation.insertMany([
      {
        restaurantId: bistro._id,
        userId: aliceDiner._id,
        tableId: bistroTables[0]._id, // T1 (cap 2)
        partySize: 2,
        reservationDate: todayNorm,
        startTime: "18:00",
        endTime: "19:30",
        guestName: "Alice Diner",
        guestEmail: "alice.diner@example.com",
        guestPhone: "+1 555-010-1122",
        specialRequests: "Window seat if possible please",
        status: "confirmed",
      },
      {
        restaurantId: bistro._id,
        userId: bobDiner._id,
        tableId: bistroTables[2]._id, // T3 (cap 4)
        partySize: 4,
        reservationDate: todayNorm,
        startTime: "19:30",
        endTime: "21:00",
        guestName: "Bob Diner",
        guestEmail: "bob.diner@example.com",
        guestPhone: "+1 555-010-3344",
        specialRequests: "Anniversary dinner celebration",
        status: "seated",
      },
      {
        restaurantId: sakura._id,
        userId: aliceDiner._id,
        tableId: sakuraTables[2]._id, // S3 (cap 4)
        partySize: 3,
        reservationDate: tomorrowNorm,
        startTime: "19:00",
        endTime: "20:30",
        guestName: "Alice Diner",
        guestEmail: "alice.diner@example.com",
        guestPhone: "+1 555-010-1122",
        specialRequests: "Omakase tasting request",
        status: "confirmed",
      },
      {
        restaurantId: bistro._id,
        userId: bobDiner._id,
        tableId: bistroTables[1]._id,
        partySize: 2,
        reservationDate: yesterdayNorm,
        startTime: "13:00",
        endTime: "14:30",
        guestName: "Bob Diner",
        guestEmail: "bob.diner@example.com",
        status: "completed",
      },
      {
        restaurantId: sakura._id,
        userId: bobDiner._id,
        tableId: sakuraTables[0]._id,
        partySize: 2,
        reservationDate: yesterdayNorm,
        startTime: "20:00",
        endTime: "21:30",
        guestName: "Bob Diner",
        guestEmail: "bob.diner@example.com",
        status: "cancelled",
        cancellationReason: "Change of travel plans",
      },
    ]);

    console.log("\n✅ Demo data seeded successfully!");
    console.log("-----------------------------------------------------------------");
    console.log("🔐 Credentials for testing via Postman:");
    console.log("1. Super Admin:");
    console.log("   Email: superadmin@localhostdining.com | Password: Password123!");
    console.log("2. Restaurant Admin (The Gourmet Bistro):");
    console.log("   Email: admin.bistro@localhostdining.com | Password: Password123!");
    console.log(`   Restaurant ID: ${bistro._id}`);
    console.log("3. Restaurant Admin (Sakura Japanese Dining):");
    console.log("   Email: admin.sakura@localhostdining.com | Password: Password123!");
    console.log(`   Restaurant ID: ${sakura._id}`);
    console.log("4. Diner 1:");
    console.log("   Email: alice.diner@example.com | Password: Password123!");
    console.log("5. Diner 2:");
    console.log("   Email: bob.diner@example.com | Password: Password123!");
    console.log("-----------------------------------------------------------------\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

if (process.argv[1].endsWith("seeder.js")) {
  seedData();
}
