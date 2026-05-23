import axios from "axios";
import Monitor from "../models/monitor.model.js";

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

    console.log(`${monitor.name} is UP`);
  } catch (error) {
    const monitor = await Monitor.findById(monitorId);

    if (!monitor) return;

    monitor.status = "DOWN";
    monitor.statusCode = error.response?.status || 500;
    monitor.responseTime = 0;
    monitor.lastChecked = new Date();

    await monitor.save();

    console.log(`${monitor.name} is DOWN`);
  }
};

export default checkMonitor;