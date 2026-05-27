import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import config from "../config/config.js";

const authMiddleware = async (req, res, next) => {
    try {
        // Get token from cookies
        const { token } = req.cookies || {};

        // Check if token exists
        if (!token) {
            return res.status(401).json({
                message: "Unauthorized - No token provided",
                success: false,
                error: "Token is required"
            });
        }

        // Verify token
        const decoded = jwt.verify(token, config.JWT_SECRET || process.env.JWT_SECRET);

        // Fetch user from database
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                message: "Unauthorized - User not found",
                success: false,
                error: "User associated with token not found"
            });
        }

        // Attach user to request object
        req.user = user;
        req.userId = decoded.id;

        next();

    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                message: "Token expired",
                success: false,
                error: "Your session has expired. Please login again."
            });
        }

        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                message: "Invalid token",
                success: false,
                error: "Token is invalid or malformed"
            });
        }

        console.error("Auth middleware error:", error.message);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error.message
        });
    }
};

// Middleware to check if user is admin
const adminMiddleware = (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: "Unauthorized - No user found",
                success: false,
                error: "User not authenticated"
            });
        }

        if (req.user.role !== "admin") {
            return res.status(403).json({
                message: "Forbidden - Admin access required",
                success: false,
                error: "You do not have admin privileges"
            });
        }

        next();

    } catch (error) {
        console.error("Admin middleware error:", error.message);
        next(error);
    }
};

export { authMiddleware, adminMiddleware };
