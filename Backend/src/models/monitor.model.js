import mongoose from "mongoose";

const monitorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },

  name: {
    type: String,
    trim: true
  },

  url: {
    type: String,
    required: true,
    trim: true
  },

  method: {
    type: String,
    enum: ["GET", "POST"],
    default: "GET"
  },

  headers: {
    type: Map,
    of: String,
    default: {}
  },

  body: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },

  expectedStatus: {
    type: Number,
    default: 200
  },

  timeout: {
    type: Number,
    default: 5000
  },

  interval: {
    type: Number,
    default: 15,
    min: 5 // 🔥 prevent too fast polling
  },

  status: {
    type: String,
    enum: ["UP", "DOWN", "DEGRADED", "UNKNOWN"],
    default: "UNKNOWN"
  },

  lastChecked: {
    type: Date
  },

  isActive: {
    type: Boolean,
    default: true
  },
  nextRunAt: {
  type: Date,
  index: true
}

}, {
  timestamps: true
});

// 🔥 Index for faster cron queries
monitorSchema.index({ isActive: 1, nextRunAt: 1 });
const Monitor = mongoose.model("Monitor", monitorSchema);

export default Monitor;