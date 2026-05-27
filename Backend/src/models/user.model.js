import bcrypt from "bcrypt";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },

    // OTP-based password reset (never exposed in URL)
    resetOtp: {
        type: String,        // stored as bcrypt hash
        default: undefined
    },
    resetOtpExpire: {
        type: Date,
        default: undefined
    },
    resetOtpAttempts: {
        type: Number,
        default: 0           // max 5 attempts allowed
    }

}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
        console.error('Failed to hash password:', error.message);
    }
});

// Method to compare password
userSchema.methods.comparePassword = async function (passwordToCheck) {
    return await bcrypt.compare(passwordToCheck, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;