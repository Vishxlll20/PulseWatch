import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Edit2, Play, Pause, Activity, FileText, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMonitor } from '../hooks/useMonitor';

const MonitorCard = ({ monitor, onShowLogs, onDelete }) => {
  const navigate = useNavigate();
  const { toggleMonitor, runMonitorNow } = useMonitor();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const getStatusColor = (status) => {
    switch ((status || 'UNKNOWN').toUpperCase()) {
      case 'UP':
      case 'operational': return 'text-emerald-400 bg-emerald-400/10';
      case 'DOWN': return 'text-rose-400 bg-rose-400/10';
      case 'DEGRADED': return 'text-amber-400 bg-amber-400/10';
      default: return 'text-slate-400 bg-slate-400/10';
    }
  };

  const getStatusDot = (status) => {
    switch ((status || 'UNKNOWN').toUpperCase()) {
      case 'UP':
      case 'operational': return 'bg-emerald-400';
      case 'DOWN': return 'bg-rose-400';
      case 'DEGRADED': return 'bg-amber-400';
      default: return 'bg-slate-400';
    }
  };

  const status = monitor.status || 'UNKNOWN';
  const response = monitor.response || (monitor.lastChecked ? 'Checked' : '-');
  const uptime = monitor.uptime || '-';
  const interval = Number.isFinite(Number(monitor.interval)) ? `${monitor.interval}s` : monitor.interval || '-';
  const history = Array.isArray(monitor.history) && monitor.history.length > 0
    ? monitor.history
    : Array.from({ length: 24 }, (_, index) => (status === 'DOWN' ? 35 : status === 'DEGRADED' ? 60 : 85 + (index % 4) * 3));

  return (
    <div className="monitor-card bg-white/60 p-6 rounded-3xl border border-rose/40 hover:shadow-[0_30px_60px_-15px_rgba(43,18,76,0.1)] transition-all duration-500 group opacity-0 shadow-sm relative">
      {/* Decorative inner glow - subtle cream/rose */}
      <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-cream/50 rounded-full blur-3xl transition-all duration-700"></div>
      </div>
      
      <div className="flex justify-between items-start mb-6 relative z-20">
        <div>
          <h3 className="text-dark font-bold text-lg tracking-tight group-hover:text-secondary transition-colors">{monitor.name}</h3>
          <p className="text-accent/60 text-[11px] font-medium truncate max-w-[200px] mt-0.5">{monitor.url}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(status)} shadow-lg shadow-secondary/20 border border-white/20`}>
            <div className={`w-1.5 h-1.5 rounded-full ${getStatusDot(status)} shadow-[0_0_8px_rgba(255,255,255,0.4)]`} />
            {status}
          </div>
          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 rounded-full text-accent/60 hover:text-dark hover:bg-white/50 transition-colors"
            >
              <MoreVertical size={16} />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-rose/20 overflow-hidden z-50">
                <div className="py-2">
                  <button 
                    onClick={() => { navigate(`/dashboard/monitors/${monitor._id || monitor.id}/edit`); setShowMenu(false); }}
                    className="w-full px-4 py-2 text-left text-sm font-semibold text-dark hover:bg-cream/50 transition-colors flex items-center gap-2"
                  >
                    <Edit2 size={14} className="text-accent/70" /> Edit
                  </button>
                  <button 
                    onClick={() => { toggleMonitor(monitor._id || monitor.id); setShowMenu(false); }}
                    className="w-full px-4 py-2 text-left text-sm font-semibold text-dark hover:bg-cream/50 transition-colors flex items-center gap-2"
                  >
                    {monitor.isActive ? <Pause size={14} className="text-amber-500" /> : <Play size={14} className="text-emerald-500" />}
                    {monitor.isActive ? 'Pause' : 'Resume'}
                  </button>
                  <button 
                    onClick={() => { runMonitorNow(monitor._id || monitor.id); setShowMenu(false); }}
                    className="w-full px-4 py-2 text-left text-sm font-semibold text-dark hover:bg-cream/50 transition-colors flex items-center gap-2"
                  >
                    <Activity size={14} className="text-primary" /> Run Check Now
                  </button>
                  <div className="h-px bg-rose/20 my-1"></div>
                  <button 
                    onClick={() => { if(onShowLogs) onShowLogs(monitor._id || monitor.id); setShowMenu(false); }}
                    className="w-full px-4 py-2 text-left text-sm font-semibold text-dark hover:bg-cream/50 transition-colors flex items-center gap-2"
                  >
                    <FileText size={14} className="text-secondary" /> View Logs
                  </button>
                  <div className="h-px bg-rose/20 my-1"></div>
                  <button 
                    onClick={() => { if(onDelete) onDelete(monitor._id || monitor.id); setShowMenu(false); }}
                    className="w-full px-4 py-2 text-left text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2"
                  >
                    <Trash2 size={14} /> Delete Monitor
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-8 relative z-10 bg-cream/30 p-4 rounded-2xl border border-rose/20">
        <div className="text-center">
          <p className="text-[9px] font-bold text-accent/50 uppercase tracking-[0.15em] mb-1.5">Response</p>
          <p className="text-xs font-bold text-dark">{response}</p>
        </div>
        <div className="text-center border-x border-rose/20">
          <p className="text-[9px] font-bold text-accent/50 uppercase tracking-[0.15em] mb-1.5">Uptime</p>
          <p className="text-xs font-bold text-dark">{uptime}</p>
        </div>
        <div className="text-center">
          <p className="text-[9px] font-bold text-accent/50 uppercase tracking-[0.15em] mb-1.5">Interval</p>
          <p className="text-xs font-bold text-dark">{interval}</p>
        </div>
      </div>

      {/* History Bars - Purple and Rose shades */}
      <div className="flex items-end gap-[3px] h-10 w-full relative z-10 px-1">
        {history.map((h, i) => {
          const isHigh = h > 60;
          return (
            <div 
              key={i} 
              className={`flex-1 rounded-full transition-all duration-500 hover:scale-y-150 cursor-pointer ${
                isHigh ? 'bg-secondary/60 hover:bg-secondary' : 'bg-rose/80 hover:bg-rose'
              }`}
              style={{ height: `${Math.max(30, h)}%` }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default MonitorCard;
