import React, { useRef, useEffect } from 'react';
import DashboardLayout from '../../dashboard/components/DashboardLayout';
import { useIncident } from '../../incident/hooks/useIncident';
import { useMonitor } from '../../monitors/hooks/useMonitor';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  ExternalLink,
  ChevronRight,
  Info,
  RefreshCw,
  ShieldAlert,
  Loader
} from 'lucide-react';
import toast from 'react-hot-toast';

const AlertsPage = () => {
  const { incidents, activeIncidents, loading, fetchAllIncidents, resolveIncident } = useIncident();
  const { monitors, fetchMonitors } = useMonitor();
  const pageRef = useRef(null);

  useEffect(() => {
    fetchMonitors();
    fetchAllIncidents();
  }, []);

  const getStatusInfo = (type, resolved) => {
    if (resolved) return { color: 'text-emerald-500', bg: 'bg-emerald-500/10', icon: CheckCircle, label: 'Resolved' };
    if (type === 'DOWN') return { color: 'text-red-500', bg: 'bg-red-500/10', icon: ShieldAlert, label: 'Service Down' };
    return { color: 'text-amber-500', bg: 'bg-amber-500/10', icon: AlertTriangle, label: 'Degraded' };
  };

  const getMonitorUrl = (monitorId) => {
    const monitor = monitors.find(m => m._id === monitorId);
    return monitor?.url || '#';
  };

  const handleResolve = async (incidentId) => {
    try {
      await resolveIncident(incidentId);
      toast.success('Incident marked as resolved');
    } catch {
      toast.error('Failed to resolve incident');
    }
  };

  const displayedIncidents = incidents.length > 0 ? incidents : activeIncidents;

  return (
    <DashboardLayout pageRef={pageRef}>
      <div className="max-w-5xl mx-auto space-y-8 sm:space-y-10">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-start sm:items-end gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-black text-dark tracking-tight flex items-center gap-4">
              Alert Center
              {activeIncidents.length > 0 && (
                <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              )}
            </h1>
            <p className="text-accent font-semibold opacity-70 text-sm">
              Comprehensive history of all service interruptions and incidents.
            </p>
          </div>
          <button
            onClick={fetchAllIncidents}
            className="p-3 rounded-2xl bg-white border border-rose/30 text-secondary hover:bg-cream transition-all shadow-sm flex-shrink-0"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* Incidents */}
        <div className="space-y-4">
          {loading && displayedIncidents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <Loader className="w-12 h-12 animate-spin text-secondary" />
              <p className="text-accent font-bold animate-pulse">Loading incidents...</p>
            </div>
          ) : displayedIncidents.length === 0 ? (
            <div className="bg-white border border-rose/20 rounded-3xl sm:rounded-4xl p-12 sm:p-20 text-center space-y-4 shadow-xl shadow-black/5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-cream rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <CheckCircle size={36} className="text-emerald-500" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-dark">System All Clear</h2>
              <p className="text-accent max-w-sm mx-auto text-sm">No incidents or alerts found. All your services are running smoothly.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              <AnimatePresence mode="popLayout">
                {displayedIncidents.map((incident) => {
                  const status = getStatusInfo(incident.type, incident.resolved);
                  const durationMinutes = Math.round(
                    (new Date(incident.endTime || new Date()).getTime() - new Date(incident.startTime).getTime()) / 60000
                  );

                  return (
                    <motion.div
                      key={incident._id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-white border border-rose/20 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden relative"
                    >
                      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${status.bg.replace('/10', '')}`} />

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                        <div className="flex gap-4 min-w-0">
                          <div className={`w-12 h-12 rounded-2xl ${status.bg} flex items-center justify-center shrink-0`}>
                            <status.icon size={24} className={status.color} />
                          </div>
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="text-base sm:text-lg font-bold text-dark group-hover:text-secondary transition-colors truncate">
                                {incident.monitorName}
                              </h3>
                              <a
                                href={getMonitorUrl(incident.monitorId)}
                                target="_blank"
                                rel="noreferrer"
                                className="text-accent/30 hover:text-secondary flex-shrink-0"
                              >
                                <ExternalLink size={13} />
                              </a>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-widest">
                              <span className={status.color}>{status.label}</span>
                              <span className="text-rose/30">•</span>
                              <span className="text-accent/60 flex items-center gap-1">
                                <Clock size={11} /> {new Date(incident.startTime).toLocaleString()}
                              </span>
                              <span className="text-accent/60">Duration: {durationMinutes}m</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 flex-shrink-0">
                          {!incident.resolved && (
                            <button
                              onClick={() => handleResolve(incident._id)}
                              className="px-4 sm:px-6 py-2.5 rounded-xl bg-secondary text-cream text-xs font-bold hover:bg-primary transition-all active:scale-95 shadow-lg shadow-secondary/10"
                            >
                              Mark Resolved
                            </button>
                          )}
                          <div className="p-2 rounded-xl bg-cream/50 text-accent group-hover:bg-secondary group-hover:text-cream transition-all">
                            <ChevronRight size={18} />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center gap-6 py-10 opacity-30">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-dark/20" />
          <div className="flex items-center gap-3 text-xs font-black text-dark uppercase tracking-[0.2em]">
            <Info size={16} /> Incident Retention: 7 Days
          </div>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-dark/20" />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AlertsPage;
