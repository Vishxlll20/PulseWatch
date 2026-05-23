import express from "express";

import authMiddleware from "../middlewares/auth.middleware.js";

import {
  getMonitorLogs,
} from "../controllers/log.controller.js";

const router = express.Router();

router.get(
  "/:monitorId",
  authMiddleware,
  getMonitorLogs
);

export default router;