import React, { useEffect } from 'react';
import { Terminal, X, Trash2, Loader, Clock, AlertCircle } from 'lucide-react';
import { useLog } from '../hooks/useLog';

const LogsModal = ({ monitorId, onClose }) => {
  const { logs, loading, fetchLogs, deleteLogs } = useLog();

  useEffect(() => {
    if (monitorId) {
      fetchLogs(monitorId, 50, 1);
    }
  }, [monitorId, fetchLogs]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete all logs for this monitor?')) {
      await deleteLogs(monitorId);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'UP': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'DOWN': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      case 'DEGRADED': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      default: return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/60 backdrop-blur-sm font-['Inter',sans-serif]">
      <div className="bg-white/95 border border-rose/20 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-rose/10 bg-cream/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#522B5B] to-[#854F6C] flex items-center justify-center text-cream shadow-md">
              <Terminal size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-dark">Audit Logs</h2>
              <p className="text-xs text-accent/60 font-medium">Recent check history for this monitor</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 text-rose-500 bg-rose-500/10 rounded-xl hover:bg-rose-500/20 transition-colors font-semibold text-sm"
            >
              <Trash2 size={16} /> Clear Logs
            </button>
            <button 
              onClick={onClose}
              className="p-2 text-accent/60 hover:bg-rose/10 hover:text-dark rounded-xl transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-cream/10">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader className="animate-spin text-[#522B5B]" size={32} />
              <p className="text-accent/60 font-medium text-sm">Fetching logs...</p>
            </div>
          ) : !logs || logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-16 h-16 rounded-full bg-rose/10 flex items-center justify-center text-rose/50">
                <AlertCircle size={32} />
              </div>
              <p className="text-accent/60 font-medium text-sm">No logs found for this monitor.</p>
            </div>
          ) : (
            <div className="bg-dark/5 border border-rose/10 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-dark/5 text-accent/60 text-xs uppercase tracking-wider font-bold">
                  <tr>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">HTTP Code</th>
                    <th className="px-6 py-4">Response Time</th>
                    <th className="px-6 py-4">Message</th>
                    <th className="px-6 py-4">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rose/5">
                  {logs.map((log) => (
                    <tr key={log._id || log.id} className="hover:bg-white/40 transition-colors">
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-lg border text-[10px] font-black tracking-widest uppercase ${getStatusStyle(log.status)}`}>
                          {log.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono font-bold text-dark/70">
                        {log.statusCode || '-'}
                      </td>
                      <td className="px-6 py-4 font-mono text-accent">
                        {log.responseTime ? `${log.responseTime}ms` : '-'}
                      </td>
                      <td className="px-6 py-4 text-accent/80 font-medium truncate max-w-[200px]" title={log.errorMessage}>
                        {log.errorMessage || 'OK'}
                      </td>
                      <td className="px-6 py-4 text-accent/60 flex items-center gap-1.5 font-medium">
                        <Clock size={14} />
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LogsModal;
