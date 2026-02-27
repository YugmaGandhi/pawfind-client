# 🐾 PawFind — Pet Adoption Management System (Frontend)

A responsive single-page React application for managing pet adoptions, built with **Vite + React**, **TailwindCSS**, **Axios**, and **React Router v6**.

---

## Prerequisites

- **Node.js** v18+ and **npm** v9+
- The backend API server running at `http://localhost:3000` (see the server project for setup)

---

## Environment Variables

Copy `.env.example` to `.env` and set your values before running the app:

```bash
cp .env.example .env
```

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_BASE_URL` | `http://localhost:3000` | Base URL of the backend REST API |

> **Note:** Vite exposes only variables prefixed with `VITE_` to the browser bundle. Never put secrets in these variables.

---

## Getting Started

### 1. Install Dependencies
```bash
cd client
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```

The app will be available at **http://localhost:5173** by default.

### 3. Build for Production
```bash
npm run build
```

### 4. Preview the Production Build
```bash
npm run preview
```

---

## Project Structure

```
client/
├── public/
│   └── paw.svg                  # Favicon
├── src/
│   ├── api/
│   │   ├── axiosInstance.js     # Axios client with JWT interceptors
│   │   └── services.js          # All API functions (auth, pets, applications)
│   ├── components/
│   │   ├── Layout.jsx           # App shell with Navbar + Toaster
│   │   ├── LoadingSpinner.jsx   # Spinner and skeleton loaders
│   │   ├── Navbar.jsx           # Responsive nav (public/user/admin links)
│   │   ├── Pagination.jsx       # Paginator driven by API pagination object
│   │   └── StatusBadge.jsx      # Pet/application status chips
│   ├── context/
│   │   └── AuthContext.jsx      # JWT auth state, login/logout, 401 listener
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── AdminApplicationsPage.jsx   # Review + approve/reject applications
│   │   │   └── AdminPetsPage.jsx           # Full CRUD pet management
│   │   ├── ErrorPages.jsx       # 404 and 403 pages
│   │   ├── HomePage.jsx         # Pet listing with search, filters, pagination
│   │   ├── LoginPage.jsx        # Sign in form
│   │   ├── MyApplicationsPage.jsx   # User's adoption applications
│   │   ├── PetDetailPage.jsx    # Full pet info + apply button
│   │   └── RegisterPage.jsx     # Registration form
│   ├── routes/
│   │   └── ProtectedRoutes.jsx  # PrivateRoute + AdminRoute guards
│   ├── App.jsx                  # Root router configuration
│   ├── index.css                # Tailwind + global component styles
│   └── main.jsx                 # React entry point
├── API_DOCS.md                  # Backend API reference
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

---

## Features

### Public (Visitor)
- **Home page** — browse all available pets with:
  - Search bar (name or breed, debounced)
  - Dropdown filters (species, breed, age)
  - Paginated grid with responsive pet cards
- **Pet Detail page** — full info + "Apply to Adopt" button
- **Register / Login** — with field-level validation errors from the API

### Authenticated Users
- **My Applications** — table/card view of submitted applications with live status (Pending / Approved / Rejected)

### Admin Only
- **Manage Pets** — paginated data table with:
  - Add new pet (modal with photo URL preview)
  - Edit pet (pre-filled modal, status change)
  - Delete pet (confirmation modal)
- **Review Applications** — all applications across all users with:
  - Status filter tabs (All / Pending / Approved / Rejected)
  - Approve / Reject buttons with toast notifications

---

## Auth & API Integration

- JWT stored in `localStorage` and auto-attached to every protected request via **Axios request interceptor**
- **401 Unauthorized** responses are caught globally — token is cleared and the user is redirected to `/login`
- **403 Forbidden** navigates to a dedicated access-denied page
- **429 Rate Limit** shows a descriptive toast message
- All API endpoints and payload shapes strictly follow `API_DOCS.md`

---

## Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| React | 18 | UI framework |
| Vite | 5 | Build tool / dev server |
| React Router | 6 | Client-side routing |
| Axios | 1.7 | HTTP client with interceptors |
| TailwindCSS | 3.4 | Utility-first CSS |
| react-hot-toast | 2.4 | Toast notifications |

---

## Backend API

The API server is expected at `http://localhost:3000`. See `API_DOCS.md` in this directory for full endpoint reference. For Swagger UI, visit `http://localhost:3000/api/docs`.
