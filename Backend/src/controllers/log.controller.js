import Log from "../models/log.model.js";

export const getMonitorLogs = async (req, res) => {
  try {
    const { monitorId } = req.params;

    const logs = await Log.find({
      monitor: monitorId,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      logs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};