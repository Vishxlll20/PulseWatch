import Log from "../models/log.model.js";
import Analytics from "../models/analytics.model.js";
import redis from "../config/redis.js";

export const computeHourlyAnalytics = async () => {
  try {
    const now = new Date();

    // 🔥 align to exact previous hour
    const end = new Date(now);
    end.setMinutes(0, 0, 0);        // e.g. 10:00:00

    const start = new Date(end);
    start.setHours(end.getHours() - 1); // e.g. 09:00:00

    const data = await Log.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lt: end }
        }
      },
      {
        $group: {
          _id: {
            monitorId: "$monitorId"
          },
          total: { $sum: 1 },
          down: {
            $sum: {
              $cond: [{ $eq: ["$status", "DOWN"] }, 1, 0]
            }
          },
          avgResponse: { $avg: "$responseTime" }
        }
      }
    ]);

    if (!data.length) return;

    // 🔥 bulk write
    const ops = data.map(item => {
      const uptime = item.total
        ? ((item.total - item.down) / item.total) * 100
        : 0;

      return {
        updateOne: {
          filter: {
            monitorId: item._id.monitorId,
            date: start // exact hour bucket
          },
          update: {
            monitorId: item._id.monitorId,
            date: start,
            uptime,
            errorRate: item.total ? (item.down / item.total) * 100 : 0,
            avgResponseTime: item.avgResponse,
            totalRequests: item.total,
            downCount: item.down
          },
          upsert: true
        }
      };
    });

    await Analytics.bulkWrite(ops);

    // 🔥 invalidate Redis (only affected monitors)
    const monitorIds = data.map(d => d._id.monitorId.toString());

    for (const id of monitorIds) {
      await redis.del(`analytics:${id}:24h`);
      await redis.del(`analytics:${id}:7d`);
      await redis.del(`analytics:${id}:30d`);
    }

    console.log(`📊 Analytics computed for ${data.length} monitors`);
  } catch (err) {
    console.error("Analytics cron error:", err.message);
  }
};