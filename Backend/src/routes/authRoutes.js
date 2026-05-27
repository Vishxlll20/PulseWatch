import { Router } from "express";
import { registerUser, loginUser, logoutUser, forgetPassword, verifyOtp, resetPassword, getme } from "../controllers/authcontroller.js";
import { registerValidator, loginValidator, validate, forgetPasswordValidator, verifyOtpValidator, resetPasswordValidator } from "../validators/authValidator.js";
import { authMiddleware } from "../middlewares/authmiddleware.js";
import { loginLimiter,registerLimiter } from "../middlewares/ratelimiter.js";


const router = Router();

router.post("/register", registerValidator ,registerLimiter, validate, registerUser);
router.post("/login",  loginValidator,loginLimiter, validate, loginUser);
router.post("/logout", authMiddleware, logoutUser);
router.post("/forget-password", forgetPasswordValidator, validate, forgetPassword);
router.post("/verify-otp", verifyOtpValidator, validate, verifyOtp);
router.post("/reset-password", resetPasswordValidator, validate, resetPassword);
router.get("/me", authMiddleware, getme);

export default router;
