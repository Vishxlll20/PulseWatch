import mongoose from "mongoose";

const monitorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    url: {
      type: String,
      required: true,
    },

    method: {
      type: String,
      enum: ["GET", "POST"],
      default: "GET",
    },

    status: {
      type: String,
      enum: ["UP", "DOWN", "UNKNOWN"],
      default: "UNKNOWN",
    },

    interval: {
      type: Number,
      default: 60,
    },

    lastChecked: {
      type: Date,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Monitor = mongoose.model("Monitor", monitorSchema);

export default Monitor;