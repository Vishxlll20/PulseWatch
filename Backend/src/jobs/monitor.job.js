import cron from "node-cron";
import Monitor from "../models/monitor.model.js";
import checkMonitor from "../services/monitor.service.js";

const startMonitorJob = () => {
  cron.schedule("*/1 * * * *", async () => {
    console.log("Running monitor checks...");

    const monitors = await Monitor.find({
      isActive: true,
    });

    for (const monitor of monitors) {
      await checkMonitor(monitor._id);
    }
  });
};

export default startMonitorJob;