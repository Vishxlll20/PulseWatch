import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import authMiddleware from "./middlewares/auth.middleware.js";
import monitorRoutes from "./routes/monitor.routes.js";
import logRoutes from "./routes/log.routes.js";
import incidentRoutes from "./routes/incident.routes.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: "Protected route accessed",
    user: req.user,
  });
});

app.get("/", (req, res) => {
  res.send("PulseWatch API running");
});
app.use("/api/monitor", monitorRoutes);
app.use("/api/logs", logRoutes);
app.use("/api/incidents", incidentRoutes);

export default app;
