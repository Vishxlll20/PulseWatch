import { useState, useEffect } from "react";
import {
  HiOutlineTrash,
  HiOutlineRefresh,
  HiOutlineSearch,
  HiOutlinePlus,
  HiOutlineX,
} from "react-icons/hi";
import {
  BsThreeDotsVertical,
  BsCheckCircle,
  BsExclamationTriangle,
  BsClock,
} from "react-icons/bs";

// Removed hardcoded initialMonitors

const statusStyles = {
  UP: {
    label: "Online",
    color: "#065f46",
    bg: "#d1fae5",
    dot: "#10b981",
    icon: <BsCheckCircle className="text-xs" />,
  },
  DOWN: {
    label: "Down",
    color: "#9f1239",
    bg: "#ffe4e6",
    dot: "#f43f5e",
    icon: <BsExclamationTriangle className="text-xs" />,
  },
  DEGRADED: {
    label: "Slow",
    color: "#9a3412",
    bg: "#ffedd5",
    dot: "#f97316",
    icon: <BsClock className="text-xs" />,
  },
  UNKNOWN: {
    label: "Unknown",
    color: "#374151",
    bg: "#f3f4f6",
    dot: "#9ca3af",
    icon: <BsClock className="text-xs" />,
  }
};

const monitorTypes = ["API", "HTTPS", "TCP", "Ping"];
const intervals = ["1 min", "5 min", "10 min", "30 min", "1 hour"];

const StatCard = ({
  title,
  value,
  subtext,
  valueColor = "text-[#1a0e08]",
  icon,
}) => (
  <div className="bg-white/50 backdrop-blur-sm rounded-2xl border border-[#1a0e08]/8 p-4 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-2">
      <p className="text-xs font-semibold text-[#1a0e08]/50 uppercase tracking-wider">
        {title}
      </p>
      <div className="text-[#1a0e08]/30">{icon}</div>
    </div>
    <p className={`text-2xl sm:text-3xl font-bold ${valueColor}`}>{value}</p>
    {subtext && <p className="text-xs text-[#1a0e08]/50 mt-1">{subtext}</p>}
  </div>
);

const MonitorMobileCard = ({ monitor, style, activeMenuId, setActiveMenuId, removeMonitor }) => {
  const isMenuOpen = activeMenuId === monitor._id;

  return (
    <div className="bg-white/80 rounded-2xl border border-[#1a0e08]/8 p-4 mb-3 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: style.dot }}
          />
          <span className="font-semibold text-[#1a0e08] truncate text-sm sm:text-base">
            {monitor.name}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span
            className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold"
            style={{ backgroundColor: style.bg, color: style.color }}
          >
            {style.icon}
            {style.label}
          </span>
          <div className="relative monitor-menu">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveMenuId(isMenuOpen ? null : monitor.id);
              }}
              className="p-1.5 rounded-full hover:bg-[#1a0e08]/5 transition-colors"
            >
              <BsThreeDotsVertical className="text-[#1a0e08]/40 text-sm" />
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 top-8 z-20 w-32 bg-white rounded-xl shadow-lg border border-[#1a0e08]/10 py-1">
                <button
                  onClick={() => removeMonitor(monitor._id)}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                >
                  <HiOutlineTrash className="text-sm" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-y-2 gap-x-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-[#1a0e08]/40 text-xs">Type</span>
          <span className="text-[#1a0e08]/70 font-medium">
            {monitor.type}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[#1a0e08]/40 text-xs">Interval</span>
          <span className="text-[#1a0e08]/70">{monitor.interval >= 60 ? `${monitor.interval / 60} min` : `${monitor.interval} sec`}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[#1a0e08]/40 text-xs">Latency</span>
          <span className="text-[#1a0e08]/70 font-mono">
            {monitor.response || monitor.latency || '—'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[#1a0e08]/40 text-xs">Uptime</span>
          <span className="text-[#1a0e08]/70 font-semibold">
            {monitor.uptime}
          </span>
        </div>
      </div>
    </div>
  );
};

import adminService from "../../service/adminService";
import toast from "react-hot-toast";

export default function Monitors() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMonitor, setNewMonitor] = useState({
    name: "",
    type: "API",
    interval: 60,
  });

  const fetchMonitors = async () => {
    try {
      setLoading(true);
      const data = await adminService.getMonitors();
      setList(data);
    } catch (err) {
      toast.error("Failed to load monitors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonitors();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeMenuId !== null && !event.target.closest(".monitor-menu")) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [activeMenuId]);

  const removeMonitor = async (id) => {
    try {
      await adminService.deleteMonitor(id);
      setList((prev) => prev.filter((m) => m._id !== id));
      toast.success("Monitor deleted successfully");
    } catch (error) {
      toast.error("Failed to delete monitor");
    }
    setActiveMenuId(null);
  };

  const addMonitor = () => {
    if (!newMonitor.name.trim()) return;

    const newId = Math.max(...list.map((m) => m.id), 0) + 1;
    const monitorToAdd = {
      id: newId,
      name: newMonitor.name,
      type: newMonitor.type,
      status: "up",
      latency: "—",
      uptime: "100%",
      interval: newMonitor.interval,
    };

    setList([monitorToAdd, ...list]);
    setNewMonitor({ name: "", type: "API", interval: "1 min" });
    setShowAddModal(false);
  };

  const totalMonitors = list.filter((monitor) =>
    monitor.name.toLowerCase().includes(searchQuery.toLowerCase()),
  ).length;

  const filteredList = list.filter((monitor) =>
    monitor.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const onlineCount = filteredList.filter((m) => m.status === "UP").length;
  const issuesCount = filteredList.filter((m) => m.status === "DOWN" || m.status === "DEGRADED").length;
  const healthPercentage =
    totalMonitors > 0 ? Math.round((onlineCount / totalMonitors) * 100) : 0;

  return (
    <div
      className="min-h-screen p-4 sm:p-6 md:p-8"
      style={{ backgroundColor: "#FAF9F6" }}
    >
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1a0e08]">
              Monitors
            </h1>
            <p className="text-[#1a0e08]/50 text-sm mt-0.5">
              Monitor your services in real-time
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchMonitors}
              disabled={loading}
              className={`p-2 rounded-xl bg-white/50 border border-[#1a0e08]/8 text-[#1a0e08]/50 hover:bg-white transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <HiOutlineRefresh className={`text-lg ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1a0e08] text-white text-sm font-medium hover:bg-[#1a0e08]/85 transition-colors shadow-sm"
            >
              <HiOutlinePlus className="text-base" />
              Add Monitor
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-4">
          <div className="relative">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1a0e08]/40 text-sm" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search monitors..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/50 border border-[#1a0e08]/8 text-sm text-[#1a0e08] placeholder:text-[#1a0e08]/40 focus:outline-none focus:ring-2 focus:ring-[#1a0e08]/20 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
        <StatCard
          title="Total"
          value={totalMonitors}
          subtext="Endpoints"
          icon={<div className="w-1 h-1" />}
        />
        <StatCard
          title="Online"
          value={onlineCount}
          subtext={`${healthPercentage}% healthy`}
          valueColor="text-emerald-700"
          icon={<BsCheckCircle className="text-emerald-400" />}
        />
        <StatCard
          title="Issues"
          value={issuesCount}
          subtext={issuesCount > 0 ? "Need attention" : "All good"}
          valueColor={issuesCount > 0 ? "text-rose-700" : "text-[#1a0e08]"}
          icon={
            <BsExclamationTriangle
              className={
                issuesCount > 0 ? "text-amber-500" : "text-[#1a0e08]/30"
              }
            />
          }
        />
      </div>

      {/* Monitor List Container */}
      <div className="bg-white/30 backdrop-blur-sm rounded-2xl border border-[#1a0e08]/8 overflow-hidden">
        {/* Desktop Table Header */}
        <div className="hidden md:grid md:grid-cols-12 gap-4 px-4 py-3 bg-white/20 border-b border-[#1a0e08]/8 text-xs font-semibold text-[#1a0e08]/50 uppercase tracking-wider">
          <div className="md:col-span-3 pl-2">Monitor</div>
          <div className="md:col-span-2">User</div>
          <div className="md:col-span-1">Type</div>
          <div className="md:col-span-2">Interval</div>
          <div className="md:col-span-1">Latency</div>
          <div className="md:col-span-1">Uptime</div>
          <div className="md:col-span-1">Status</div>
          <div className="md:col-span-1 text-center">Actions</div>
        </div>

        {/* List Items */}
        <div>
          {filteredList.map((monitor) => {
            const style = statusStyles[monitor.status || 'UNKNOWN'];
            return (
              <div key={monitor._id}>
                {/* Desktop Row */}
                <div className="hidden md:grid md:grid-cols-12 gap-4 px-4 py-3 items-center border-b border-[#1a0e08]/5 hover:bg-white/30 transition-colors">
                  <div className="md:col-span-3 flex items-center gap-2 min-w-0 pl-2">
                    <div
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: style.dot }}
                    />
                    <span className="font-medium text-[#1a0e08] truncate text-sm">
                      {monitor.name}
                    </span>
                  </div>
                  <div className="md:col-span-2 text-sm text-[#1a0e08]/80 truncate">
                    {monitor.userId?.username || 'Unknown'}
                  </div>
                  <div className="md:col-span-1 text-sm text-[#1a0e08]/60">
                    {monitor.type || 'API'}
                  </div>
                  <div className="md:col-span-2 text-sm text-[#1a0e08]/60">
                    {monitor.interval >= 60 ? `${monitor.interval / 60} min` : `${monitor.interval} sec`}
                  </div>
                  <div className="md:col-span-1 text-sm font-mono text-[#1a0e08]/60">
                    {monitor.response || monitor.latency || '—'}
                  </div>
                  <div className="md:col-span-1 text-sm font-semibold text-[#1a0e08]/70">
                    {monitor.uptime}
                  </div>
                  <div className="md:col-span-1">
                    <span
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
                      style={{ backgroundColor: style.bg, color: style.color }}
                    >
                      {style.icon}
                      {style.label}
                    </span>
                  </div>
                  <div className="md:col-span-1 text-center">
                    <button
                      onClick={() => removeMonitor(monitor._id)}
                      className="text-[#1a0e08]/30 hover:text-red-500 transition-colors p-1"
                    >
                      <HiOutlineTrash className="text-base" />
                    </button>
                  </div>
                </div>

                {/* Mobile Card */}
                <div className="md:hidden">
                  <MonitorMobileCard 
                    monitor={monitor} 
                    style={style} 
                    activeMenuId={activeMenuId} 
                    setActiveMenuId={setActiveMenuId} 
                    removeMonitor={removeMonitor} 
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredList.length === 0 && (
          <div className="text-center py-12 sm:py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#1a0e08]/5 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-[#1a0e08]/30"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <p className="text-[#1a0e08]/40 text-base">No monitors found.</p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="mt-3 text-sm text-[#1a0e08]/50 hover:text-[#1a0e08] transition-colors"
              >
                Clear search
              </button>
            )}
            {!searchQuery && (
              <button
                onClick={() => setShowAddModal(true)}
                className="mt-4 px-4 py-2 rounded-xl bg-[#1a0e08] text-white text-sm font-medium hover:bg-[#1a0e08]/85 transition-colors"
              >
                + Add your first monitor
              </button>
            )}
          </div>
        )}
      </div>

      {/* Floating Action Button - Mobile Only */}
      <div className="fixed bottom-6 right-6 md:hidden">
        <button
          onClick={() => setShowAddModal(true)}
          className="w-14 h-14 rounded-full bg-[#1a0e08] text-white shadow-lg flex items-center justify-center hover:bg-[#1a0e08]/85 transition-colors active:scale-95"
        >
          <HiOutlinePlus className="w-6 h-6" />
        </button>
      </div>

      {/* Add Monitor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-[#1a0e08]/10">
              <h2 className="text-lg font-semibold text-[#1a0e08]">
                Add New Monitor
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-full hover:bg-[#1a0e08]/5 transition-colors"
              >
                <HiOutlineX className="text-xl text-[#1a0e08]/50" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1a0e08]/70 mb-1">
                  Monitor Name
                </label>
                <input
                  type="text"
                  value={newMonitor.name}
                  onChange={(e) =>
                    setNewMonitor({ ...newMonitor, name: e.target.value })
                  }
                  placeholder="e.g., api.myapp.com"
                  className="w-full px-3 py-2 rounded-xl border border-[#1a0e08]/15 focus:outline-none focus:ring-2 focus:ring-[#1a0e08]/20 text-sm"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1a0e08]/70 mb-1">
                  Monitor Type
                </label>
                <select
                  value={newMonitor.type}
                  onChange={(e) =>
                    setNewMonitor({ ...newMonitor, type: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[#1a0e08]/15 focus:outline-none focus:ring-2 focus:ring-[#1a0e08]/20 text-sm bg-white"
                >
                  {monitorTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1a0e08]/70 mb-1">
                  Check Interval
                </label>
                <select
                  value={newMonitor.interval}
                  onChange={(e) =>
                    setNewMonitor({ ...newMonitor, interval: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[#1a0e08]/15 focus:outline-none focus:ring-2 focus:ring-[#1a0e08]/20 text-sm bg-white"
                >
                  {intervals.map((interval) => (
                    <option key={interval} value={interval}>
                      {interval}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3 p-5 border-t border-[#1a0e08]/10">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 rounded-xl border border-[#1a0e08]/20 text-[#1a0e08]/60 hover:bg-[#1a0e08]/5 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={addMonitor}
                disabled={!newMonitor.name.trim()}
                className="flex-1 px-4 py-2 rounded-xl bg-[#1a0e08] text-white text-sm font-medium hover:bg-[#1a0e08]/85 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Monitor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
