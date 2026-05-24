import { useEffect, useState } from "react";
import socket from "../socket";
import api from "../services/api";
import MonitorCard from "../components/MonitorCard";

function Dashboard() {
  const [monitors, setMonitors] = useState([]);

  const fetchMonitors = async () => {
    try {
      const res = await api.get("/monitor");

      setMonitors(res.data.monitors);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMonitors();

    socket.on("monitor-update", (data) => {
      console.log("Realtime:", data);

      setMonitors((prev) =>
        prev.map((monitor) =>
          monitor._id === data.monitorId
            ? {
                ...monitor,
                status: data.status,
                responseTime:
                  data.responseTime,
                statusCode:
                  data.statusCode,
              }
            : monitor
        )
      );
    });

    return () => {
      socket.off("monitor-update");
    };
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>PulseWatch Dashboard</h1>

      {monitors.map((monitor) => (
        <MonitorCard
          key={monitor._id}
          monitor={monitor}
        />
      ))}
    </div>
  );
}

export default Dashboard;