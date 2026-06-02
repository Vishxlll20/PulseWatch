import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import RealTimeStatus from '../components/RealTimeStatus';
import gsap from 'gsap';
import { useMonitor } from '../../monitors/hooks/useMonitor';
import { useIncident } from '../../incident/hooks/useIncident';
import socketService from '../../../services/socketService';
import {
  ArrowUpRight,
  ArrowDownLeft,
  Activity,
  ShieldAlert,
  Server,
  Globe,
  AlertCircle,
  Loader
} from 'lucide-react';
import toast from 'react-hot-toast';

const DashboardPage = () => {
  const pageRef = useRef(null);
  const { monitors, fetchMonitors, loading: monitorsLoading } = useMonitor();
  const { incidents, loading: incidentsLoading, fetchAllIncidents } = useIncident();
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');

  useEffect(() => {
    fetchMonitors();
    fetchAllIncidents();

    const handleIncidentUpdate = (data) => {
      if (!data.resolved) {
        // Show in-app toast notification
        toast.error(`🚨 ${data.type} - Monitor incident detected`, {
          duration: 5000,
          position: 'top-right'
        });
        
        // Show browser notification if user has granted permission
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('PulseWatch Alert', {
            body: `${data.type}: A monitor has gone ${data.type}!`,
            icon: '/icon.png',
            tag: `incident-${data.monitorId}`,
            requireInteraction: true
          });
        }
        
        fetchAllIncidents();
      } else {
        toast.success(`✅ Incident resolved`, {
          duration: 4000,
          position: 'top-right'
        });
        fetchAllIncidents();
      }
    };

    socketService.onIncidentCreated(handleIncidentUpdate);

    return () => {
      socketService.off('incidentUpdate', handleIncidentUpdate);
    };
  }, [fetchAllIncidents, fetchMonitors]);

  // Request notification permission on component mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          console.log('Browser notifications enabled');
        }
      });
    }
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set('.stat-card, .chart-section, .animate-item', { opacity: 0, y: 20 });

      gsap.to('.stat-card', {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.2
      });

      gsap.to('.chart-section, .animate-item', {
        opacity: 1,
        y: 0,
        stagger: 0.2,
        duration: 1,
        ease: 'power3.out',
        delay: 0.5
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  const upMonitors = monitors.filter(m => m.status === 'UP').length;
  const downMonitors = monitors.filter(m => m.status === 'DOWN').length;
  const degradedMonitors = monitors.filter(m => m.status === 'DEGRADED').length;
  const openIncidents = incidents.filter(incident => !incident.resolved);
  const avgResponseTime = monitors.length > 0
    ? Math.round(monitors.reduce((sum, m) => sum + (parseInt(m.response) || 0), 0) / monitors.length)
    : 0;

  const systemUptime = monitors.length > 0 ? ((upMonitors / monitors.length) * 100).toFixed(2) + '%' : '100%';
  const stats = [
    { label: 'Active Monitors', value: monitors.length.toString(), change: `${upMonitors} UP`, positive: true, icon: Globe, color: '#522B5B' },
    { label: 'System Health', value: systemUptime, change: downMonitors > 0 ? 'Degraded' : 'Optimal', positive: downMonitors === 0, icon: Activity, color: '#2B124C' },
    { label: 'Open Incidents', value: openIncidents.length.toString(), change: openIncidents.length > 0 ? 'Action needed' : 'All clear', positive: openIncidents.length === 0, icon: ShieldAlert, color: '#854F6C' },
    { label: 'Avg Response', value: `${avgResponseTime}ms`, change: downMonitors > 0 ? `${downMonitors} DOWN` : 'Healthy', positive: downMonitors === 0, icon: Server, color: '#190019' },
  ];

  return (
    <DashboardLayout pageRef={pageRef}>
      <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8">
        <header className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-dark tracking-tight">Dashboard Overview</h1>
          <p className="text-accent font-medium text-sm sm:text-base">Welcome back, here's what's happening with your systems today.</p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="stat-card bg-white border border-rose/30 p-5 sm:p-6 rounded-3xl shadow-[0_10px_40px_-15px_rgba(43,18,76,0.1)] hover:shadow-[0_25px_50px_-12px_rgba(43,18,76,0.2)] transition-shadow duration-300 group cursor-default opacity-0">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-2xl bg-cream/50 group-hover:bg-cream transition-colors duration-300">
                  <stat.icon size={22} style={{ color: stat.color }} />
                </div>
                <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${stat.positive ? 'bg-rose/20 text-accent' : 'bg-accent/10 text-accent'}`}>
                  {stat.positive ? <ArrowUpRight size={14} /> : <ArrowDownLeft size={14} />}
                  {stat.change}
                </div>
              </div>
              <h3 className="text-accent text-xs font-bold mb-1 uppercase tracking-widest">{stat.label}</h3>
              <p className="text-2xl sm:text-3xl font-bold text-dark tabular-nums tracking-tight">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Main Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Monitor Status Chart */}
          <div className="lg:col-span-2 chart-section bg-[#3E2522] p-6 sm:p-8 rounded-4xl shadow-2xl text-cream min-h-64 sm:min-h-80 relative overflow-hidden group/chart opacity-0 border border-white/5">
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: `radial-gradient(#DFB6B2 1px, transparent 1px)`, backgroundSize: '24px 24px' }}></div>
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex flex-wrap justify-between items-center gap-4 mb-8 sm:mb-10">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold">Monitor Status Distribution</h2>
                  <p className="text-rose text-sm font-medium opacity-80">Real-time status of all monitors</p>
                </div>
                <div className="flex gap-2 p-1 bg-white/5 rounded-full border border-white/10">
                  {['24h', '7d', '30d'].map(t => (
                    <button
                      key={t}
                      onClick={() => setSelectedTimeRange(t)}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${selectedTimeRange === t ? 'bg-cream text-primary shadow-lg' : 'hover:bg-white/5 text-rose'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 flex items-end gap-4 sm:gap-6 w-full pt-10 min-h-40">
                {[
                  { label: 'UP', value: upMonitors, color: '#10b981', total: monitors.length },
                  { label: 'DEGRADED', value: degradedMonitors, color: '#f59e0b', total: monitors.length },
                  { label: 'DOWN', value: downMonitors, color: '#ef4444', total: monitors.length },
                ].map((item) => {
                  const percentage = monitors.length > 0 ? (item.value / monitors.length) * 100 : 0;
                  return (
                    <div key={item.label} className="flex-1 group/bar relative h-full flex flex-col justify-end">
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-36 p-3 bg-dark rounded-2xl shadow-2xl opacity-0 group-hover/bar:opacity-100 translate-y-2 group-hover/bar:translate-y-0 transition-all duration-300 pointer-events-none z-50 border border-white/10 backdrop-blur-md">
                        <p className="text-xs font-bold text-rose mb-2 border-b border-white/10 pb-2">{item.label}</p>
                        <div className="space-y-1">
                          <div className="flex justify-between"><span className="text-[10px] text-white/50">Count</span><span className="text-xs font-bold text-cream">{item.value}</span></div>
                          <div className="flex justify-between"><span className="text-[10px] text-white/50">Pct</span><span className="text-xs font-bold text-rose">{percentage.toFixed(1)}%</span></div>
                        </div>
                      </div>
                      <div
                        className="w-full rounded-t-xl transition-all duration-500 hover:opacity-80 cursor-pointer"
                        style={{ height: `${Math.max(percentage, 5)}%`, backgroundColor: item.color }}
                      />
                      <p className="text-center text-xs font-bold mt-3">{item.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Active Incidents */}
          <div className="chart-section bg-[#3E2522] border border-white/5 p-6 sm:p-8 rounded-4xl shadow-xl space-y-6 opacity-0 relative overflow-hidden">
            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: `radial-gradient(#DFB6B2 1px, transparent 1px)`, backgroundSize: '24px 24px' }}></div>
            <h2 className="text-xl font-bold text-cream relative z-10">Active Incidents</h2>
            <div className="space-y-4 relative z-10 max-h-64 overflow-y-auto">
              {incidentsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader className="animate-spin text-cream" size={24} />
                </div>
              ) : openIncidents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Activity size={32} className="text-green-400 mb-2" />
                  <p className="text-cream font-medium">All systems operational</p>
                  <p className="text-rose text-sm opacity-70">No active incidents</p>
                </div>
              ) : (
                openIncidents.slice(0, 5).map((incident, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer border border-transparent hover:border-white/10 group">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                      <AlertCircle size={20} className="text-red-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-cream truncate">{incident.type}</p>
                      <p className="text-xs text-rose font-medium truncate opacity-70">{incident.monitorName}</p>
                    </div>
                    <span className="text-[10px] font-bold text-rose uppercase shrink-0 opacity-60">
                      {incident.endTime
                        ? `${Math.max(1, Math.round((new Date(incident.endTime).getTime() - new Date(incident.startTime).getTime()) / 1000 / 60))}m`
                        : 'Active'}
                    </span>
                  </div>
                ))
              )}
            </div>
            <Link to="/dashboard/incidents" className="w-full py-3 sm:py-4 rounded-2xl bg-cream text-primary font-bold text-sm hover:bg-white transition-all active:scale-[0.98] relative z-10 shadow-lg shadow-black/20 inline-block text-center">
              View All Incidents
            </Link>
          </div>
        </div>

        {/* Real-time Status Table */}
        <RealTimeStatus monitors={monitors} fetchMonitors={fetchMonitors} loading={monitorsLoading} />
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
