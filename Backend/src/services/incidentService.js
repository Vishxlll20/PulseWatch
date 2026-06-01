import Log from "../models/log.model.js";
import Incident from "../models/incident.model.js";
import Monitor from "../models/monitor.model.js";
import { getIO } from "../socket/socket.js";
import { generateSummary } from "./aiService.js";
import { notifyIncidentCreated, notifyIncidentResolved } from "./alertService.js";

// tune these once
// LOWERED FOR TESTING - normally you'd keep this higher
const WINDOW = 1;              // logs to inspect
const DOWN_THRESHOLD = 1;      // 1 DOWN → incident (for testing)
const DEGRADED_THRESHOLD = 1; // 1 DEGRADED → incident (for testing)

const getRecentLogs = async (monitorId, limit = WINDOW) => {
  return Log.find({ monitorId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
};

export const handleIncident = async (monitorId) => {
  try {
    const logs = await getRecentLogs(monitorId, WINDOW);
    if (logs.length < WINDOW) return; // not enough signal

    const allDown = logs.every(l => l.status === "DOWN");
    const allDegraded = logs.every(l => l.status === "DEGRADED");

    // active incident (fast path; ensure index on {monitorId, resolved})
    const active = await Incident.findOne({
      monitorId,
      resolved: false
    });

    // 🔴 CREATE
    if (!active && (allDown || allDegraded)) {
      const type = allDown ? "DOWN" : "DEGRADED";

      const incident = await Incident.create({
        monitorId,
        type,
        startTime: logs[logs.length - 1].createdAt, // first failure in window
        resolved: false,
      });
      console.log(`🚨 [ALERT] ${type} incident created for monitor: ${monitorId}`);
      

      // fire-and-forget AI (don't block)
      generateAISummary(monitorId, incident._id).catch(() => { });
      notifyIncidentCreated({ monitorId, type, startTime: incident.startTime  }).catch(() => { });

      // realtime notify (best-effort) - broadcast to all connected clients
      try {
        const io = getIO();
        io.emit("incidentUpdate", {
          _id: incident._id,
          monitorId,
          type,
          resolved: false,
          startTime: incident.startTime
        });
        console.log(`📡 Incident event broadcasted for monitor: ${monitorId}`);
      } catch (err) {
        console.error("Failed to emit incident event:", err.message);
      }

      return;
    }

    // 🟢 RESOLVE
    // if we have an active incident and the latest log is healthy
    if (active) {
      const latest = logs[0];

      const recovered =
        latest.status === "UP" ||
        (latest.status === "DEGRADED" && active.type === "DOWN"); // partial recovery for DOWN

      if (recovered) {
        const updated = await Incident.findByIdAndUpdate(
          active._id,
          { endTime: new Date(), resolved: true },
          { new: true }
        );

        // fire-and-forget email alert
        notifyIncidentResolved({ monitorId, type: updated.type, startTime: active.startTime, endTime: updated.endTime }).catch(() => { });

        try {
          const io = getIO();
          io.emit("incidentUpdate", {
            _id: updated._id,
            monitorId,
            type: updated.type,
            resolved: true,
            endTime: updated.endTime
          });
          console.log(`✅ Incident resolved event broadcasted for monitor: ${monitorId}`);
        } catch (err) {
          console.error("Failed to emit resolved incident event:", err.message);
        }
      }
    }
  } catch (err) {
    console.error("incidentService error:", err.message);
  }
};

// ---- AI (async, non-blocking) ----

async function generateAISummary(monitorId, incidentId) {
  // keep payload small but informative
  const recentLogs = await Log.find({ monitorId })
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  const previousLogs = await Log.find({ monitorId })
    .sort({ createdAt: -1 })
    .skip(5)
    .limit(5)
    .lean();

  const monitor = await Monitor.findById(monitorId).lean();

  const ai = await generateSummary({
    url: monitor?.url,
    method: monitor?.method,
    recentLogs,
    previousLogs
  });

  // expect structured output { summary, rootCause, suggestion }
  await Incident.findByIdAndUpdate(incidentId, { ai });
}