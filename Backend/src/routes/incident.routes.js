import express from "express";

import authMiddleware from "../middlewares/auth.middleware.js";

import { getMonitorIncidents } from "../controllers/incident.controller.js";

const router = express.Router();

router.get("/:monitorId", authMiddleware, getMonitorIncidents);

export default router;
