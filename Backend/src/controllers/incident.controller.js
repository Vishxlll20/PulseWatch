import Incident from "../models/incident.model.js";

export const getMonitorIncidents =
  async (req, res) => {
    try {
      const { monitorId } = req.params;

      const incidents =
        await Incident.find({
          monitor: monitorId,
        }).sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        incidents,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };