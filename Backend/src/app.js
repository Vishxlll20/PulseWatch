import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import { authMiddleware } from './middlewares/authmiddleware.js';
import monitorRoutes from './routes/monitorRoutes.js';
import logRoutes from './routes/logRoutes.js';
import incidentRoutes from "./routes/incidentRoutes.js";
import errorHandler from './middlewares/errormiddleware.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { securityHeaders } from './utils/security.js';
import config from './config/config.js';
// import { globalLimiter } from './middlewares/ratelimiter.js';
import passport from 'passport';


const app = express();
app.set('trust proxy', 1); // Trust first proxy for secure cookies behind proxies/load balancers

app.use(securityHeaders);

app.use(morgan('dev'));

// app.use(globalLimiter); // Apply global rate limiter to all routes
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  config.CLIENT_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS policy: origin ${origin} not allowed`), false);
  },
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use('/api/monitor', monitorRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.send('Hello, World!');
});


app.use(errorHandler);


export default app;