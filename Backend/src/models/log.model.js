import mongoose from "mongoose";

const logSchema = new mongoose.Schema({
  monitorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Monitor",
    required: true,
    index: true
  },

  status: {
    type: String,
    enum: ["UP", "DOWN", "DEGRADED"],
    required: true
  },

  statusCode: {
    type: Number
  },

  responseTime: {
    type: Number,
    required: true
  },

  errorMessage: {
    type: String,
    trim: true
  }

}, {
  timestamps: true
});

// 🔥 Query optimization
logSchema.index({ monitorId: 1, createdAt: -1 });

// 🔥 AUTO DELETE OLD LOGS (TTL)
logSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 60 * 60 * 24 * 7 } // 7 days
);

const Log = mongoose.model("Log", logSchema);

export default Log;