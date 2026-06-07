import http from "http";
import app from "./src/app.js";
import config from "./src/config/config.js";
import connectDB from "./src/config/db.js";
import { initSocket } from "./src/socket/socket.js";
import startCron from "./src/jobs/cron.js";


connectDB();

const server = http.createServer(app);

initSocket(server);

startCron();
console.log("✅ Monitor cron jobs started");

server.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});