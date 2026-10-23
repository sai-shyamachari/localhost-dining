# 🍽️ LocalHost Dining — Comprehensive Platform Documentation

> **A Multi-Tenant Restaurant Reservation Platform featuring Real-Time Concurrency Control, Dynamic Table Allocation, and Multi-Role Management.**

---

## 📌 1. Executive Summary & Vision

**LocalHost Dining** is a full-stack, enterprise-grade dining reservation platform engineered to bridge passionate diners with curated local culinary establishments. Built with a focus on reliability, the platform eliminates reservation double-bookings through backend concurrency checks while offering strict multi-tenant isolation for restaurant managers and platform owners.

---

## 🏗️ 2. Architectural Overview & Tech Stack

```
                          ┌────────────────────────┐
                          │   Client / Browser     │
                          │  React + Tailwind CSS  │
                          └───────────┬────────────┘
                                      │ HTTP / REST (JWT Bearer)
                                      ▼
                          ┌────────────────────────┐
                          │   Express 5 API Server │
                          │  (Node.js ESM Modules) │
                          └─────┬────────────┬─────┘
                                │            │
                 Mongoose ODM   │            │ Nodemailer (SMTP / Mailtrap)
                                ▼            ▼
                   ┌────────────────┐    ┌────────────────┐
                   │ MongoDB Atlas  │    │  Email Inbox   │
                   │ Database Cluster│   │ (HTML Notices) │
                   └────────────────┘    └────────────────┘
```

### Backend Tech Stack
- **Runtime:** Node.js (v24.x+, ES Modules: `"type": "module"`)
- **Web Framework:** Express.js 5.x
- **Database & ODM:** MongoDB Atlas with Mongoose 9.x
- **Cloud Media Storage:** Cloudinary SDK with `multer` memory buffer streaming
- **Authentication & Security:** JSON Web Tokens (`jsonwebtoken`), `bcryptjs` password hashing, crypto verification tokens
- **Input Validation:** `express-validator` with sanitized falsy handling
- **Mailing Engine:** `nodemailer` with responsive, dark-mode ready HTML templates (Email verification, Password reset, and Reservation Confirmations directly to user's phone inbox)
- **Cross-Origin Resource Sharing:** `cors`

### Frontend Tech Stack
- **Core Framework:** React 19 + Vite
- **Routing Engine:** `react-router-dom` (HTML5 History API multi-page routing)
- **Styling & Design System:** Tailwind CSS v4 with custom glassmorphism, responsive utilities, and warm gold luxury accents
- **Typography:** *Playfair Display* (luxury editorial serif) + *Plus Jakarta Sans* (clean geometric body)
- **Icons:** `lucide-react`
- **HTTP Client:** `axios` with automated JWT request interceptors

---

## 👥 3. Roles & Permission Matrix (RBAC)

LocalHost Dining enforces strict **Role-Based Access Control** divided into three distinct personas:

| Capability / Action | Super Admin (`super_admin`) | Restaurant Admin (`restaurant_admin`) | Diner (`diner`) | Public (Unauthenticated) |
| :--- | :---: | :---: | :---: | :---: |
| **Browse Restaurants & Search Catalog** | ✅ | ✅ | ✅ | ✅ |
| **Check Live Time Slot Availability** | ✅ | ✅ | ✅ | ✅ |
| **View Restaurant Profile & Schedule** | ✅ | ✅ | ✅ | ✅ |
| **Create Reservation** | ❌ *(Admin oversight)* | ✅ *(Walk-in bookings)* | ✅ *(Personal booking)* | ❌ *(Requires Sign In)* |
| **View Personal Reservation History** | ❌ | ❌ | ✅ | ❌ |
| **Cancel Personal Reservation** | ✅ | ✅ *(Own venue only)* | ✅ *(Own booking only)* | ❌ |
| **View Daily Floor Feed & Daily Roster** | ✅ *(Global view)* | ✅ *(Assigned venue only)* | ❌ | ❌ |
| **Update Booking Status (Seated, Completed, etc.)** | ✅ | ✅ *(Assigned venue only)* | ❌ | ❌ |
| **Manage Table Inventory (Add/Delete/Toggle)** | ✅ | ✅ *(Assigned venue only)* | ❌ | ❌ |
| **Update Restaurant Details & Hours** | ✅ | ✅ *(Assigned venue only)* | ❌ | ❌ |
| **Onboard New Restaurant Tenant** | ✅ | ❌ | ❌ | ❌ |
| **Delete Restaurant Tenant & Cascade Cleanup** | ✅ | ❌ | ❌ | ❌ |
| **Cluster Health & Server Diagnostics** | ✅ | ❌ | ❌ | ✅ *(API status)* |

---

## 🔒 4. Multi-Tenant Architecture & Data Isolation

To ensure privacy and data security across multiple dining venues:
1. **Tenant Linkage:** Each `restaurant_admin` account contains an immutable `restaurantId` reference.
2. **`checkTenantAccess` Middleware:** Intercepts incoming requests containing `:restaurantId`. If a user with role `restaurant_admin` attempts to view floor feeds, create tables, or update profiles belonging to another restaurant, the request is immediately rejected with `403 Forbidden: Tenant Access Denied`.
3. **Super Admin Bypass:** Platform owners with `super_admin` role have cross-tenant clearance to supervise platform operations and troubleshoot issues.

---

## ⚡ 5. Real-Time Concurrency Control Engine

The defining engineering pillar of LocalHost Dining is its **Zero Double-Booking Guarantee**.

### How the Concurrency Engine Operates:
```
1. Client submits: { restaurantId, reservationDate, startTime, partySize }
   │
2. Operating Hours Validation
   └── Checks restaurant schedule for that day of the week (0=Sun, ..., 6=Sat).
   └── Rejects if restaurant is marked `isClosed: true` or if requested interval exceeds operating hours.
   │
3. Time Window Calculation
   └── startTime: "19:00"
   └── slotDuration: 90 minutes
   └── endTime calculated: "20:30"
   │
4. Table Candidate Selection
   └── Finds all tables where `restaurantId == target`, `isActive == true`, and `capacity >= partySize`.
   └── Sorts candidates ascending by capacity (e.g. assigns a 4-seater to a party of 3 before an 8-seater).
   │
5. Overlap Detection Query
   └── Queries active reservations (`pending`, `confirmed`, `seated`) on that restaurant and date.
   └── Overlap formula: `(startA < endB) && (endA > startB)`.
   │
6. Resolution
   ├── Available table found ➔ Assign table, set status to `confirmed`, lock reservation.
   └── All tables occupied ➔ Return HTTP 409 Conflict: "All tables for this party size are booked."
```

---

## 📦 6. Core Modules Breakdown

### 6.1 Authentication & Security (`/api/v1/auth`)
- **Registration (`POST /register`):** Creates account, hashes password using `bcryptjs` (salt rounds: 10), generates a 20-byte crypto email verification token, and dispatches a styled HTML email via Nodemailer.
- **Email Verification (`GET /verify-email/:token`):** Matches SHA-256 hashed token, marks `isEmailVerified: true`, and activates the user.
- **Login (`POST /login`):** Validates credentials, verifies email status, and issues a signed JSON Web Token (JWT) expiring in 30 days.
- **Password Recovery (`POST /forgot-password` & `POST /reset-password/:token`):** Dispatches one-time recovery tokens via email with 10-minute expiry windows.
- **Profile Inspection (`GET /me`):** Returns token holder credentials, role, and assigned tenant.

### 6.2 Tenant (Restaurant) Management (`/api/v1/restaurants`)
- **Public Directory (`GET /`):** Search by keyword (name, description), filter by `neighborhood` (e.g. Downtown, Midtown), and filter by `cuisine` (e.g. Italian, Japanese).
- **Public Availability (`GET /:restaurantId/availability`):** Dynamically computes open 30-minute reservation slots for a chosen date and party size based on operating hours and active table load.
- **Onboarding (`POST /`):** Super Admin endpoint creating restaurant profiles, weekly schedules, slot durations, and optionally auto-provisioning initial restaurant admin credentials.
- **Profile Updates (`PATCH /:restaurantId`):** Updates operating hours, images, cuisine tags, and contact details.

### 6.3 Table & Inventory Management (`/api/v1/restaurants/:restaurantId/tables`)
- **Inventory Matrix (`GET /:restaurantId/tables`):** Lists all tables with capacities and locations.
- **Add Table (`POST /`):** Registers a new physical table with compound unique index `(restaurantId, tableNumber)`.
- **Toggle State (`PATCH /:tableId`):** Activates or deactivates tables for capacity re-allocations.
- **Safe Deletion (`DELETE /:tableId`):** Prevents deletion if active upcoming bookings exist for that table.

### 6.4 Reservation Engine (`/api/v1/reservations`)
- **Booking Creation (`POST /`):** Diner or Restaurant Admin (walk-in) reservation creation with concurrency checks.
- **Diner History (`GET /my-bookings`):** Lists current user's reservations partitioned into upcoming and past bookings.
- **Daily Floor Feed (`GET /restaurant/:restaurantId`):** Chronological daily roster for floor managers, filterable by date and status.
- **Lifecycle Transitions (`PATCH /:reservationId/status`):** Transitions reservation through:
  $$\text{pending} \longrightarrow \text{confirmed} \longrightarrow \text{seated} \longrightarrow \text{completed}$$
  *(With alternative exit paths for $\text{cancelled}$ or $\text{no-show}$).*

### 6.5 System Health (`/api/v1/healthcheck`)
- Returns API status (`UP` / `DOWN`), server uptime in seconds, ISO timestamp, and live MongoDB Atlas connection status and host.

---

## 🌐 7. Multipage Frontend Application Guide

The frontend is a dedicated React application located in `frontend/` featuring dedicated routes, contexts, and components.

### Page Directory
1. **Home Page (`/`)**: Hero visual banner, live search bar, trending cuisine pills, featured venues showcase, architecture pillars, and restaurateur call-to-action banner.
2. **Explore Restaurants (`/restaurants`)**: Directory with live query-synced search, neighborhood dropdown, and cuisine filter pills.
3. **Restaurant Detail (`/restaurants/:id`)**: Cover photography showcase, weekly operating schedule table, dining window specs, and booking modal launcher.
4. **Interactive Booking Modal**: Live date selector, party size counter, dynamic 30-minute time-slot picker, special requests, and instant confirmation code display.
5. **My Bookings (`/my-bookings`)**: Diner personal concierge with tabbed views (*All*, *Upcoming & Active*, *Completed*, *Cancelled*) and cancellation modal.
6. **Floor Feed Dashboard (`/admin/dashboard`)**: Restaurant Admin console with date picker, floor metrics (*Day Bookings*, *Expected Guests*, *Currently Seated*), and one-click status transitions (**Seat Guest**, **Mark Completed**, **No-Show**, **Cancel**).
7. **Table Management (`/admin/tables`)**: Table inventory grid with seat limits, floor zone indicators (*Main Floor*, *Patio*, *Bar*, *Private Room*, *Balcony*), active toggles, and new table creation modal.
8. **Super Admin Console (`/super-admin`)**: Platform dashboard with cluster health diagnostics, active tenant directory, and tenant onboarding modal.
9. **Authentication Suite (`/login`, `/register`, `/verify-email`, `/forgot-password`)**: Sign in/up forms, celebration verification screen, and **1-Click Demo Persona Switcher**.

---

## 🗄️ 8. Database Schemas & Models

### 8.1 User Schema (`User`)
- `name`: String (required, trim)
- `email`: String (required, unique, lowercase)
- `password`: String (required, minlength: 6, hashed with bcrypt)
- `role`: String (enum: `['super_admin', 'restaurant_admin', 'diner']`, default: `'diner'`)
- `restaurantId`: ObjectId (ref: `'Restaurant'`, default: `null`)
- `isEmailVerified`: Boolean (default: `false`)
- `emailVerificationToken`: String (hashed)
- `emailVerificationExpires`: Date
- `resetPasswordToken`: String (hashed)
- `resetPasswordExpires`: Date

### 8.2 Restaurant Schema (`Restaurant`)
- `name`: String (required, trim)
- `description`: String (required)
- `cuisine`: [String] (required, array of strings)
- `neighborhood`: String (required, indexed)
- `address`: `{ street, city, state, zipCode }`
- `phone`: String
- `email`: String
- `images`: [String]
- `operatingHours`: Array of `{ dayOfWeek (0-6), dayName, openTime, closeTime, isClosed }`
- `slotDurationMinutes`: Number (default: `90`, range: `30-240`)
- `adminUser`: ObjectId (ref: `'User'`)
- `status`: String (enum: `['active', 'inactive']`, default: `'active'`)

### 8.3 Table Schema (`Table`)
- `restaurantId`: ObjectId (ref: `'Restaurant'`, required, indexed)
- `tableNumber`: String (required, e.g. `"T1"`, `"Patio-2"`)
- `capacity`: Number (required, min: 1)
- `location`: String (enum: `['main_floor', 'patio', 'bar', 'private_room', 'balcony']`)
- `isActive`: Boolean (default: `true`)
- *Index:* Compound unique index on `{ restaurantId: 1, tableNumber: 1 }`

### 8.4 Reservation Schema (`Reservation`)
- `restaurantId`: ObjectId (ref: `'Restaurant'`, required, indexed)
- `userId`: ObjectId (ref: `'User'`, required, indexed)
- `tableId`: ObjectId (ref: `'Table'`, required, indexed)
- `partySize`: Number (required, min: 1)
- `reservationDate`: Date (required, normalized to 00:00:00 UTC, indexed)
- `startTime`: String (required, format `"HH:mm"`)
- `endTime`: String (required, format `"HH:mm"`)
- `guestName`: String
- `guestEmail`: String
- `guestPhone`: String
- `specialRequests`: String
- `status`: String (enum: `['pending', 'confirmed', 'seated', 'completed', 'cancelled', 'no-show']`, default: `'confirmed'`)
- `cancellationReason`: String
- *Indexes:* Compound indexes on `{ restaurantId: 1, reservationDate: 1, status: 1 }` and `{ tableId: 1, reservationDate: 1, status: 1 }`

---

## 🔑 9. Pre-Seeded Demo Accounts & Credentials

Run `npm run seed` at any time to reset and populate these verified demo accounts:

| Persona | Role | Email | Password | Assigned Restaurant |
| :--- | :--- | :--- | :--- | :--- |
| **Super Admin** | `super_admin` | `superadmin@localhostdining.com` | `Password123!` | *Platform-wide oversight* |
| **Bistro Manager** | `restaurant_admin` | `admin.bistro@localhostdining.com` | `Password123!` | The Gourmet Bistro |
| **Sakura Manager** | `restaurant_admin` | `admin.sakura@localhostdining.com` | `Password123!` | Sakura Japanese Dining |
| **Alice (Diner)** | `diner` | `alice.diner@example.com` | `Password123!` | *Customer reservations* |
| **Bob (Diner)** | `diner` | `bob.diner@example.com` | `Password123!` | *Customer reservations* |

---

## 💻 10. Execution & Setup Commands

### Install Dependencies
```bash
# Backend dependencies
npm install

# Frontend dependencies
cd frontend && npm install && cd ..
```

### Seed Demo Data
```bash
npm run seed
```

### Development Execution (Two Terminals)
```bash
# Terminal 1: Backend API (port 8000)
npm run dev

# Terminal 2: Frontend Client (port 3000 with Hot Reload)
npm run dev:frontend
```

### Production Execution (Unified Single Port)
```bash
npm run build:frontend
npm start
```
*(Browse to `http://localhost:8000` to access the full application on a single port).*
