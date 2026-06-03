import { Router } from "express";
import { adminLogin, getAllUsers, deleteUser, getAllMonitors, deleteMonitor } from "../controllers/adminController.js";
import { authMiddleware, adminMiddleware } from "../middlewares/authmiddleware.js";

const router = Router();

// Public admin route
router.post("/login", adminLogin);

// Protected admin routes — require valid JWT + admin role
router.use(authMiddleware, adminMiddleware);
router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);

router.get("/monitors", getAllMonitors);
router.delete("/monitors/:id", deleteMonitor);

export default router;
