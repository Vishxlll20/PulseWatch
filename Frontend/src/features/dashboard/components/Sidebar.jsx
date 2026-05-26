import {
  LayoutDashboard,
  Activity,
  AlertTriangle,
  BarChart3,
  Bell,
  Settings,
} from "lucide-react";

function Sidebar() {
  return (
    <div className="w-[260px] bg-[#0B1220] border-r border-[#1E293B] h-screen fixed left-0 top-0 px-6 py-8">
      <h1 className="text-3xl font-bold mb-12">PulseWatch</h1>

      <div className="space-y-3">
        <div className="bg-blue-600 px-4 py-3 rounded-xl flex items-center gap-3">
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </div>

        <div className="px-4 py-3 rounded-xl flex items-center gap-3 text-gray-400 hover:bg-[#111827] hover:text-white transition">
          <Activity size={20} />
          <span>Monitors</span>
        </div>

        <div className="px-4 py-3 rounded-xl flex items-center gap-3 text-gray-400 hover:bg-[#111827] hover:text-white transition">
          <AlertTriangle size={20} />
          <span>Incidents</span>
        </div>

        <div className="px-4 py-3 rounded-xl flex items-center gap-3 text-gray-400 hover:bg-[#111827] hover:text-white transition">
          <BarChart3 size={20} />
          <span>Analytics</span>
        </div>

        <div className="px-4 py-3 rounded-xl flex items-center gap-3 text-gray-400 hover:bg-[#111827] hover:text-white transition">
          <Bell size={20} />
          <span>Alerts</span>
        </div>

        <div className="px-4 py-3 rounded-xl flex items-center gap-3 text-gray-400 hover:bg-[#111827] hover:text-white transition">
          <Settings size={20} />
          <span>Settings</span>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
