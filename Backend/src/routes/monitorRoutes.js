import express from "express";
import {
  createMonitor,
  getAllMonitors,
  getMonitorById,
  updateMonitor,
  deleteMonitor,
  toggleMonitor,
  runMonitorNow,
} from "../controllers/monitorcontroller.js";

import { validateMonitor } from "../validators/monitorValidator.js";
import { authMiddleware } from "../middlewares/authmiddleware.js";

import {
  getMonitorLimiter,
  createMonitorLimiter,
  updateMonitorLimiter,
  deleteMonitorLimiter,
} from "../middlewares/ratelimiter.js";

const router = express.Router();

//  GET ALL
router.get("/", authMiddleware, getMonitorLimiter, getAllMonitors);

//  CREATE
router.post(
  "/create",
  authMiddleware,
  createMonitorLimiter,
  validateMonitor,
  createMonitor,
);

//  GET ONE
router.get("/:monitorId", authMiddleware, getMonitorLimiter, getMonitorById);

//  UPDATE
router.put(
  "/:monitorId/update",
  authMiddleware,
  updateMonitorLimiter,
  validateMonitor,
  updateMonitor,
);

//  DELETE
router.delete(
  "/:monitorId/delete",
  authMiddleware,
  deleteMonitorLimiter,
  deleteMonitor,
);

//  MANUAL RUN
router.post("/:monitorId/run", authMiddleware, runMonitorNow);

//  PAUSE / RESUME
router.patch("/:monitorId/toggle", authMiddleware, toggleMonitor);

export default router;
