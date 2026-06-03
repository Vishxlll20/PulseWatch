import express from "express";
import { getAnalytics } from "../controllers/analyticsController.js";
import { authMiddleware } from "../middlewares/authmiddleware.js";  

const router = express.Router();

// 🔥 main analytics endpoint
router.get("/:monitorId", authMiddleware, getAnalytics);

export default router;