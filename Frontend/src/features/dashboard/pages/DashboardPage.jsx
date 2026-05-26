import { useEffect, useState } from "react";

import api from "../../monitors/service/api";

import socket from "../../../services/socketService";

import DashboardLayout from "../components/DashboardLayout";

import Sidebar from "../components/Sidebar";

import Topbar from "../components/Topbar";

import StatsGrid from "../components/StatsGrid";

import MonitorCard from "../../monitors/components/MonitorCard";

function DashboardPage() {
  const [monitors, setMonitors] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    url: "",
    method: "GET",
    interval: 60,
  });

  const fetchMonitors = async () => {
    try {
      const res = await api.get("/monitor");

      setMonitors(res.data.monitors);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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

  const handleDelete = (id) => {
    setMonitors((prev) => prev.filter((monitor) => monitor._id !== id));
  };

  useEffect(() => {
    fetchMonitors();

    socket.on("monitor-update", (data) => {
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

  return (
    <DashboardLayout>
      <Sidebar />

      <div className="ml-[260px] flex-1 p-8">
        <Topbar />

        <StatsGrid monitors={monitors} />

        <div className="bg-[#0B1220] border border-[#1E293B] rounded-2xl p-6 mb-10">
          <h2 className="text-2xl font-bold mb-6">Add Monitor</h2>

          <form onSubmit={createMonitor} className="grid md:grid-cols-4 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Monitor Name"
              value={formData.name}
              onChange={handleChange}
              className="bg-[#111827] border border-[#1E293B] rounded-xl px-4 py-3 outline-none"
            />

            <input
              type="text"
              name="url"
              placeholder="https://example.com"
              value={formData.url}
              onChange={handleChange}
              className="bg-[#111827] border border-[#1E293B] rounded-xl px-4 py-3 outline-none"
            />

            <select
              name="method"
              value={formData.method}
              onChange={handleChange}
              className="bg-[#111827] border border-[#1E293B] rounded-xl px-4 py-3 outline-none"
            >
              <option value="GET">GET</option>

              <option value="POST">POST</option>
            </select>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 rounded-xl px-4 py-3 font-semibold transition"
            >
              Add Monitor
            </button>
          </form>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {monitors.map((monitor) => (
            <MonitorCard
              key={monitor._id}
              monitor={monitor}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default DashboardPage;
