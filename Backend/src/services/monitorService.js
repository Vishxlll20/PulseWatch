import axios from "axios";
import https from "https";
import Monitor from "../models/monitor.model.js";
import Log from "../models/log.model.js";
import * as incidentService from "./incidentService.js";
import { getIO } from "../socket/socket.js";

// 🔥 DEGRADED_THRESHOLD_MS: Mark as DEGRADED if response takes longer than this
// Increased from 1000ms to 5000ms - most websites take 1-3 seconds, 5s is generous
const DEGRADED_THRESHOLD_MS = 5000;

// Create HTTPS agent that allows self-signed certificates
const httpsAgent = new https.Agent({
  rejectUnauthorized: false // Allow self-signed certificates
});

const http = axios.create({
  validateStatus: () => true,
  maxRedirects: 5,
  timeout: 10000,
  httpsAgent: httpsAgent
});

export const checkMonitor = async (monitor) => {
  const start = Date.now();

  let status = "DOWN";
  let statusCode = null;
  let responseTime = null;
  let errorMessage = null;

  try {
    const headers =
      monitor.headers && typeof monitor.headers.entries === "function"
        ? Object.fromEntries(monitor.headers.entries())
        : monitor.headers || {};

    // Add browser-like headers to avoid being blocked by some sites
    if (!headers["User-Agent"]) {
      headers["User-Agent"] = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36";
    }
    if (!headers["Accept"]) {
      headers["Accept"] = "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8";
    }
    if (!headers["Accept-Language"]) {
      headers["Accept-Language"] = "en-US,en;q=0.9";
    }
    if (!headers["Connection"]) {
      headers["Connection"] = "keep-alive";
    }

    const req = {
      method: monitor.method || "GET",
      url: monitor.url,
      headers,
      timeout: monitor.timeout || 8000,
      maxRedirects: 5
    };

    if (req.method === "POST") {
      req.data = monitor.body || {};
    }

    const res = await http(req);

    responseTime = Date.now() - start;
    statusCode = res.status;

    // Check if status code is acceptable (within 2xx range or matches expected)
    const isStatusOk = 
      (statusCode >= 200 && statusCode < 300) || 
      statusCode === monitor.expectedStatus;

    if (!isStatusOk) {
      status = "DOWN";
    } else if (responseTime > DEGRADED_THRESHOLD_MS) {
      status = "DEGRADED";
    } else {
      status = "UP";
    }

  } catch (err) {
    responseTime = Date.now() - start;
    errorMessage = err.code || err.message || "REQUEST_FAILED";
    status = "DOWN";
    
    // Log the full error for debugging
    console.error(`[Monitor Check Failed] ${monitor.name} (${monitor.url}):`, {
      code: err.code,
      message: err.message,
      response: err.response?.status,
      errno: err.errno
    });
  }

  // 🔥 1. Save log
  const log = await Log.create({
    monitorId: monitor._id,
    status,
    statusCode,
    responseTime,
    errorMessage
  });

  // 🔥 2. Update monitor snapshot
  await Monitor.findByIdAndUpdate(
    monitor._id,
    {
      status,
      lastChecked: new Date()
    }
  ).catch(() => {});

  // 🔥 3. Incident handling
  await incidentService.handleIncident(monitor._id).catch(() => {});

  // 🔥 4. Realtime emit
  try {
    const io = getIO();
    io.emit("logUpdate", {
      monitorId: monitor._id,
      status,
      statusCode,
      responseTime,
      createdAt: log.createdAt
    });
  } catch (_) {}

  return { status, statusCode, responseTime, errorMessage };
};