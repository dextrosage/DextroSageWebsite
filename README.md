# DextroSage Frontend

A modern, responsive, and secure frontend portal built for the **DextroSage FastAPI Backend** utilizing React, TypeScript, Vite, Tailwind CSS, and Axios.

## Tech Stack
* **Framework**: React 19 + TypeScript + Vite
* **Routing**: React Router DOM (with protected, role-based sub-routes)
* **State Management**: React Context API (`AuthContext`, `ToastContext`)
* **Styling**: Tailwind CSS v3 (Blue, White, and Gray color theme with soft shadows and hover effects)
* **HTTP Client**: Axios (configured with request/response interceptors to automatically rotate expired access tokens using the refresh token flow)
* **Icons**: Lucide React

---

## Folder Structure
```text
src/
├── assets/           # Global assets and static graphics
├── components/       # Reusable components
│   ├── ui/           # Base design-system components (Button, Input, Card, Modal, Loader, Toast)
│   ├── ProtectedRoute.tsx # Route-guard checking authentication and roles
│   ├── UserCard.tsx       # User display card
│   └── SessionCard.tsx    # Active session details card
├── contexts/         # React Context stores
│   ├── AuthContext.tsx    # Session state, login, logout, and signup wrappers
│   └── ToastContext.tsx   # Floating notification actions
├── layouts/          # Wrapper templates
│   └── DashboardLayout.tsx # Responsive sidebar layouts for desktop & mobile
├── pages/            # Complete routes
│   ├── Login.tsx     # Username/password/phno forms
│   ├── admin/        # Admin restricted views (Dashboard, MemberSessions, Profile)
│   └── user/         # Standard user views (Dashboard, Profile)
├── services/         # API abstraction layer
│   ├── api.ts        # Axios base configurations & refresh queues
│   ├── authService.ts # Login/signup/logout route calls
│   ├── userService.ts # Client data operations
│   └── adminService.ts # Admin authorization operations
├── types/            # TypeScript type & interface declarations
├── utils/            # Utilities & helper methods
│   └── jwt.ts        # Decodes token exp and sub parameters
├── App.css           # Custom styles overrides
├── App.tsx           # Router mappings
├── index.css         # Tailwind compiler directives
└── main.tsx          # React application bootstrapping mount
```

---

## Setup & Running Locally

### 1. Prerequisites
Make sure you have [Node.js](https://nodejs.org) (v18+) installed.

### 2. Configure Environment
Create a `.env` file in the root directory (or copy from `.env.example`):
```bash
cp .env.example .env
```
Ensure it points to your running FastAPI backend server:
```env
VITE_API_BASE_URL=http://localhost:8000
```

### 3. Install Dependencies
Run the installation command in the project directory:
```bash
npm install
```

### 4. Start Local Development Server
Launch the Vite dev server:
```bash
npm run dev
```
Open your browser and navigate to the printed local URL (typically `http://localhost:5173`).

### 5. Build for Production
To check types and compile a highly optimized static bundle:
```bash
npm run build
```
This outputs build artifacts into the `dist/` directory, ready to be served by any static host (Nginx, Vercel, Netlify, etc.).

---

## Key Technical Features

### 1. Seamless JWT Refresh Rotation
The Axios instance in `src/services/api.ts` automatically attaches the active access token as a bearer header for every API request.
* If an API request fails with a `401 Unauthorized` status (due to token expiration):
  1. The response interceptor locks incoming traffic and starts the refresh token rotation (`POST /auth/login` token pair).
  2. If multiple requests fail simultaneously, they are placed in a queue rather than spawning redundant refresh calls.
  3. On successful token refresh, new tokens are saved in `localStorage`, the queue is flushed with the updated token, and the failed requests are retried.
  4. If the refresh token has also expired, the client storage is purged, and the user is redirected to the `/login` screen.

### 2. Authentication and Role Protection
* Routes are shielded using the `<ProtectedRoute>` component.
* Unauthenticated requests are redirected back to `/login`.
* Authenticated users with the `ADMIN` role are routed to `/admin` paths, whereas `USER` roles navigate to `/user` paths. If an unauthorized role attempts to visit a page (e.g. USER accessing admin dashboard), they are automatically redirected back to their respective landing dashboard.

### 3. Confirmation Modals & Error Diagnostics
* Modals warn users before destructive events such as **Deleting User Accounts**, **Terminating Active Device Sessions**, or **Deauthorizing the Active Session Profile**.
* Toast alerts automatically translate error codes (such as `403 Forbidden` for role violations, `409 Conflict` for registration collisions, `422 Unprocessable` for incorrect field specifications, and `500 Server Error` for database interruptions) into user-friendly messages.
