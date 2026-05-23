import mongoose from "mongoose";

const logSchema = new mongoose.Schema(
  {
    monitor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Monitor",
      required: true,
    },

    status: {
      type: String,
      enum: ["UP", "DOWN"],
      required: true,
    },

    statusCode: {
      type: Number,
    },

    responseTime: {
      type: Number,
      default: 0,
    },

    message: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Log = mongoose.model("Log", logSchema);

export default Log;