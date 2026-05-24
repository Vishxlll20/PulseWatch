import { useEffect, useState } from "react";
import socket from "../socket";
import api from "../services/api";
import MonitorCard from "../components/MonitorCard";

function Dashboard() {
  const [monitors, setMonitors] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    url: "",
    method: "GET",
    interval: 60,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const fetchMonitors = async () => {
    try {
      const res = await api.get("/monitor");

      setMonitors(res.data.monitors);
    } catch (error) {
      console.log(error);
    }
  };

  const createMonitor = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/monitor/create", formData);

      setMonitors((prev) => [...prev, res.data.monitor]);

      setFormData({
        name: "",
        url: "",
        method: "GET",
        interval: 60,
      });
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
                responseTime: data.responseTime,
                statusCode: data.statusCode,
              }
            : monitor,
        ),
      );
    });

    return () => {
      socket.off("monitor-update");
    };
  }, []);

  const handleDelete = (id) => {
    setMonitors((prev) => prev.filter((monitor) => monitor._id !== id));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>PulseWatch Dashboard</h1>

      <form
        onSubmit={createMonitor}
        style={{
          marginBottom: "20px",
        }}
      >
        <input
          type="text"
          name="name"
          placeholder="Monitor Name"
          value={formData.name}
          onChange={handleChange}
        />

        <input
          type="text"
          name="url"
          placeholder="https://example.com"
          value={formData.url}
          onChange={handleChange}
        />

        <select name="method" value={formData.method} onChange={handleChange}>
          <option value="GET">GET</option>

          <option value="POST">POST</option>
        </select>

        <input
          type="number"
          name="interval"
          value={formData.interval}
          onChange={handleChange}
        />

        <button type="submit">Add Monitor</button>
      </form>

      {monitors.map((monitor) => (
        <MonitorCard
          key={monitor._id}
          monitor={monitor}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}

export default Dashboard;
