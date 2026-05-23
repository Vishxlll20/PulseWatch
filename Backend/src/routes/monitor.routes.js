import express from "express";

import authMiddleware from "../middlewares/auth.middleware.js";

import {
  createMonitor,
  getUserMonitors,
  runMonitorCheck,
} from "../controllers/monitor.controller.js";

const router = express.Router();

router.post("/create", authMiddleware, createMonitor);

router.get("/", authMiddleware, getUserMonitors);

router.post("/:monitorId/run", authMiddleware, runMonitorCheck);

export default router;
