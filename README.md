# Review Rating App

Full‑stack app with a React (Vite) frontend and Node/Express + MongoDB backend.

## Project Structure
- `frontend/` – React + Tailwind UI
- `backend/` – Express API + MongoDB

## Prerequisites
- Node.js 18+ (Node 20 recommended)
- MongoDB connection string (Atlas or local)

## Setup
1. Backend
```bash
cd backend
npm install
```

Create `backend/.env`:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

2. Frontend
```bash
cd frontend
npm install
```

Optional: set API base URL in `frontend/.env`:
```env
VITE_API_BASE_URL=http://localhost:5000
```

## Run
1. Start backend
```bash
cd backend
npm start
```

2. Start frontend
```bash
cd frontend
npm run dev
```

Frontend: `http://localhost:5173`  
Backend: `http://localhost:5000`

## API Endpoints
### Companies
- `GET /api/companies` – list companies (includes `averageRating`, `reviewCount`)
- `POST /api/companies` – create company (multipart form)
- `GET /api/companies/:id` – company detail

### Reviews
- `GET /api/reviews/:companyId` – list reviews for a company
- `POST /api/reviews` – add review

## File Uploads
Company logos are uploaded via `multipart/form-data` and served from:
- `backend/uploads/`
- URL path: `/uploads/<filename>`

## Notes
- Tailwind v4 is configured via `@import "tailwindcss";` and `@config` in `frontend/src/index.css`.
- If you change env values, restart the dev servers.
