import React, { useState } from 'react';
import { MoreHorizontal, ChevronRight, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const RealTimeStatus = ({ monitors = [], fetchMonitors, loading = false }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchMonitors();
      toast.success('Monitors refreshed');
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      setIsRefreshing(false);
    }
  };
  const rows = monitors.map((monitor) => ({
    id: monitor._id,
    name: monitor.name || monitor.url,
    url: monitor.url,
    status: monitor.status || 'UNKNOWN',
    response: monitor.response || '—',
    lastCheck: monitor.lastChecked || monitor.updatedAt || monitor.createdAt,
    isActive: monitor.isActive,
  }));

  const getStatusStyle = (status) => {
    switch (status) {
      case 'UP':
      case 'Operational':
        return 'bg-emerald-500/10 text-emerald-300 border-emerald-400/20';
      case 'DOWN':
        return 'bg-red-500/10 text-red-300 border-red-400/20';
      case 'DEGRADED':
      case 'Degraded':
        return 'bg-amber-500/10 text-amber-300 border-amber-400/20';
      default:
        return 'bg-cream text-primary border-white/20';
    }
  };

  const getStatusDot = (status) => {
    switch (status) {
      case 'UP':
      case 'Operational': return 'bg-green-500';
      case 'DOWN':
      case 'Down': return 'bg-red-500';
      case 'DEGRADED':
      case 'Degraded': return 'bg-yellow-500';
      default: return 'bg-primary/50';
    }
  };

  return (
    <div className="bg-[#3E2522] rounded-3xl sm:rounded-4xl shadow-2xl overflow-hidden animate-item border border-white/5 relative">
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: `radial-gradient(#DFB6B2 1px, transparent 1px)`, backgroundSize: '32px 32px' }} />

      <div className="p-5 sm:p-8 border-b border-white/5 flex justify-between items-center relative z-10">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-cream">Real-time status</h2>
          <p className="text-rose text-sm font-medium mt-1 opacity-80">Live across {rows.length} monitors</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing || loading}
            className="p-2 text-cream hover:text-white hover:bg-white/10 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            title="Refresh monitor status"
          >
            <RefreshCw size={18} className={isRefreshing || loading ? 'animate-spin' : ''} />
          </button>
          <button className="flex items-center gap-1 text-sm font-bold text-cream hover:text-white transition-colors">
            View all <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Scrollable table wrapper */}
      <div className="overflow-x-auto relative z-10">
        <table className="w-full text-left border-collapse min-w-[560px]">
          <thead>
            <tr className="bg-white/5">
              <th className="px-5 sm:px-8 py-4 sm:py-5 text-[10px] font-bold text-rose uppercase tracking-[0.2em]">Website</th>
              <th className="px-5 sm:px-8 py-4 sm:py-5 text-[10px] font-bold text-rose uppercase tracking-[0.2em]">Status</th>
              <th className="px-5 sm:px-8 py-4 sm:py-5 text-[10px] font-bold text-rose uppercase tracking-[0.2em]">Response</th>
              <th className="px-5 sm:px-8 py-4 sm:py-5 text-[10px] font-bold text-rose uppercase tracking-[0.2em] hidden md:table-cell">Last Check</th>
              <th className="px-5 sm:px-8 py-4 sm:py-5 text-[10px] font-bold text-rose uppercase tracking-[0.2em] hidden sm:table-cell">Active</th>
              <th className="px-5 sm:px-8 py-4 sm:py-5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {rows.map((monitor) => (
              <tr key={monitor.id} className="hover:bg-white/3 transition-colors group cursor-default">
                <td className="px-5 sm:px-8 py-4 sm:py-6">
                  <p className="text-sm font-bold text-cream truncate max-w-[140px] sm:max-w-none">{monitor.name}</p>
                  <p className="text-[10px] font-medium text-rose mt-0.5 opacity-60 group-hover:opacity-100 transition-opacity truncate max-w-[140px] sm:max-w-xs">{monitor.url}</p>
                </td>
                <td className="px-5 sm:px-8 py-4 sm:py-6">
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusStyle(monitor.status)} shadow-lg shadow-black/20`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(monitor.status)}`} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">{monitor.status}</span>
                  </div>
                </td>
                <td className="px-5 sm:px-8 py-4 sm:py-6 text-sm font-bold text-cream tabular-nums">{monitor.response}</td>
                <td className="px-5 sm:px-8 py-4 sm:py-6 text-[10px] font-bold text-rose uppercase tracking-widest hidden md:table-cell">
                  {monitor.lastCheck ? new Date(monitor.lastCheck).toLocaleString() : '—'}
                </td>
                <td className="px-5 sm:px-8 py-4 sm:py-6 text-[10px] font-bold text-rose uppercase tracking-widest hidden sm:table-cell">
                  {monitor.isActive ? 'Yes' : 'Paused'}
                </td>
                <td className="px-5 sm:px-8 py-4 sm:py-6 text-right">
                  <button className="p-2 text-rose hover:text-white hover:bg-white/10 rounded-xl transition-all">
                    <MoreHorizontal size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RealTimeStatus;
