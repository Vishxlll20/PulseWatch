import mongoose from "mongoose";

const incidentSchema = new mongoose.Schema(
  {
    monitor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Monitor",
      required: true,
    },

    type: {
      type: String,
      enum: ["DOWN"],
      default: "DOWN",
    },

    status: {
      type: String,
      enum: ["ONGOING", "RESOLVED"],
      default: "ONGOING",
    },

    startedAt: {
      type: Date,
      default: Date.now,
    },

    resolvedAt: {
      type: Date,
    },

    message: {
      type: String,
      default: "Monitor is down",
    },
  },
  {
    timestamps: true,
  }
);

const Incident = mongoose.model(
  "Incident",
  incidentSchema
);

export default Incident;