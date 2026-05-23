import express from "express";

import authMiddleware from "../middlewares/auth.middleware.js";

import {
  createMonitor,
  getUserMonitors,
} from "../controllers/monitor.controller.js";

const router = express.Router();

router.post("/create", authMiddleware, createMonitor);

router.get("/", authMiddleware, getUserMonitors);

export default router;
