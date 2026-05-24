import axios from "axios";
import Monitor from "../models/monitor.model.js";
import Log from "../models/log.model.js";
import Incident from "../models/incident.model.js";

const checkMonitor = async (monitorId) => {
  try {
    const monitor = await Monitor.findById(monitorId);

    if (!monitor || !monitor.isActive) {
      return;
    }

    const startTime = Date.now();

    const response = await axios({
      method: monitor.method,
      url: monitor.url,
      timeout: 5000,
    });

    const endTime = Date.now();

    monitor.status = "UP";
    monitor.statusCode = response.status;
    monitor.responseTime = endTime - startTime;
    monitor.lastChecked = new Date();

    await monitor.save();

    const ongoingIncident = await Incident.findOne({
      monitor: monitor._id,
      status: "ONGOING",
    });

    if (ongoingIncident) {
      ongoingIncident.status = "RESOLVED";
      ongoingIncident.resolvedAt = new Date();

      await ongoingIncident.save();

      console.log(`Incident resolved for ${monitor.name}`);
    }
    await Log.create({
      monitor: monitor._id,
      status: "UP",
      statusCode: response.status,
      responseTime: endTime - startTime,
      message: "Monitor is healthy",
    });

    console.log(`${monitor.name} is UP`);
  } catch (error) {
    const monitor = await Monitor.findById(monitorId);

    if (!monitor) return;

    monitor.status = "DOWN";
    monitor.statusCode = error.response?.status || 500;
    monitor.responseTime = 0;
    monitor.lastChecked = new Date();

    const existingIncident = await Incident.findOne({
      monitor: monitor._id,
      status: "ONGOING",
    });

    if (!existingIncident) {
      await Incident.create({
        monitor: monitor._id,
        type: "DOWN",
        message: `${monitor.name} is down`,
      });

      console.log(`Incident created for ${monitor.name}`);
    }

    await monitor.save();
    await Log.create({
      monitor: monitor._id,
      status: "DOWN",
      statusCode: error.response?.status || 500,
      responseTime: 0,
      message: error.message,
    });

    console.log(`${monitor.name} is DOWN`);
  }
};

export default checkMonitor;
