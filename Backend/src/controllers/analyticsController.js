import Analytics from "../models/analytics.model.js";
import Incident from "../models/incident.model.js";
import Monitor from "../models/monitor.model.js";
import Log from "../models/log.model.js";
import mongoose from "mongoose";
import redis from "../config/redis.js";

export const getAnalytics = async (req, res, next) => {
  try {
    const { monitorId } = req.params;
    const { range = "24h" } = req.query;

    // 🔥 SECURITY FIX: Verify monitor belongs to user
    const monitor = await Monitor.findOne({ _id: monitorId, userId: req.user._id });
    if (!monitor) return res.status(404).json({ error: "Monitor not found or unauthorized" });

    const cacheKey = `analytics:${monitorId}:${range}`;

    // 🔥 1. Try Redis first
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const objectId = new mongoose.Types.ObjectId(monitorId);

    let startDate;

    if (range === "24h") {
      startDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
    } else if (range === "7d") {
      startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    } else {
      startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    }

    // 🔥 Fetch analytics
    const analytics = await Analytics.find({
      monitorId: objectId,
      date: { $gte: startDate }
    }).sort({ date: 1 }).lean();

    // 🔥 REAL-TIME FALLBACK: If cron hasn't run yet, build analytics from live logs!
    if (analytics.length === 0) {
      const logs = await Log.find({
        monitorId: objectId,
        createdAt: { $gte: startDate }
      }).lean();

      if (logs.length > 0) {
        let total = logs.length;
        let totalDown = logs.filter(l => l.status === 'DOWN').length;
        let totalLatency = logs.reduce((sum, l) => sum + (l.responseTime || 0), 0);
        
        analytics.push({
           date: new Date(),
           totalRequests: total,
           downCount: totalDown,
           avgResponseTime: totalLatency / total,
           uptime: ((total - totalDown) / total) * 100,
           errorRate: (totalDown / total) * 100
        });
      }
    }

    let total = 0;
    let totalDown = 0;
    let totalLatency = 0;

    analytics.forEach(a => {
      total += a.totalRequests;
      totalDown += a.downCount;
      totalLatency += a.avgResponseTime * a.totalRequests;
    });

    const uptime = total ? ((total - totalDown) / total) * 100 : 0;
    const errorRate = total ? (totalDown / total) * 100 : 0;
    const avgResponseTime = total ? totalLatency / total : 0;

    // 🔥 Only fetch relevant incidents (IMPORTANT FIX)
    const incidents = await Incident.find({
      monitorId: objectId,
      startTime: { $gte: startDate }
    });

    let totalDowntime = 0;

    incidents.forEach(i => {
      if (i.endTime) {
        totalDowntime += (i.endTime - i.startTime);
      } else {
        totalDowntime += (Date.now() - i.startTime);
      }
    });

    const response = {
      uptime: Number(uptime.toFixed(2)),
      errorRate: Number(errorRate.toFixed(2)),
      avgResponseTime: Number(avgResponseTime.toFixed(2)),
      totalDowntimeMinutes: Math.round(totalDowntime / (1000 * 60)),
      graph: analytics
    };

    // 🔥 2. Store in Redis (TTL)
    await redis.set(cacheKey, JSON.stringify(response), "EX", 60);

    res.json(response);

  } catch (err) {
    next(err);
  }
};