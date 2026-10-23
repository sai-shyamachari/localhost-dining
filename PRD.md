# Product Requirements Document (PRD)

## LocalHost Dining Backend

### 1. Product Overview

**Product Name:** LocalHost Dining Backend  
**Version:** 1.0.0  
**Product Type:** Backend API for Multi-Tenant Reservation Platform

LocalHost Dining Backend is a RESTful API service designed to support a multi-tenant dining platform. The system connects diners with local restaurants, providing a centralized discovery and real-time booking engine, alongside isolated administrative dashboards for restaurant owners to manage their capacity, operating hours, and daily reservations securely using Express and Mongoose.

### 2. Target Users

- **Super Administrators:** Platform owners who onboard new restaurants, oversee global platform activities, and manage tenant statuses.
- **Restaurant Admins:** Local restaurant managers who control their specific venue's profile, manage table inventory, and oversee daily booking workflows.
- **Diners:** Public users who browse local restaurants, book tables, update their reservation status, and access their dining history.

### 3. Core Features

#### 3.1 User Authentication & Authorization

- **User Registration:** Account creation with distinct user roles.
- **User Login:** Secure authentication issuing JWT tokens.
- **Role-Based Access Control:** Three-tier permission architecture (Super Admin, Restaurant Admin, Diner) enforced via custom middleware.
- **Profile Management:** Secure access to current user details and session management.

#### 3.2 Tenant (Restaurant) Management

- **Restaurant Onboarding:** Super Admin ability to create new restaurant profiles and generate initial admin credentials.
- **Restaurant Listing:** Public discovery of restaurants with filters for neighborhood, cuisine, and availability.
- **Profile Updates:** Ability for Restaurant Admins to update operating hours, descriptions, and uploaded images.
- **Tenant Isolation:** Strict database-level isolation ensuring Restaurant Admins can only access data tied to their specific `restaurantId`.

#### 3.3 Inventory & Table Management

- **Capacity Definition:** Set maximum table configurations and default time-slot intervals (e.g., 30-minute blocks).
- **Operating Hours:** Define open/close times and specific off-days for accurate booking availability.

#### 3.4 Reservation & Booking Engine

- **Real-Time Booking:** Create reservations based on date, time, and party size.
- **Concurrency Control:** Backend aggregation logic to verify live table availability and prevent double-booking.
- **Reservation Listing:** Diners view their personal history; Restaurant Admins view chronological daily floor feeds.
- **Status Tracking:** Multi-state reservation tracking (Pending, Confirmed, Seated, Cancelled, Completed, No-Show).
- **Booking Modifications:** Capability to update or cancel existing reservations.

#### 3.5 System Health

- **Health Check:** API endpoint for system status monitoring and database connection verification.

### 4. Technical Specifications

#### 4.1 API Endpoints Structure

**Authentication Routes** (`/api/v1/auth/`)

- `POST /register` - User registration (Diner by default)
- `POST /login` - User authentication and JWT generation
- `GET /me` - Get current authenticated user info (secured)

**Restaurant Discovery & Tenant Routes** (`/api/v1/restaurants/`)

- `GET /` - List all restaurants (Public, supports query filters)
- `POST /` - Onboard new restaurant (secured, Super Admin only)
- `GET /:restaurantId` - Get restaurant profile and operating hours (Public)
- `PATCH /:restaurantId` - Update restaurant profile (secured, Restaurant Admin only)
- `DELETE /:restaurantId` - Remove restaurant from platform (secured, Super Admin only)

**Reservation Routes** (`/api/v1/reservations/`)

- `GET /my-bookings` - List current diner's reservations (secured, Diner)
- `GET /restaurant/:restaurantId` - List specific restaurant's daily reservations (secured, Restaurant Admin)
- `POST /` - Create a new reservation with concurrency checks (secured, Diner)
- `GET /:reservationId` - Get specific reservation details (secured, role-based)
- `PATCH /:reservationId/status` - Update reservation status (secured, role-based)
- `DELETE /:reservationId` - Cancel reservation (secured, role-based)

**Health Check** (`/api/v1/healthcheck/`)

- `GET /` - System health and MongoDB connection status

#### 4.2 Permission Matrix

| Feature | Super Admin | Restaurant Admin | Diner |
| :--- | :--- | :--- | :--- |
| Onboard/Delete Restaurant | ✓ | ✗ | ✗ |
| Update Restaurant Profile | ✓ | ✓ (Own only) | ✗ |
| Create Reservations | ✗ | ✓ (Walk-ins) | ✓ |
| View All Restaurant Bookings | ✓ | ✓ (Own only) | ✗ |
| Update Booking Status (Seated/No-Show) | ✗ | ✓ (Own only) | ✗ |
| Cancel Booking | ✓ | ✓ | ✓ (Own only) |
| View Personal History | ✗ | ✗ | ✓ |

#### 4.3 Data Models

**User Roles:**

- `super_admin` - Full platform oversight and tenant management.
- `restaurant_admin` - Local management scoped to a specific `restaurantId`.
- `diner` - Standard customer access.

**Reservation Status:**

- `pending` - Awaiting final confirmation.
- `confirmed` - Successfully booked and table allocated.
- `seated` - Diner has arrived and is currently dining.
- `completed` - Dining finished.
- `cancelled` - Cancelled by user or admin.
- `no-show` - Diner did not arrive.

### 5. Security Features

- JWT-based authentication for secure session management.
- Role-based authorization middleware restricting access per route.
- Strict multi-tenant data isolation ensuring queries always filter by `restaurantId`.
- Centralized custom error handling classes for consistent API error responses.
- Schema validation using Zod/Joi to sanitize incoming payloads before controller execution.
- CORS configuration for protected cross-origin resource sharing with the frontend.

### 6. File Management

- Support for image uploads (e.g., restaurant storefronts, menu items).
- Secure file handling leveraging Multer middleware.
- Image URLs and metadata stored within the Mongoose `Restaurant` schema.

### 7. Success Criteria

- Zero double-bookings through robust backend concurrency checks.
- Absolute data privacy between tenants (Restaurant A cannot view Restaurant B's data).
- Seamless integration of the API blueprint presented in this `PRD.md` with a dynamic frontend client.
- Clean, maintainable Express controllers utilizing standardized custom error responses.