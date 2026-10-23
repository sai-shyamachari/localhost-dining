<div align="center">

# 🍽️ LocalHost Dining

### A Multi-Tenant Restaurant Reservation Platform

*Engineered with a Zero Double-Booking Guarantee, Role-Based Access Control, and a warm luxury dining aesthetic.*

[![Node.js](https://img.shields.io/badge/Node.js-24.x-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38BDF8?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Image_Storage-3448C5?style=flat-square&logo=cloudinary&logoColor=white)](https://cloudinary.com/)

</div>

---

## 📖 Table of Contents

1. [Project Overview](#-project-overview)
2. [Tech Stack](#-tech-stack)
3. [Features at a Glance](#-features-at-a-glance)
4. [Roles & Permissions](#-roles--permissions-rbac)
5. [Application Pages & Routes](#-application-pages--routes)
6. [Installation Guide](#-installation-guide)
7. [Environment Variables](#-environment-variables)
8. [Running the App](#-running-the-app)
9. [Seeding Demo Data](#-seeding-demo-data)
10. [Demo Accounts](#-demo-accounts)
11. [API Overview](#-api-overview)
12. [Project Structure](#-project-structure)
13. [How Email Flows Work](#-how-email-flows-work)

---

## 🌟 Project Overview

**LocalHost Dining** is a full-stack, enterprise-grade dining reservation platform that connects passionate diners with curated local restaurants. It features:

- **Multi-Tenant Isolation** — Each restaurant admin only sees and manages their own venue
- **Real-Time Concurrency Engine** — Backend-enforced zero double-booking guarantee
- **Three-Tier RBAC** — Super Admin → Restaurant Admin → Diner with strict middleware enforcement
- **Cloudinary Photo Management** — Restaurant admins can upload, replace, and manage venue photos
- **One-Click Email Flows** — Email verification and password reset links open beautiful, fully functional HTML pages directly in the browser (no copy-paste, no Postman needed)
- **Full Reservation Lifecycle** — Pending → Confirmed → Seated → Completed / Cancelled / No-Show

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| **Node.js 24+ (ES Modules)** | Runtime |
| **Express.js 5** | REST API Framework |
| **MongoDB Atlas + Mongoose 9** | Database & ODM |
| **JSON Web Tokens (JWT)** | Stateless Authentication |
| **bcryptjs** | Password Hashing |
| **crypto** (built-in) | Email Verification & Reset Tokens |
| **Nodemailer** | Transactional Emails (SMTP / Gmail / Mailtrap) |
| **Cloudinary SDK + multer** | Cloud Image Upload & Management |
| **express-validator** | Request Input Validation |
| **cors** | Cross-Origin Resource Sharing |

### Frontend
| Technology | Purpose |
|---|---|
| **React 19 + Vite** | UI Framework & Dev Server |
| **React Router DOM** | Multi-Page Client-Side Routing |
| **Tailwind CSS v4** | Styling & Glassmorphism Design System |
| **Axios** | HTTP Client with JWT Interceptors |
| **lucide-react** | Icon Library |
| **Playfair Display + Plus Jakarta Sans** | Luxury Typography (Google Fonts) |

---

## ✨ Features at a Glance

### 🔐 Authentication System
- Secure registration with email verification (email link → beautiful HTML page → verified)
- JWT-based login with role detection
- Forgot password → email link → interactive HTML reset form → instant login
- All email links work directly in the browser with a single click

### 🏢 Multi-Tenant Restaurant Management
- Super Admin onboards restaurants via the platform console
- Each restaurant has its own admin with isolated data access
- Restaurant profiles include name, cuisine tags, neighborhood, address, operating hours, and photos
- Admins can upload venue photos via Cloudinary; default images shown if none uploaded

### ⚡ Concurrency-Safe Reservation Engine
1. Operating hours validated for requested date/day
2. Party size matched to available tables (smallest adequate table assigned first)
3. Active reservations overlap-checked: `(startA < endB) && (endA > startB)`
4. On conflict → `HTTP 409 Conflict` returned immediately
5. On success → reservation confirmed, table locked, confirmation email sent to user

### 📅 Full Reservation Lifecycle
```
pending → confirmed → seated → completed
                    ↘ cancelled
                    ↘ no-show
```

### 📸 Cloudinary Image Management
- Restaurant admins upload venue photos via a photo management modal
- Multiple images supported per restaurant
- Images served directly from Cloudinary CDN
- Default placeholder shown for restaurants without uploaded photos

### 📧 Transactional Emails
- **Email Verification** — sent on registration, one-click verification in browser
- **Password Reset** — sent on request, opens interactive reset form in browser
- **Reservation Confirmation** — detailed booking summary sent to diner's inbox
- **Reservation Cancellation** — notification sent when booking is released

### 🎨 Luxury UI Design
- Dark obsidian glassmorphism (`#0b0f17`) with warm gold/amber accents (`#f59e0b`)
- Playfair Display editorial serif headings
- Animated glow effects, hover lift states, status pills
- Fully responsive across mobile and desktop
- **1-Click Demo Persona Switcher** in the navbar for instant role switching

---

## 👥 Roles & Permissions (RBAC)

| Capability | Super Admin | Restaurant Admin | Diner | Public |
|---|:---:|:---:|:---:|:---:|
| Browse restaurants & search | ✅ | ✅ | ✅ | ✅ |
| View live slot availability | ✅ | ✅ | ✅ | ✅ |
| Create reservation | ✅ | ✅ *(walk-ins)* | ✅ | ❌ |
| View personal booking history | ❌ | ❌ | ✅ | ❌ |
| Cancel own reservation | ✅ | ✅ *(own venue)* | ✅ *(own booking)* | ❌ |
| View daily floor feed | ✅ *(global)* | ✅ *(own venue)* | ❌ | ❌ |
| Update booking status (Seat/Complete/No-Show) | ✅ | ✅ *(own venue)* | ❌ | ❌ |
| Manage table inventory | ✅ | ✅ *(own venue)* | ❌ | ❌ |
| Update restaurant profile & photos | ✅ | ✅ *(own venue)* | ❌ | ❌ |
| Onboard new restaurant tenant | ✅ | ❌ | ❌ | ❌ |
| Delete restaurant & cascade cleanup | ✅ | ❌ | ❌ | ❌ |
| Platform health diagnostics | ✅ | ❌ | ❌ | ✅ *(API)* |

---

## 🧭 Application Pages & Routes

| Route | Page | Access | Description |
|---|---|---|---|
| `/` | **Home** | Public | Hero search, trending cuisines, featured venues |
| `/restaurants` | **Directory** | Public | Search, neighborhood & cuisine filters |
| `/restaurants/:id` | **Restaurant Detail** | Public | Photos, schedule, booking engine |
| `/my-bookings` | **My Bookings** | Diner | Upcoming & past reservations, cancellation |
| `/admin/dashboard` | **Floor Feed** | Restaurant Admin | Daily roster, seat/complete/no-show controls |
| `/admin/tables` | **Table Inventory** | Restaurant Admin | Add, toggle, and manage tables |
| `/super-admin` | **Platform Console** | Super Admin | Health diagnostics, tenant onboarding |
| `/login` | **Sign In** | Public | Login + 1-Click Demo Persona Switcher |
| `/register` | **Register** | Public | Create diner or restaurant admin account |
| `/verify-email/:token` | **Email Verification** | Public | One-click email verification |
| `/forgot-password` | **Password Recovery** | Public | Request reset link |
| `/reset-password/:token` | **Reset Password** | Public | Interactive password reset form |

---

## 💻 Installation Guide

> **Prerequisites:** Node.js 18+ and npm installed on your machine.

### Step 1 — Clone the Repository
```bash
git clone https://github.com/your-username/localhost-dining.git
cd localhost-dining
```

### Step 2 — Install Backend Dependencies
```bash
npm install
```

### Step 3 — Install Frontend Dependencies
```bash
npm --prefix frontend install
```

### Step 4 — Set Up Environment Variables

Copy the example file and fill in your credentials:
```bash
cp .env.example .env
```

> Open `.env` and replace all placeholder values. See the [Environment Variables](#-environment-variables) section below for a detailed guide on each variable.

### Step 5 — Seed the Database with Demo Data
```bash
npm run seed
```
This populates demo restaurants, tables, and pre-verified user accounts so you can explore the app immediately.

### Step 6 — Run the Application

**Option A — Development Mode (recommended during setup):**
```bash
# Terminal 1: Backend API on port 8000
npm run dev

# Terminal 2: Frontend with Hot Reload on port 3000
npm run dev:frontend
```
Open `http://localhost:3000` in your browser.

**Option B — Unified Single-Port Mode:**
```bash
npm run build:frontend
npm start
```
Open `http://localhost:8000` — the backend serves both the API and the React frontend.

---

## 🔑 Environment Variables

Create a `.env` file in the project root. You can copy `.env.example` as your starting template.

```env
# ─────────────────────────────────────────────────────
# 1. SERVER
# ─────────────────────────────────────────────────────
PORT=8000

# ─────────────────────────────────────────────────────
# 2. MONGODB
# Get a free cluster at: https://www.mongodb.com/atlas
# Create a database user, whitelist your IP, and paste
# the connection string below.
# ─────────────────────────────────────────────────────
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/localHostDining

# ─────────────────────────────────────────────────────
# 3. JWT
# Use a long random string for JWT_SECRET (32+ chars).
# ─────────────────────────────────────────────────────
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=30d

# ─────────────────────────────────────────────────────
# 4. EMAIL / SMTP
# Option A — Mailtrap (for testing, no real emails sent):
#   Sign up free at https://mailtrap.io
#   Go to Email Testing → Inboxes → SMTP Settings
#   Copy Host, Port, Username, Password.
#
# Option B — Gmail App Password (for real email delivery):
#   Enable 2FA on Google account → App Passwords → create one.
#   SMTP_HOST=smtp.gmail.com
#   SMTP_PORT=465
#   SMTP_USER=your.gmail@gmail.com
#   SMTP_PASS=your_16_char_app_password
# ─────────────────────────────────────────────────────
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your_smtp_username_here
SMTP_PASS=your_smtp_password_here
FROM_EMAIL=reservations@localhostdining.com
FROM_NAME="LocalHost Dining"

# ─────────────────────────────────────────────────────
# 5. FRONTEND URL
# Used as a fallback. If running unified mode on port 8000,
# change this to http://localhost:8000
# ─────────────────────────────────────────────────────
FRONTEND_URL=http://localhost:3000

# ─────────────────────────────────────────────────────
# 6. CLOUDINARY (for restaurant photo uploads)
# Sign up free at https://cloudinary.com (25GB free tier)
# Go to Dashboard → copy Cloud Name, API Key, API Secret.
# ─────────────────────────────────────────────────────
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

---

## 🚀 Running the App

### Available npm Scripts

| Script | Command | Description |
|---|---|---|
| Start production | `npm start` | Runs backend serving built frontend |
| Dev backend | `npm run dev` | Nodemon hot-reload backend on port 8000 |
| Dev frontend | `npm run dev:frontend` | Vite dev server on port 3000 with HMR |
| Build frontend | `npm run build:frontend` | Compiles React app to `frontend/dist/` |
| Seed database | `npm run seed` | Wipes & re-seeds demo restaurants, tables, users |

---

## 🌱 Seeding Demo Data

Running `npm run seed` will:
1. Clear existing restaurants, tables, and users from the database
2. Create **2 demo restaurants** with full operating schedules and table inventories
3. Create **5 pre-verified user accounts** (see below)
4. Confirm seeding success in the terminal

> ⚠️ **Warning:** Seed will delete all existing data in the `restaurants`, `tables`, and `users` collections. Only run it on a fresh or test database.

---

## 🎭 Demo Accounts

After seeding, log in with any of these accounts — all passwords are `Password123!`:

| Persona | Role | Email | What You Can Do |
|---|---|---|---|
| **Platform Super Admin** | `super_admin` | `superadmin@localhostdining.com` | Manage all tenants, onboard restaurants, view global floor |
| **The Gourmet Bistro Admin** | `restaurant_admin` | `admin.bistro@localhostdining.com` | Manage Bistro tables, floor feed, upload photos |
| **Sakura Japanese Dining Admin** | `restaurant_admin` | `admin.sakura@localhostdining.com` | Manage Sakura tables, floor feed, upload photos |
| **Alice (Diner)** | `diner` | `alice.diner@example.com` | Browse, book tables, view personal reservations |
| **Bob (Diner)** | `diner` | `bob.diner@example.com` | Browse, book tables, view personal reservations |

> 💡 **Tip:** The **1-Click Demo Persona Switcher** in the top navigation bar lets you instantly switch between all demo personas without manually logging in and out.

---

## 🌐 API Overview

All endpoints are prefixed with `/api/v1`.

### Auth (`/api/v1/auth`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/register` | Register a new user (sends verification email) |
| `GET` | `/verify-email/:token` | Verify email from link (returns HTML for browser, JSON for API) |
| `POST` | `/login` | Login and receive JWT |
| `POST` | `/forgot-password` | Request password reset email |
| `GET` | `/reset-password/:token` | Open password reset form (browser) or validate token (API) |
| `POST` | `/reset-password/:token` | Submit new password |
| `GET` | `/me` | Get current authenticated user profile |

### Restaurants (`/api/v1/restaurants`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/` | Public | List/search all restaurants |
| `POST` | `/` | Super Admin | Onboard new restaurant |
| `GET` | `/:id` | Public | Get restaurant details |
| `PATCH` | `/:id` | Admin/Super | Update restaurant profile |
| `DELETE` | `/:id` | Super Admin | Delete restaurant & all data |
| `GET` | `/:id/availability` | Public | Get available time slots for a date & party size |
| `GET` | `/:id/tables` | Admin/Super | List all tables |
| `POST` | `/:id/tables` | Admin/Super | Add a new table |
| `PATCH` | `/:id/tables/:tableId` | Admin/Super | Update/toggle table |
| `DELETE` | `/:id/tables/:tableId` | Admin/Super | Delete table (if no active bookings) |
| `POST` | `/:id/images` | Admin/Super | Upload restaurant photo to Cloudinary |
| `DELETE` | `/:id/images` | Admin/Super | Remove restaurant photo |

### Reservations (`/api/v1/reservations`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/` | Diner/Admin | Create reservation (with concurrency check) |
| `GET` | `/my-bookings` | Diner | Get own reservation history |
| `GET` | `/restaurant/:restaurantId` | Admin/Super | Daily floor feed |
| `PATCH` | `/:id/status` | Admin/Super | Update reservation status |
| `DELETE` | `/:id` | Diner/Admin/Super | Cancel reservation |

### Health (`/api/v1/healthcheck`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Returns API status, uptime, and MongoDB connection state |

---

## 📁 Project Structure

```
localhost-dining/
│
├── src/                          # Backend (Node.js / Express)
│   ├── config/
│   │   └── cloudinary.js         # Cloudinary SDK setup
│   ├── controllers/
│   │   ├── auth.controller.js    # Auth, verification, reset, HTML pages
│   │   ├── restaurant.controller.js
│   │   └── reservation.controller.js
│   ├── middlewares/
│   │   ├── auth.middleware.js    # JWT verification & role protection
│   │   ├── error.middleware.js   # Centralized error handler
│   │   └── upload.middleware.js  # Multer (memory) + Cloudinary stream
│   ├── models/
│   │   ├── user.model.js         # User schema, bcrypt hooks, crypto tokens
│   │   ├── restaurant.model.js
│   │   ├── table.model.js
│   │   └── reservation.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── restaurant.routes.js
│   │   ├── reservation.routes.js
│   │   └── health.routes.js
│   ├── seed/
│   │   └── seeder.js             # Demo data seeder
│   ├── utils/
│   │   ├── ApiError.js           # Custom error class
│   │   ├── ApiResponse.js        # Standardized response wrapper
│   │   ├── asyncHandler.js       # Async try/catch wrapper
│   │   ├── email.js              # Nodemailer transporter
│   │   ├── emailTemplates.js     # HTML email templates
│   │   └── htmlPages.js          # Self-contained HTML pages (verify/reset)
│   ├── validators/
│   │   └── auth.validator.js     # express-validator rules
│   ├── app.js                    # Express app setup, routes, static serving
│   └── index.js                  # Server entry point
│
├── frontend/                     # Frontend (React / Vite)
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js         # Axios instance with JWT interceptors
│   │   ├── components/           # Navbar, Footer, ProtectedRoute, etc.
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Global auth state (user, token, login/logout)
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── RestaurantsPage.jsx
│   │   │   ├── RestaurantDetailPage.jsx
│   │   │   ├── MyBookingsPage.jsx
│   │   │   ├── AdminDashboardPage.jsx
│   │   │   ├── AdminTablesPage.jsx
│   │   │   ├── SuperAdminPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── VerifyEmailPage.jsx
│   │   │   └── ResetPasswordPage.jsx
│   │   └── App.jsx               # Router & protected route setup
│   └── vite.config.js            # Vite + Tailwind + proxy setup
│
├── .env.example                  # Template for environment variables
├── .gitignore                    # Ignores .env, node_modules, dist, scratch
├── package.json                  # Backend scripts & dependencies
├── DOCUMENTATION.md              # Full technical documentation
└── README.md                     # This file
```

---

## 📧 How Email Flows Work

Email links in LocalHost Dining are **fully functional from a single click** — no copy-pasting tokens, no Postman needed.

### Email Verification
1. User registers → verification email sent to their inbox
2. User clicks the **"Click here to confirm your account"** button in the email
3. Browser opens `http://localhost:8000/verify-email/<token>`
4. Express renders a beautiful **"Email Verified! ✅"** HTML page directly
5. User clicks **"Proceed to Sign In"** and logs in immediately

### Password Reset
1. User requests a reset → recovery email sent to their inbox
2. User clicks the **"Reset Password"** button in the email
3. Browser opens `http://localhost:8000/reset-password/<token>`
4. Express renders an interactive **"Set New Password"** HTML form directly
5. User types and confirms new password → submits → gets a success confirmation
6. User clicks **"Sign In Now"** and logs in with their new password

> **How it stays developer-friendly:** API clients (Postman, curl) sending `Accept: application/json` always get standard JSON responses. The HTML pages are only served to real browser clicks.

---

## 🔒 Security Notes

- **`.env` is git-ignored** — never committed. Use `.env.example` as the template.
- Passwords hashed with **bcryptjs** (10 salt rounds)
- Email verification and reset tokens are **SHA-256 hashed** before storage in MongoDB
- JWT tokens expire in 30 days
- Restaurant admins are **tenant-isolated** — middleware blocks cross-tenant access with `403 Forbidden`
- Input validation with **express-validator** on all auth and mutation endpoints

---

## 👨‍💻 Author

**Sai Shyam Achari**

---

<div align="center">
<sub>Built with ☕ and precision concurrency logic.</sub>
</div>
