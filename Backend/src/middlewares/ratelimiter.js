import rateLimit, { ipKeyGenerator } from "express-rate-limit";

/**
 * 🔑 Default key generator
 * - Authenticated → userId
 * - Guest → safe IP (IPv6 handled)
 */
const keyGenerator = (req) => {
  if (req.user?._id) {
    return req.user._id.toString();
  }
  return ipKeyGenerator(req);
};

/**
 * 🔐 LOGIN (STRICT + email-based)
 * Important: req.user doesn't exist here
 */
const loginKeyGenerator = (req) => {
  return req.body?.email || ipKeyGenerator(req);
};

export const loginLimiter = rateLimit({
  windowMs: 20 * 60 * 1000, // 20 min
  max: 15,
  keyGenerator: loginKeyGenerator,
  message: {
    message: "Too many login attempts. Try again later."
  },
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * 🔐 REGISTER
 */
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  keyGenerator,
  message: {
    message: "Too many registrations. Try again later."
  },
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * ⚙️ MONITORS
 */
export const createMonitorLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  keyGenerator,
  message: { message: "Too many monitor creations" }
});

export const updateMonitorLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  keyGenerator,
  message: { message: "Too many monitor updates" }
});

export const deleteMonitorLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  keyGenerator,
  message: { message: "Too many monitor deletions" }
});

export const getMonitorLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 150,
  keyGenerator
});

/**
 * 📄 LOGS
 */
export const logsReadLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 200,
  keyGenerator
});

export const logsDeleteLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  keyGenerator,
  message: { message: "Too many delete requests for logs" }
});

/**
 * 🚨 INCIDENTS
 */
export const incidentReadLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  keyGenerator
});

export const incidentWriteLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  keyGenerator,
  message: { message: "Too many incident modifications" }
});