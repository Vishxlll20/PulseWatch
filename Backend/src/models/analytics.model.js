import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema({
  monitorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Monitor",
    index: true
  },

  date: {
    type: Date, // start of bucket (hour/day)
    index: true
  },

  interval: {
    type: String, // "hour" | "day"
    default: "hour"
  },

  uptime: Number,
  errorRate: Number,
  avgResponseTime: Number,
  totalRequests: Number,
  downCount: Number

}, { timestamps: true });

analyticsSchema.index({ monitorId: 1, date: 1 });

export default mongoose.model("Analytics", analyticsSchema);