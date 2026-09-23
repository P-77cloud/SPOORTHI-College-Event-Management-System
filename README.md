# SPOORTHI – College Event Management System

SPOORTHI is a full-stack, production-ready college event management platform built with **Node.js**, **Express.js**, **MongoDB / Mongoose**, **React.js (Vite)**, **JWT Authentication**, and **Role-Based Authorization**.

---

## 1. Project Overview
SPOORTHI provides a unified portal for three user roles:
- **ADMIN**: Creates coordinators, manages all events, oversees student registrations, views mock payment logs, and analyzes festival statistics via interactive charts.
- **COORDINATOR**: Manages ONLY assigned events, views registered participant lists with contact details, marks student attendance (Present/Absent), and broadcasts event announcements.
- **STUDENT**: Browses 15 flagship fest events, filters by category (Cultural, Arts, Technical/Academic, Sports), registers for FREE or ₹30 paid events, completes mock payments, tracks attendance status, and receives real-time notifications.

---

## 2. Features
- 🔐 **Secure Role-Based Access**: Role validation enforced at database, API middleware, and React route guard levels.
- 🎨 **Modern College Fest Design System**: Glassmorphic UI featuring vibrant HSL color accents, dark mode aesthetic, responsive cards, and micro-animations.
- 🎟️ **15 Flagship Competitions**: Pre-seeded events across Quiz, Rangoli, 1 Minute, Poster Making, Mono Acting, Debate, Mehendi, Face Painting, Nail Art, Throwball, Volleyball, Badminton, Essay Writing, Song, and Dance.
- 💳 **₹30 Mock Payment Integration**: Realistic mock payment gateway simulating UPI QR Code scanning, Card authentication, and NetBanking with confetti feedback and instant transaction generation.
- 📱 **Digital QR Pass**: Ticket modal with unique Registration ID and entry gate QR code simulation.
- 📊 **Analytics Dashboard**: Interactive charts powered by Recharts visualizing category trends, revenue streams, and attendance rates.
- 🔔 **Notification Engine**: System alerts for registration updates, mock payment receipts, venue changes, and coordinator broadcasts.

---

## 3. Technology Stack
- **Frontend**: React.js 18, Vite, React Router v6, Axios, Lucide React Icons, Recharts, Canvas-Confetti.
- **Backend**: Node.js, Express.js REST API, Mongoose ORM, JSON Web Tokens (JWT), Bcryptjs, CORS.
- **Database**: MongoDB (Local or MongoDB Atlas).

---

## 4. Architecture & Folder Structure

```
SPOORTHI/
├── package.json               # Root scripts (dev, server, client, seed)
├── README.md                  # Complete documentation
├── client/                    # Vite React Frontend
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── assets/
│       ├── components/        # Navbar, Footer, ProtectedRoute, EventCard, QRBadgeModal
│       ├── context/           # AuthContext, ToastContext
│       ├── layouts/
│       ├── pages/             # Home, Events, EventDetails, Login, Register, Dashboards
│       │   ├── admin/         # AdminDashboard, AdminEvents, AdminCoordinators, AdminAnalytics, etc.
│       │   ├── coordinator/   # CoordinatorDashboard, CoordinatorEvents, CoordinatorParticipants, etc.
│       │   └── student/       # StudentDashboard, StudentRegistrations, MockPaymentPage, etc.
│       ├── routes/            # AppRoutes
│       ├── services/          # api.js Axios configuration
│       └── index.css          # Glassmorphism & Fest Design System
└── server/                    # Express REST API Backend
    ├── .env.example
    ├── package.json
    ├── server.js              # Express app entry point
    ├── config/                # db.js Mongoose connection setup
    ├── controllers/           # authController, eventController, registrationController, etc.
    ├── middleware/            # authMiddleware, authorizeMiddleware, eventOwnershipMiddleware, errorMiddleware
    ├── models/                # User, Event, Registration, Payment, Attendance, Notification
    ├── routes/                # authRoutes, eventRoutes, registrationRoutes, paymentRoutes, etc.
    ├── seed/                  # seed.js Database seed script
    └── utils/                 # generateToken.js
```

---

## 5. MongoDB & Environment Configuration

### Server Environment (`server/.env`):
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/spoorthi_db
JWT_SECRET=spoorthi_super_secret_jwt_key_2026_fest
CLIENT_URL=http://localhost:5173
```

### Client Environment (`client/.env`):
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 6. Demo Credentials & Database Seeding

To seed demo users and the exact 15 fest events:
```bash
npm run seed
```

### Seeded Credentials:
- **ADMIN**: `admin@spoorthi.com` / Password: `Spoorthi@123`
- **COORDINATOR**: `coordinator@spoorthi.com` / Password: `Spoorthi@123`
- **STUDENT**: `student@gmail.com` / Password: `Spoorthi@123`

---

## 7. How to Run the Application

### 1. Install All Dependencies:
```bash
npm run install:all
```
*(or run `npm install` inside `server/` and `client/` separately)*

### 2. Seed Database:
```bash
npm run seed
```

### 3. Start Backend & Frontend Concurrently:
```bash
npm run dev
```

The application will launch at:
- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000/api`

---

## 8. Key Workflows & API Reference

### Authentication API
- `POST /api/auth/register`: Student registration with USN, Department, Phone.
- `POST /api/auth/login`: Email & Password authentication for all roles.
- `GET /api/auth/profile`: Get logged-in user profile.

### Events API
- `GET /api/events`: List events with category & search filters.
- `GET /api/events/:id`: Get full event details & rules.
- `POST /api/events`: Admin creates new event & assigns coordinator.
- `PUT /api/events/:id`: Update event venue, dates, or rules.
- `DELETE /api/events/:id`: Cancel/delete event & notify registered students.

### Registrations & Mock Payments API
- `POST /api/registrations`: Register student for an event (generates unique `REG-SPOORTHI-XXXXXX` ID).
- `GET /api/registrations/my`: Fetch student's registered passes.
- `POST /api/payments`: Process ₹30 mock payment (generates `TXN-SPOORTHI-XXXXXX` ID).

### Attendance & Notifications API
- `POST /api/attendance`: Coordinator marks student Present/Absent.
- `GET /api/notifications`: Retrieve student notification alerts.
- `POST /api/notifications/announcement`: Coordinator broadcasts message to event participants.

---

## 9. Troubleshooting & Verification
- **MongoDB Connection Error**: Ensure MongoDB service is running locally on port 27017 (`mongodb://127.0.0.1:27017/spoorthi_db`).
- **Authorization Failures**: Pass JWT Bearer token in request headers (`Authorization: Bearer <token>`).
- **Coordinator Access**: Coordinators can only manage events where `event.coordinator` matches their user ID. Attempting to access another coordinator's event returns `403 Access Denied`.
