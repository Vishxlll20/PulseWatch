import User from "../models/user.model.js";
import monitorModel from "../models/monitor.model.js";
import logModel from "../models/log.model.js";
import incidentModel from "../models/incident.model.js";
import config from "../config/config.js";
import jwt from "jsonwebtoken";




const adminLogin = async (req, res, next) => {
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

        if (user.role !== "admin") {
            return res.status(403).json({ message: "Access denied", success: false, error: "You do not have admin privileges" });
        }

        const token = jwt.sign({ id: user._id }, config.JWT_SECRET, { expiresIn: "1h" });
        res.cookie("token", token, { httpOnly: true, secure: config.NODE_ENV === "production", sameSite: "none" });

        return res.status(200).json({ message: "Login successful", success: true, user: { id: user._id, username: user.username, email: user.email } });

    } catch (error) {
        console.error('Error logging in user:', error.message);
        next(error); // Pass error to global error handler
    }
}

// GET /api/admin/users — Fetch all users (excluding password)
const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({role: {$ne: "admin"}}).select("-password"); // exclude password field

        if (!users || users.length === 0) {
            return res.status(404).json({ message: "No users found", success: false });
        }

        return res.status(200).json({ 
            message: "Users fetched successfully", 
            success: true, 
            count: users.length,
            users 
        });

    } catch (error) {
        console.error('Error fetching users:', error.message);
        next(error);
    }
}

// DELETE /api/admin/users/:id — Delete a user by ID
const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Prevent admin from deleting themselves
        if (id === req.user._id.toString()) {
            return res.status(400).json({
                message: "You cannot delete your own account",
                success: false,
                error: "Self-deletion is not allowed"
            });
        }

        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({
                message: "User not found",
                success: false,
                error: "No user found with this ID"
            });
        }

        return res.status(200).json({
            message: `User "${deletedUser.username}" deleted successfully`,
            success: true,
            deletedUser: {
                id: deletedUser._id,
                username: deletedUser.username,
                email: deletedUser.email
            }
        });
    } catch (error) {
        console.error("Error deleting user:", error.message);
        next(error);
    }
};

// GET /api/admin/monitors — Fetch all monitors across the system
const getAllMonitors = async (req, res, next) => {
    try {
        const monitors = await monitorModel
            .find()
            .populate("userId", "username email")
            .sort({ createdAt: -1 })
            .lean();

        for (let monitor of monitors) {
            const logs = await logModel.find({ monitorId: monitor._id })
                .sort({ createdAt: -1 })
                .limit(24)
                .lean();
            
            if (logs.length > 0) {
                monitor.response = `${logs[0].responseTime}ms`;
                monitor.status = logs[0].status;
                const totalLogs = await logModel.countDocuments({ monitorId: monitor._id });
                const upLogs = await logModel.countDocuments({ monitorId: monitor._id, status: 'UP' });
                monitor.uptime = totalLogs > 0 ? `${((upLogs / totalLogs) * 100).toFixed(2)}%` : '-';
            } else {
                monitor.response = '-';
                monitor.uptime = '-';
            }
        }

        return res.status(200).json(monitors);
    } catch (error) {
        console.error('Error fetching system monitors:', error.message);
        next(error);
    }
};

// DELETE /api/admin/monitors/:id — Delete any monitor
const deleteMonitor = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedMonitor = await monitorModel.findByIdAndDelete(id);

        if (!deletedMonitor) {
            return res.status(404).json({ message: "Monitor not found", success: false, error: "No monitor found with this ID" });
        }

        // Clean up associated logs and incidents
        await logModel.deleteMany({ monitorId: id });
        await incidentModel.deleteMany({ monitorId: id });

        return res.status(200).json({
            message: "Monitor deleted successfully",
            success: true
        });
    } catch (error) {
        console.error("Error deleting monitor:", error.message);
        next(error);
    }
};

export { adminLogin, getAllUsers, deleteUser, getAllMonitors, deleteMonitor };
