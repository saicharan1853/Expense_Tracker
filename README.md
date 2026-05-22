# Expense Tracker — Full Project

Monorepo containing a NestJS backend and a React + Vite frontend for tracking personal expenses.

Contents
- `expense-tracker-backend/` — NestJS REST API (authentication, expense CRUD)
- `expense-tracker-frontend/` — React + Vite client (login, dashboard, expense UI)

Prerequisites
- Node.js 18+ and npm or Yarn
- A database for the backend (Postgres, SQLite, etc.) if you want persistent storage

Quickstart (backend)

```bash
cd expense-tracker-backend
npm install
# copy or create a .env file with DATABASE_URL and JWT_SECRET
npm run start:dev
```

Quickstart (frontend)

```bash
cd expense-tracker-frontend
npm install
# set VITE_API_URL in .env to point to the backend (e.g. http://localhost:3000)
npm run dev
```

Run both locally
- Start the backend first, then the frontend so the client can reach the API.

Environment variables (examples)
- Backend `.env`: `PORT=3000`, `DATABASE_URL=postgres://...`, `JWT_SECRET=your_secret`
- Frontend `.env`: `VITE_API_URL=http://localhost:3000`

Project notes
- Backend controllers and DTOs are under `expense-tracker-backend/src/`.
- Frontend source lives in `expense-tracker-frontend/src/` — see `api/axios.ts` and `services/` for network code.

Testing
- Backend: `npm run test` inside `expense-tracker-backend`
- Frontend: use Vite's dev server and your browser for manual testing

License
- MIT-style (adjust if needed)
