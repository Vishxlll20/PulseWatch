import dotenv from "dotenv";
import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import startMonitorJob from "./src/jobs/monitor.job.js";

dotenv.config();

connectDB();
startMonitorJob();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});