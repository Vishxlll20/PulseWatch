import express from "express";
import {getIncidentsForMonitor,getActiveIncidentForMonitor,resolveIncident,deleteIncidentsForMonitor,getAllIncidents,getUnresolvedIncidents} from "../controllers/incidentController.js";
import { authMiddleware } from "../middlewares/authmiddleware.js";
import { incidentReadLimiter,incidentWriteLimiter } from "../middlewares/ratelimiter.js";

const router = express.Router();

// ORDER MATTERS: Put specific routes BEFORE generic ones!
// Get only unresolved incidents (for Alert Center)
router.get("/unresolved", authMiddleware, incidentReadLimiter, getUnresolvedIncidents);

// Get all incidents across all monitors
router.get("/all", authMiddleware, incidentReadLimiter, getAllIncidents);

// Specific routes
router.post("/resolve/:incidentId", authMiddleware, incidentWriteLimiter, resolveIncident);
router.get("/active/:monitorId", authMiddleware, incidentReadLimiter, getActiveIncidentForMonitor);

// Generic routes last (must come after specific routes)
router.get("/:monitorId",  authMiddleware, incidentReadLimiter, getIncidentsForMonitor);
router.delete("/:monitorId", authMiddleware, incidentReadLimiter, deleteIncidentsForMonitor);

export default router;
