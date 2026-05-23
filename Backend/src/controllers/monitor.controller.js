import Monitor from "../models/monitor.model.js";

export const createMonitor = async (req, res) => {
  try {
    const { name, url, method, interval } = req.body;

    const monitor = await Monitor.create({
      user: req.user.id,
      name,
      url,
      method,
      interval,
    });

    res.status(201).json({
      success: true,
      message: "Monitor created successfully",
      monitor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUserMonitors = async (req, res) => {
  try {
    const monitors = await Monitor.find({
      user: req.user.id,
    });

    res.status(200).json({
      success: true,
      monitors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};