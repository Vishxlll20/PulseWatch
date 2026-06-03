import config from "../config/config.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import transporter from "../config/emailConfig.js";

// Shared cookie options factory
// In dev: sameSite='lax', secure=false  (frontend + backend both localhost)
// In prod: sameSite='none', secure=true  (cross-origin with HTTPS)
const isProduction = config.NODE_ENV === 'production';
const cookieOptions = (maxAgeMs) => ({
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    ...(maxAgeMs ? { maxAge: maxAgeMs } : {}),
});


const registerUser = async (req, res, next) => {
    const { username, email, password } = req.body;

    try {
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: "User already exists", success: false, error: "User with this email already exists" });
        }

        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ message: "Username taken", success: false, error: "This username is already in use" });
        }

        const newUser = await User.create({ username, email, password });
        const token = jwt.sign({ id: newUser._id }, config.JWT_SECRET, { expiresIn: "7d" });
        res.cookie("token", token, cookieOptions(7 * 24 * 60 * 60 * 1000));

        return res.status(201).json({ message: "User registered successfully", success: true, user: { id: newUser._id, username: newUser.username, email: newUser.email, role: newUser.role } });

    } catch (error) {
        // Handle MongoDB duplicate key error
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({ message: `${field} already exists`, success: false, error: `A user with this ${field} already exists` });
        }
        console.error('Error registering user:', error.message);
        next(error);
    }
}

const loginUser = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials", success: false, error: "No user found with this email" });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials", success: false, error: "Incorrect password" });
        }

        const token = jwt.sign({ id: user._id }, config.JWT_SECRET, { expiresIn: "7d" });
        res.cookie("token", token, cookieOptions(7 * 24 * 60 * 60 * 1000));

        return res.status(200).json({ message: "Login successful", success: true, user: { id: user._id, username: user.username, email: user.email, role: user.role } });

    } catch (error) {
        console.error('Error logging in user:', error.message);
        next(error); // Pass error to global error handler
    }
}

const logoutUser = (req, res, next) => {
    try {
        res.clearCookie("token", cookieOptions());
        return res.status(200).json({ message: "Logout successful", success: true });
    } catch (error) {
        next(error);
    }
}

// STEP 1: FORGET PASSWORD — Send OTP to email
const forgetPassword = async (req, res, next) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "No user found with this email", success: false });
        }

        // Cryptographically secure 6-digit OTP
        const { randomInt } = await import("crypto");
        const otp = randomInt(100000, 999999).toString();

        // Hash OTP before storing (raw OTP never in DB)
        const hashedOtp = await bcrypt.hash(otp, 10);

        user.resetOtp = hashedOtp;
        user.resetOtpExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
        user.resetOtpAttempts = 0;
        await user.save();

        // Send plain OTP to email
        await transporter.sendMail({
            from: config.EMAIL,
            to: user.email,
            subject: "Password Reset OTP - Upzy",
            html: `
                <h2>Hello ${user.username},</h2>
                <p>Your password reset OTP is:</p>
                <h1 style="letter-spacing:8px;color:#4F46E5">${otp}</h1>
                <p>This OTP expires in <b>15 minutes</b>.</p>
                <p>If you didn't request this, ignore this email.</p>
            `
        });

        // Set email cookie so user doesn't need to re-enter email in step 2
        res.cookie("resetEmail", email, cookieOptions(15 * 60 * 1000));

        return res.status(200).json({ message: "OTP sent to your email", success: true });
    } catch (error) {
        next(error);
    }
};

// STEP 2: VERIFY OTP — User only enters OTP (email comes from cookie)
const verifyOtp = async (req, res, next) => {
    const { otp } = req.body;
    try {
        const email = req.cookies.resetEmail;
        if (!email) {
            return res.status(400).json({ message: "Please request OTP first.", success: false });
        }

        const user = await User.findOne({ email });
        if (!user || !user.resetOtp || !user.resetOtpExpire) {
            return res.status(400).json({ message: "Invalid request", success: false });
        }

        // Check OTP expiry & clear stale data
        if (user.resetOtpExpire < Date.now()) {
            user.resetOtp = undefined;
            user.resetOtpExpire = undefined;
            user.resetOtpAttempts = 0;
            await user.save();
            return res.status(401).json({ message: "OTP has expired. Please request a new one.", success: false });
        }

        // Brute-force protection — max 5 attempts
        if (user.resetOtpAttempts >= 5) {
            user.resetOtp = undefined;
            user.resetOtpExpire = undefined;
            user.resetOtpAttempts = 0;
            await user.save();
            return res.status(429).json({ message: "Too many failed attempts. Please request a new OTP.", success: false });
        }

        // Compare OTP with stored hash
        const isOtpValid = await bcrypt.compare(otp, user.resetOtp);
        if (!isOtpValid) {
            user.resetOtpAttempts += 1;
            await user.save();
            return res.status(401).json({
                message: `Invalid OTP. ${5 - user.resetOtpAttempts} attempts remaining.`,
                success: false
            });
        }

        // OTP valid — clear OTP fields & email cookie, set reset cookie
        user.resetOtp = undefined;
        user.resetOtpExpire = undefined;
        user.resetOtpAttempts = 0;
        await user.save();

        res.clearCookie("resetEmail", cookieOptions());

        const resetToken = jwt.sign({ id: user._id, purpose: "reset" }, config.JWT_SECRET, { expiresIn: "10m" });
        res.cookie("resetToken", resetToken, cookieOptions(10 * 60 * 1000));

        return res.status(200).json({ message: "OTP verified successfully", success: true });
    } catch (error) {
        next(error);
    }
};

// STEP 3: RESET PASSWORD — Only new password needed (cookie handles identity)
const resetPassword = async (req, res, next) => {
    const { password } = req.body;
    try {
        const { resetToken } = req.cookies || {};
        if (!resetToken) {
            return res.status(401).json({ message: "Unauthorized. Please verify OTP first.", success: false });
        }

        let decoded;
        try {
            decoded = jwt.verify(resetToken, config.JWT_SECRET);
        } catch (err) {
            return res.status(401).json({ message: "Reset session expired. Please start over.", success: false });
        }

        if (decoded.purpose !== "reset") {
            return res.status(401).json({ message: "Invalid reset session.", success: false });
        }

        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(400).json({ message: "User not found", success: false });
        }

        user.password = password;
        await user.save();

        res.clearCookie("resetToken", cookieOptions());

        // Send confirmation email
        await transporter.sendMail({
            from: config.EMAIL,
            to: user.email,
            subject: "Password Changed Successfully - Upzy",
            html: `
                <h2>Hello ${user.username},</h2>
                <p>Your password has been changed successfully.</p>
                <p>If you did not make this change, please contact support immediately.</p>
            `
        });

        return res.status(200).json({ message: "Password reset successfully", success: true });
    } catch (error) {
        next(error);
    }
}
const getme = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).select("-password -resetPasswordToken -resetPasswordExpire");
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }
        res.json({ user, success: true });
    } catch (error) {
        console.error('Error in getme:', error.message);
        next(error); // Pass error to global error handler
    }
}

export { registerUser, loginUser, logoutUser, forgetPassword, verifyOtp, resetPassword, getme };