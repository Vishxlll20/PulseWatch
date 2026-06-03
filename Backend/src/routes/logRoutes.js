import express from "express";
import {getLogsForMonitor,deleteLogsForMonitor} from "../controllers/logController.js";
import { authMiddleware } from "../middlewares/authmiddleware.js";
import { logsDeleteLimiter,logsReadLimiter } from "../middlewares/ratelimiter.js"; 
const router = express.Router();

router.get("/:monitorId", authMiddleware,logsReadLimiter, getLogsForMonitor);
router.delete("/:monitorId",  authMiddleware,logsDeleteLimiter, deleteLogsForMonitor);

export default router;

