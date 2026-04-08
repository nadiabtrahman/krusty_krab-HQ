# Krusty Krab HQ — Auth PERN Practice Task

**Date:** 2026-04-07
**Topic:** JWT Authentication + Protected Routes
**Stack:** PostgreSQL · Express · React · Node.js

---

## Overview

A full-stack employee management system for the Krusty Krab, built to practice JWT authentication and role-based protected routes in a PERN stack. Features two role-based portals — one for managers (Mr. Krabs) and one for crew members.

---

## Features

### Auth
- JWT login with bcrypt password hashing
- Token stored in `sessionStorage`, attached to all requests via Axios interceptor
- Auth middleware on all protected routes
- Role-based access: `Manager` vs `crew`

### Manager Dashboard (`/admin-dashboard`)
- View and edit all staff details (name, role, hourly rate, bio, birthday, email)
- Hiring queue — hire or reject applicants
- Staff attendance monitor (auto-refreshes every 15 seconds)
- Clock in / Clock out

### Krew Portal (`/crew-portal`)
- Personal attendance history
- Personal todo list (add, check off, delete)
- Edit own profile (email, birthday)
- Clock in / Clock out

### Public Pages
- Home with navigation cards
- Krusty Krew Registry (crew cards + employee detail pages)
- Galley Grub Menu (tabbed; Manager can edit items inline)
- Join the Krew application form (hidden when logged in)

---

## Project Structure

```
├── client/                  # React + Vite frontend
│   └── src/
│       ├── api/
│       │   └── axios.js         # Axios instance with auth interceptor
│       ├── assets/
│       │   └── styles.css       # Global Krusty Krab theme styles
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── Login.jsx
│       │   ├── EmployeeCard.jsx
│       │   ├── ApplyForm.jsx
│       │   ├── HiringQueue.jsx
│       │   ├── StaffStatus.jsx
│       │   ├── MyAttendance.jsx
│       │   ├── MyTodos.jsx
│       │   └── EditProfile.jsx
│       └── pages/
│           ├── Home.jsx
│           ├── Menu.jsx
│           ├── CrewRegistry.jsx
│           ├── EmployeeDetails.jsx
│           ├── Apply.jsx
│           ├── AdminDashboard.jsx
│           └── CrewPortal.jsx
│
└── server/                  # Express + Node.js backend
    ├── middleware/
    │   └── auth.js              # JWT verification middleware
    ├── routes/
    │   ├── auth.js              # POST /auth/login
    │   ├── crew.js              # Crew routes + own profile
    │   ├── admin.js             # Applications, hiring, staff management
    │   ├── attendance.js        # Clock in/out + own history
    │   ├── todos.js             # Personal todo CRUD
    │   ├── upload.js            # Staff photo upload (multer)
    │   └── public.js            # Menu, apply form
    ├── public/
    │   └── staff/               # Uploaded staff photos
    ├── db.js                    # PostgreSQL pool
    └── index.js                 # Express app entry point
```

---

## Database Setup

```sql
CREATE DATABASE krusty_krab;
\c krusty_krab

CREATE TABLE staff (
  id          SERIAL PRIMARY KEY,
  name        TEXT,
  role        TEXT,
  hourly_rate NUMERIC,
  hired_at    TIMESTAMP DEFAULT NOW(),
  image       TEXT,
  bio         TEXT,
  birth_date  DATE,
  email       TEXT
);

CREATE TABLE users (
  id            SERIAL PRIMARY KEY,
  username      TEXT UNIQUE,
  password_hash TEXT,
  staff_id      INTEGER REFERENCES staff(id)
);

CREATE TABLE applications (
  id         SERIAL PRIMARY KEY,
  name       TEXT,
  email      TEXT,
  birth_date DATE,
  status     TEXT DEFAULT 'pending'
);

CREATE TABLE attendance (
  id            SERIAL PRIMARY KEY,
  staff_id      INTEGER REFERENCES staff(id),
  status        TEXT DEFAULT 'active',
  clock_in_time TIMESTAMP DEFAULT NOW()
);

CREATE TABLE menu_items (
  id          SERIAL PRIMARY KEY,
  name        TEXT,
  description TEXT,
  price       NUMERIC,
  category    TEXT,
  image_url   TEXT
);

CREATE TABLE todos (
  id         SERIAL PRIMARY KEY,
  staff_id   INTEGER REFERENCES staff(id) ON DELETE CASCADE,
  task       TEXT NOT NULL,
  completed  BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Environment Variables

Create `server/.env`:

```
DB_PASSWORD=your_postgres_password
JWT_SECRET=your_jwt_secret
PORT=5000
```

---

## Getting Started

```bash
# Server
cd server
npm install
nodemon index.js

# Client (separate terminal)
cd client
npm install
npm run dev
```

Client: `http://localhost:5173` · Server: `http://localhost:5000`

---

## API Routes

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/auth/login` | — | — | Login, returns JWT |
| GET | `/crew` | — | — | All staff |
| GET | `/crew/:id` | — | — | Single staff member |
| GET | `/crew/me` | ✅ | Any | Own profile |
| PATCH | `/crew/me` | ✅ | Any | Update own email / birthday |
| GET | `/menu` | — | — | All menu items |
| PUT | `/menu/:id` | ✅ | Manager | Edit menu item |
| POST | `/apply` | — | — | Submit job application |
| GET | `/admin/applications` | ✅ | Manager | All applications |
| PATCH | `/admin/applications/:id/status` | ✅ | Manager | Reject application |
| POST | `/admin/hire` | ✅ | Manager | Hire applicant, create user account |
| GET | `/admin/staff-status` | ✅ | Manager | Staff + live attendance status |
| PUT | `/admin/staff/:id` | ✅ | Manager | Edit staff details |
| GET | `/attendance/my` | ✅ | Any | Own attendance records |
| POST | `/attendance/clock-in` | ✅ | Any | Clock in |
| POST | `/attendance/clock-out` | ✅ | Any | Clock out |
| GET | `/todos` | ✅ | Any | Own todos |
| POST | `/todos` | ✅ | Any | Add todo |
| PATCH | `/todos/:id/toggle` | ✅ | Any | Toggle complete |
| DELETE | `/todos/:id` | ✅ | Any | Delete todo |
| POST | `/upload/staff-photo` | ✅ | Any | Upload staff photo |
