import cron from "node-cron";
import monitorModel from "../models/monitor.model.js";
import Incident from "../models/incident.model.js";
import { checkMonitor } from "../services/monitorService.js";
import { computeHourlyAnalytics } from "../services/analyticsService.js";
import { notifyIncident3MinDown } from "../services/alertService.js";

let isMonitoringRunning = false;
let isAnalyticsRunning = false;

const startCron = () => {

  //  SMART MONITOR SCHEDULER
  cron.schedule("*/15 * * * * *", async () => {
    if (isMonitoringRunning) return;

    isMonitoringRunning = true;

    try {
      const now = new Date();

      // 🔥 ONLY FETCH DUE MONITORS
      const monitors = await monitorModel.find({
        isActive: true,
        nextRunAt: { $lte: now }
      });

      // Log all monitors and their status
      const allMonitors = await monitorModel.find({ isActive: true }).lean();
      console.log(`\n⏰ [CRON TICK] ${now.toISOString()}`);
      console.log(`📊 Total monitors: ${allMonitors.length}, Due for check: ${monitors.length}`);
      
      if (allMonitors.length > 0 && monitors.length === 0) {
        console.log(`⏳ Next checks scheduled for:`);
        allMonitors.slice(0, 3).forEach(m => {
          console.log(`   - ${m.name}: ${new Date(m.nextRunAt).toISOString()}`);
        });
      }

      if (monitors.length > 0) {
        console.log(`[CRON] Running ${monitors.length} monitor checks at ${now.toISOString()}`);
      }

      const batchSize = 10;

      for (let i = 0; i < monitors.length; i += batchSize) {
        const batch = monitors.slice(i, i + batchSize);

        await Promise.allSettled(
          batch.map(async (monitor) => {
            const result = await checkMonitor(monitor);
            console.log(`  ✓ ${monitor.name}: ${result.status} (${result.responseTime}ms)${result.errorMessage ? ` - Error: ${result.errorMessage}` : ''}`);

            //  FIXED SCHEDULING (NO DRIFT)
            monitor.nextRunAt = new Date(
              monitor.nextRunAt.getTime() + monitor.interval * 1000
            );

            await monitor.save();
          })
        );
      }

    } catch (err) {
      console.error("Monitor cron error:", err.message);
    } finally {
      isMonitoringRunning = false;
    }
  });

  //  ANALYTICS
  cron.schedule("0 * * * *", async () => {
    if (isAnalyticsRunning) return;

    isAnalyticsRunning = true;

    try {
      await computeHourlyAnalytics();
    } catch (err) {
      console.error("Analytics cron error:", err.message);
    } finally {
      isAnalyticsRunning = false;
    }
  });

  //  CHECK FOR 3-MINUTE DOWNTIME THRESHOLD
  cron.schedule("*/30 * * * * *", async () => {
    try {
      const threeMinutesAgo = new Date(Date.now() - 3 * 60 * 1000); // 3 minutes

      // Find unresolved incidents that started 3+ minutes ago and haven't sent email yet
      const incidents = await Incident.find({
        resolved: false,
        emailSent: { $ne: true },
        type: "DOWN",
        startTime: { $lte: threeMinutesAgo }
      });

      if (incidents.length > 0) {
        console.log(`📧 Found ${incidents.length} incident(s) down for 3+ minutes`);

        for (const incident of incidents) {
          try {
            // 💡 FIX: Atomically lock the document BEFORE sending the email.
            // This prevents duplicate cron runs from picking it up.
            const lockedIncident = await Incident.findOneAndUpdate(
              { _id: incident._id, emailSent: { $ne: true } }, 
              { $set: { emailSent: true } },
              { new: true }
            );

            // If another cron execution or a deletion process got to it first, skip safely
            if (!lockedIncident) {
              console.log(`⏭️ Incident ${incident._id} already claimed or deleted. Skipping.`);
              continue;
            }

            // Now safely trigger the alert knowing no other thread will touch it
            await notifyIncident3MinDown({
              monitorId: incident.monitorId,
              type: incident.type,
              startTime: incident.startTime
            });

            console.log(`✅ 3-minute email sent for incident ${incident._id}`);
          } catch (err) {
            console.error(`Failed to send 3-minute alert for incident ${incident._id}:`, err.message);
            
            // Optional Rollback: If email delivery completely failed, unlock it so it can retry next run
            await Incident.updateOne(
              { _id: incident._id, resolved: false }, 
              { $set: { emailSent: false } }
            ).catch(() => {});
          }
        }
      }
    } catch (err) {
      console.error("3-minute threshold check error:", err.message);
    }
  });
};

export default startCron;