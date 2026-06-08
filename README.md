# PulseWatch

A full-stack website uptime monitoring platform with real-time status tracking, incident management, AI-powered analytics, and alert notifications.

**Live Demo:** [pulsewatch-zeta.vercel.app](https://pulsewatch-zeta.vercel.app)

---

## Features

- **Real-time Monitoring** — tracks website uptime and latency via scheduled cron jobs, with live status updates over WebSockets
- **Incident Management** — automatic incident creation, tracking, and resolution when monitors go down or recover
- **Alert Notifications** — customizable email alerts via Nodemailer/Gmail when a monitor changes status
- **Analytics** — availability charts, latency trends, and AI-generated insights powered by Groq
- **Authentication** — email/password auth with JWT cookies, Google OAuth, and OTP-based password reset
- **Admin Panel** — manage all monitors and users across the platform
- **Rate Limiting** — per-route rate limiting with Redis-backed storage
- **Security** — bcrypt password hashing, httpOnly cookies, CORS, and security headers

---

## Tech Stack

### Backend
- **Runtime:** Node.js + Express 5
- **Database:** MongoDB with Mongoose
- **Cache / Rate Limiting:** Redis (Upstash in production)
- **Auth:** JWT, bcrypt, Passport.js (Google OAuth)
- **Real-time:** Socket.io
- **Jobs:** node-cron
- **Email:** Nodemailer + Gmail

### Frontend
- **Framework:** React 19 + Vite
- **State Management:** Redux Toolkit
- **Routing:** React Router v7
- **Charts:** Recharts
- **Animations:** Framer Motion, GSAP
- **Styling:** Tailwind CSS

### Infrastructure
- **Backend:** Render
- **Frontend:** Vercel

---

## Project Structure

```
PulseWatch/
├── Backend/
│   ├── server.js
│   └── src/
│       ├── config/          # DB, Redis, Passport, email config
│       ├── controllers/     # Auth, monitors, incidents, analytics, admin
│       ├── jobs/            # Cron job for monitor checks
│       ├── middlewares/     # Auth, error handling, rate limiting
│       ├── models/          # User, Monitor, Log, Incident, Analytics
│       ├── routes/          # All API routes
│       ├── services/        # Alert, monitor, incident, analytics logic
│       ├── socket/          # Socket.io setup
│       ├── utils/           # Security headers
│       └── validators/      # Request validators
└── Frontend/
    └── src/
        ├── app/             # Router, store, App root
        ├── components/      # Shared components
        └── features/
            ├── auth/        # Login, Register, Forgot/Reset password
            ├── dashboard/   # Main dashboard layout and pages
            ├── monitors/    # Monitor CRUD pages
            ├── incidents/   # Incident tracking
            ├── analytics/   # Charts and AI insights
            ├── alerts/      # Alert configuration
            └── admin/       # Admin panel
```

---

## Local Development

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Redis (local or Upstash)
- Google Cloud OAuth credentials

### Backend Setup

```bash
cd Backend
npm install
```

Create `Backend/.env`:
```env
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_jwt_secret
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
GMAIL_USER=your@gmail.com
GMAIL_PASS=your_app_password
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CLIENT_URL=http://localhost:5173
NODE_ENV=development
GROQ_API_KEY=your_groq_api_key
```

```bash
npm run dev
```

### Frontend Setup

```bash
cd Frontend
npm install
```

Create `Frontend/.env`:
```env
VITE_API_URL=http://localhost:3000/api
```

```bash
npm run dev
```

---

## Environment Variables

### Backend

| Variable | Description |
|----------|-------------|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT signing |
| `REDIS_HOST` | Redis host |
| `REDIS_PORT` | Redis port |
| `REDIS_PASSWORD` | Redis password |
| `GMAIL_USER` | Gmail address for sending alerts |
| `GMAIL_PASS` | Gmail app password |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `CLIENT_URL` | Frontend URL for redirects |
| `NODE_ENV` | `development` or `production` |
| `GROQ_API_KEY` | Groq API key for AI insights |

### Frontend

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API base URL |

---

## Deployment

### Backend — Render
- Root directory: `Backend`
- Build command: `npm install`
- Start command: `node server.js`
- Add all backend env variables in Render dashboard

### Frontend — Vercel
- Root directory: `Frontend`
- Framework: Vite
- Add `VITE_API_URL` pointing to your Render backend URL

### Google OAuth Setup
In Google Cloud Console → OAuth 2.0 Credentials, add:
- Authorized JavaScript origins: your Vercel frontend URL
- Authorized redirect URIs: `https://your-render-url.onrender.com/api/auth/google/callback`

---

## API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login with email/password |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/google` | Google OAuth login |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/forget-password` | Send OTP to email |
| POST | `/api/auth/verify-otp` | Verify OTP |
| POST | `/api/auth/reset-password` | Reset password |
| GET | `/api/monitor` | Get all monitors |
| POST | `/api/monitor` | Create monitor |
| PUT | `/api/monitor/:id` | Update monitor |
| DELETE | `/api/monitor/:id` | Delete monitor |
| GET | `/api/incidents` | Get incidents |
| GET | `/api/analytics/:id` | Get monitor analytics |
| GET | `/api/logs/:id` | Get monitor logs |

---

## License

MIT