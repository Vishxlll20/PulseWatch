import express from "express";
import {getIncidentsForMonitor,getActiveIncidentForMonitor,resolveIncident,deleteIncidentsForMonitor} from "../controllers/incidentController.js";
import { authMiddleware } from "../middlewares/authmiddleware.js";
import { incidentReadLimiter,incidentWriteLimiter } from "../middlewares/ratelimiter.js";

const router = express.Router();

// ORDER MATTERS: Put specific routes BEFORE generic ones!
// Specific routes first
router.post("/resolve/:incidentId", authMiddleware, incidentWriteLimiter, resolveIncident);
router.get("/active/:monitorId", authMiddleware, incidentReadLimiter, getActiveIncidentForMonitor);

// Generic routes last (must come after specific routes)
router.get("/:monitorId",  authMiddleware, incidentReadLimiter, getIncidentsForMonitor);
router.delete("/:monitorId", authMiddleware, incidentReadLimiter, deleteIncidentsForMonitor);

export default router;
