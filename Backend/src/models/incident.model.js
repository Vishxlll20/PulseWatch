import mongoose from "mongoose";

const incidentSchema = new mongoose.Schema({
  monitorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Monitor",
    required: true,
    index: true
  },

  type: {
    type: String,
    enum: ["DOWN", "DEGRADED"],
    required: true
  },

  startTime: {
    type: Date,
    required: true
  },

  endTime: {
    type: Date,
    default: null
  },

  resolved: {
    type: Boolean,
    default: false,
    index: true
  },

  // 🔥 structured AI output (key upgrade)
  ai: {
    summary: String,
    rootCause: String,
    suggestion: String
  }

}, {
  timestamps: true
});

// 🔥 fast query for active incident
incidentSchema.index({ monitorId: 1, resolved: 1 });
const IncidentModel = mongoose.model("Incident", incidentSchema);

export default IncidentModel;