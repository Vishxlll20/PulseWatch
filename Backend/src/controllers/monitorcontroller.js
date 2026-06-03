import monitorModel from "../models/monitor.model.js";
import incidentModel from "../models/incident.model.js";
import logModel from "../models/log.model.js";

/**
 *  GET ALL MONITORS
 */
export const getAllMonitors = async (req, res, next) => {
  try {
    //  PERFORMANCE FIX: .lean() stops Mongoose from attaching heavy DB methods to results
    const monitors = await monitorModel
      .find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    // Attach response, uptime, and history for each monitor
    for (let monitor of monitors) {
      const logs = await logModel.find({ monitorId: monitor._id })
        .sort({ createdAt: -1 })
        .limit(24)
        .lean();
      
      if (logs.length > 0) {
        monitor.response = `${logs[0].responseTime}ms`;
        monitor.status = logs[0].status;
        // Reverse logs for chronological history (left to right)
        monitor.history = logs.reverse().map(l => {
          if (l.status === 'DOWN') return 35;
          if (l.status === 'DEGRADED') return 60;
          return Math.min(100, Math.max(85, 100 - (l.responseTime / 50))); 
        });

        // Calculate uptime percentage over retained logs
        const totalLogs = await logModel.countDocuments({ monitorId: monitor._id });
        const upLogs = await logModel.countDocuments({ monitorId: monitor._id, status: 'UP' });
        monitor.uptime = totalLogs > 0 ? `${((upLogs / totalLogs) * 100).toFixed(2)}%` : '-';
      } else {
        monitor.response = '-';
        monitor.history = [];
        monitor.uptime = '-';
      }
    }

    res.json(monitors);
  } catch (err) {
    next(err);
  }
};

/**
 *  CREATE MONITOR
 */
export const createMonitor = async (req, res, next) => {
  try {
    let {
      name,
      url,
      method,
      headers,
      body,
      expectedStatus,
      timeout,
      interval,
      alertEmail
    } = req.body;
    console.log("📧 alertEmail received:", alertEmail);

    //  default + validation
    const finalInterval = interval || 15;

    if (finalInterval < 5 || finalInterval > 3600) {
      return res.status(400).json({
        error: "Interval must be between 5 and 3600 seconds"
      });
    }

    const monitor = await monitorModel.create({
      userId: req.user._id,
      name,
      url,
      method,
      headers,
      body,
      expectedStatus,
      timeout,
      interval: finalInterval,
      alertEmail,

      //  🔥 Start checking immediately (don't wait for interval)
      nextRunAt: new Date()
    });

    res.status(201).json(monitor);
  } catch (err) {
    next(err);
  }
};

/**
 *  GET ONE MONITOR
 */
export const getMonitorById = async (req, res, next) => {
  try {
    const monitor = await monitorModel.findOne({
      _id: req.params.monitorId,
      userId: req.user._id
    });

    if (!monitor) {
      return res.status(404).json({ error: "Monitor not found" });
    }

    res.json(monitor);
  } catch (err) {
    next(err);
  }
};

/**
 *  UPDATE MONITOR
 */
export const updateMonitor = async (req, res, next) => {
  try {
    const updateData = { ...req.body };

    //  interval update must reset schedule
    if (req.body.interval !== undefined) {
      const interval = Number(req.body.interval);

      if (interval < 5 || interval > 3600) {
        return res.status(400).json({
          error: "Interval must be between 5 and 3600 seconds"
        });
      }

      updateData.interval = interval;

      //  reset nextRunAt
      updateData.nextRunAt = new Date(Date.now() + interval * 1000);
    }

    const monitor = await monitorModel.findOneAndUpdate(
      { _id: req.params.monitorId, userId: req.user._id },
      { $set: updateData },
      { new: true }
    );

    if (!monitor) {
      return res.status(404).json({ error: "Monitor not found" });
    }

    res.json(monitor);
  } catch (err) {
    next(err);
  }
};

/**
 *  DELETE MONITOR
 */
export const deleteMonitor = async (req, res, next) => {
  try {
    const monitor = await monitorModel.findOneAndDelete({
      _id: req.params.monitorId,
      userId: req.user._id
    });

    if (!monitor) {
      return res.status(404).json({ error: "Monitor not found" });
    }

    //  cleanup related data
    await Promise.all([
      incidentModel.deleteMany({ monitorId: monitor._id }),
      logModel.deleteMany({ monitorId: monitor._id })
    ]);

    res.json({ message: "Monitor deleted successfully" });
  } catch (err) {
    next(err);
  }
};

/**
 *  PAUSE / RESUME MONITOR
 */
export const toggleMonitor = async (req, res, next) => {
  try {
    const monitor = await monitorModel.findOne({
      _id: req.params.monitorId,
      userId: req.user._id
    });

    if (!monitor) {
      return res.status(404).json({ error: "Monitor not found" });
    }

    monitor.isActive = !monitor.isActive;

    //  if re-activated → reset schedule
    if (monitor.isActive) {
      monitor.nextRunAt = new Date(
        Date.now() + monitor.interval * 1000
      );
    }

    await monitor.save();

    res.json({
      message: `Monitor ${monitor.isActive ? "resumed" : "paused"}`,
      monitor
    });
  } catch (err) {
    next(err);
  }
};

/**
 *  MANUAL CHECK (force run)
 */
import { checkMonitor } from "../services/monitorService.js";

export const runMonitorNow = async (req, res, next) => {
  try {
    const monitor = await monitorModel.findOne({
      _id: req.params.monitorId,
      userId: req.user._id
    });

    if (!monitor) {
      return res.status(404).json({ error: "Monitor not found" });
    }

    const result = await checkMonitor(monitor);

    res.json({
      message: "Monitor executed successfully",
      result
    });
  } catch (err) {
    next(err);
  }
};

/**
 * DEBUG: Get monitor status info for troubleshooting
 */
export const getDebugInfo = async (req, res, next) => {
  try {
    const { monitorId } = req.params;
    
    const monitor = await monitorModel.findOne({
      _id: monitorId,
      userId: req.user._id
    }).lean();

    if (!monitor) {
      return res.status(404).json({ error: "Monitor not found" });
    }

    // Get recent logs
    const recentLogs = await logModel.find({ monitorId })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    // Get active incidents
    const activeIncidents = await incidentModel.find({
      monitorId,
      resolved: false
    }).lean();

    res.json({
      monitor: {
        _id: monitor._id,
        name: monitor.name,
        url: monitor.url,
        status: monitor.status,
        isActive: monitor.isActive,
        interval: monitor.interval,
        nextRunAt: monitor.nextRunAt,
        lastChecked: monitor.lastChecked
      },
      recentLogs: recentLogs.map(log => ({
        status: log.status,
        responseTime: log.responseTime,
        errorMessage: log.errorMessage,
        createdAt: log.createdAt
      })),
      activeIncidents,
      totalLogs: await logModel.countDocuments({ monitorId })
    });
  } catch (err) {
    next(err);
  }
};
