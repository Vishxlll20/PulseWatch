import React, { useEffect, useRef, useState } from 'react';
import DashboardLayout from '../../dashboard/components/DashboardLayout';
import { useIncidents } from '../hooks/useIncidents';
import gsap from 'gsap';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Terminal,
  Sparkles,
  ExternalLink,
  Clock,
  AlertCircle,
  CheckCircle2,
  Info,
  Plus,
  Minus
} from 'lucide-react';

const IncidentPage = () => {
  const { incidents, loading, resolveIncident, deleteIncidents } = useIncidents();
  const [expandedId, setExpandedId] = useState(null);
  const pageRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.incident-header', {
        opacity: 0,
        y: -20,
        duration: 0.8,
        ease: 'power3.out'
      });
    }, pageRef);
    return () => ctx.revert();
  }, [loading]);

  const toggleAccordion = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case 'DOWN':
        return { bg: 'bg-red-500/10', text: 'text-red-500', border: 'border-red-500/20', dot: 'bg-red-500', label: 'Failure' };
      case 'DEGRADED':
        return { bg: 'bg-amber-500/10', text: 'text-amber-500', border: 'border-amber-500/20', dot: 'bg-amber-500', label: 'Degraded' };
      case 'recovered':
        return { bg: 'bg-emerald-500/10', text: 'text-emerald-500', border: 'border-emerald-500/20', dot: 'bg-emerald-500', label: 'Recovered' };
      default:
        return { bg: 'bg-slate-500/10', text: 'text-slate-500', border: 'border-slate-500/20', dot: 'bg-slate-500', label: 'Unknown' };
    }
  };

  return (
    <DashboardLayout pageRef={pageRef}>
      <div className="max-w-5xl mx-auto space-y-8 sm:space-y-10">
        {/* Header */}
        <div className="incident-header space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black text-dark tracking-tight flex flex-wrap items-center gap-3">
            Incidents
            {incidents.length > 0 && (
              <span className="text-xs font-bold px-4 py-1.5 bg-red-500/10 text-red-600 rounded-full border border-red-500/20 uppercase tracking-widest animate-pulse backdrop-blur-sm">
                {incidents.length} Active
              </span>
            )}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-accent font-semibold text-sm">
            {incidents.length > 0 ? (
              <span className="flex items-center gap-1.5 text-red-500">
                <AlertCircle size={16} /> {incidents.length} unresolved incident{incidents.length !== 1 ? 's' : ''}
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-emerald-500">
                <CheckCircle2 size={16} /> All services operational ✅
              </span>
            )}
          </div>
        </div>

        {/* Incidents List */}
        <div className="space-y-4 sm:space-y-6 pb-20">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-rose border-t-primary rounded-full animate-spin" />
            </div>
          ) : (
            incidents.map((incident) => {
              const incidentId = incident._id || incident.id;
              const styles = getStatusStyles(incident.status);
              const isExpanded = expandedId === incidentId;

              return (
                <motion.div
                  key={incidentId}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: incidents.indexOf(incident) * 0.1, ease: 'easeOut' }}
                  className={`incident-card relative bg-[#3E2522] rounded-3xl sm:rounded-4xl shadow-2xl border border-white/10 overflow-hidden group transition-all duration-500 ${isExpanded ? 'ring-2 ring-rose/30 ring-offset-4 ring-offset-cream' : ''}`}
                >
                  <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: `radial-gradient(#DFB6B2 0.5px, transparent 0.5px)`, backgroundSize: '32px 32px' }} />

                  {/* Card Header */}
                  <div
                    onClick={() => toggleAccordion(incidentId)}
                    className="relative z-10 p-5 sm:p-8 flex items-start justify-between cursor-pointer select-none gap-4"
                  >
                    <div className="flex gap-4 sm:gap-6 min-w-0">
                      <div className={`mt-1 w-10 h-10 sm:w-12 sm:h-12 rounded-2xl ${styles.bg} ${styles.border} flex items-center justify-center shrink-0 shadow-lg border`}>
                        <div className={`w-2.5 h-2.5 rounded-full ${styles.dot}`} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h2 className="text-lg sm:text-2xl font-bold text-cream tracking-tight group-hover:text-rose transition-colors truncate">
                            {incident.service}
                          </h2>
                          <a
                            href={incident.url}
                            onClick={e => e.stopPropagation()}
                            className="text-rose/40 hover:text-rose transition-colors p-1 flex-shrink-0"
                          >
                            <ExternalLink size={14} />
                          </a>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm font-medium">
                          <span className={`${styles.text} font-bold uppercase tracking-widest text-[10px] px-2.5 py-1 rounded-lg bg-white/5 border ${styles.border}`}>
                            {styles.label}
                          </span>
                          <div className="flex items-center gap-1.5 text-rose/70">
                            <Clock size={12} className="text-rose/50" />
                            {incident.time}
                          </div>
                          <div className="text-rose/70 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5 font-bold text-xs">
                            Ongoing: <span className="text-rose">{incident.duration}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={`p-2.5 sm:p-3 rounded-2xl border transition-all duration-300 flex-shrink-0 ${isExpanded ? 'bg-cream text-primary border-cream' : 'bg-white/5 text-rose border-white/10 group-hover:bg-white/10 group-hover:text-cream'}`}>
                      {isExpanded ? <Minus size={20} /> : <Plus size={20} />}
                    </div>
                  </div>

                  {/* Expandable Content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                      >
                        <div className="px-5 sm:px-8 pb-6 sm:pb-8 space-y-6 sm:space-y-8 border-t border-white/5 pt-6 sm:pt-8 mx-5 sm:mx-8">
                          {/* AI Analysis */}
                          {incident.aiAnalysis && (
                            <motion.div
                              initial={{ y: 20, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: 0.1 }}
                              className="relative overflow-hidden rounded-3xl sm:rounded-4xl border border-accent/20 bg-accent/5 p-5 sm:p-8"
                            >
                              <div className="relative z-10 flex flex-col sm:flex-row gap-5 sm:gap-8">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-accent to-rose flex items-center justify-center shadow-xl shadow-accent/20 shrink-0">
                                  <Sparkles size={24} className="text-cream" />
                                </div>
                                <div className="space-y-4">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <h3 className="text-lg sm:text-xl font-bold text-cream">AI Incident Analysis</h3>
                                    <span className="text-[10px] font-black px-2.5 py-1 bg-cream text-primary rounded-lg uppercase tracking-wider">Beta</span>
                                  </div>
                                  {incident.aiAnalysis.summary && (
                                    <p className="text-rose/80 text-sm sm:text-base leading-relaxed font-medium max-w-2xl">
                                      {incident.aiAnalysis.summary}
                                    </p>
                                  )}
                                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-2 text-sm">
                                    <span className="text-rose font-bold uppercase tracking-widest text-[10px] bg-rose/10 px-2 py-1 rounded w-fit">Recommended action</span>
                                    <span className="text-cream font-medium italic">
                                      {incident.aiAnalysis.recommendation || 'Review recent monitor logs.'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}

                          {/* Actions */}
                          <div className="flex flex-wrap gap-3">
                            {incident.ongoing && (
                              <button
                                onClick={e => { e.stopPropagation(); resolveIncident(incident.id); }}
                                className="px-4 py-2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-xl font-bold text-sm hover:bg-emerald-500/20 transition-colors flex items-center gap-2"
                              >
                                <CheckCircle2 size={16} /> Mark as Resolved
                              </button>
                            )}
                            <button
                              onClick={e => { e.stopPropagation(); deleteIncidents(incident.monitorId); }}
                              className="px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl font-bold text-sm hover:bg-red-500/20 transition-colors flex items-center gap-2"
                            >
                              <AlertCircle size={16} /> Clear Monitor History
                            </button>
                          </div>

                          {/* Logs */}
                          {incident.logs?.length > 0 && (
                            <motion.div
                              initial={{ y: 20, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: 0.2 }}
                              className="space-y-4"
                            >
                              <div className="flex items-center justify-between px-2">
                                <div className="flex items-center gap-3">
                                  <Terminal size={16} className="text-rose/50" />
                                  <h3 className="text-xs font-bold text-rose/50 uppercase tracking-widest">Recent activity logs</h3>
                                </div>
                              </div>
                              <div className="bg-deep/80 backdrop-blur-md rounded-3xl border border-white/10 p-4 sm:p-6 font-mono text-xs overflow-x-auto shadow-inner">
                                <table className="w-full text-left border-separate border-spacing-y-2 min-w-[500px]">
                                  <thead>
                                    <tr className="text-rose/30 text-[10px] uppercase tracking-widest">
                                      <th className="px-2 pb-2 font-black">Timestamp</th>
                                      <th className="px-2 pb-2 font-black">Method</th>
                                      <th className="px-2 pb-2 font-black">Endpoint</th>
                                      <th className="px-2 pb-2 font-black">Status</th>
                                      <th className="px-2 pb-2 font-black hidden sm:table-cell">Message</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {incident.logs.map((log, i) => (
                                      <tr key={i} className="group/log hover:bg-white/5 transition-colors">
                                        <td className="py-2 px-2 text-rose/40 whitespace-nowrap">{log.time}</td>
                                        <td className="py-2 px-2"><span className="text-cream/70 font-bold bg-white/5 px-1.5 py-0.5 rounded">{log.method}</span></td>
                                        <td className="py-2 px-2 text-rose font-medium max-w-[100px] truncate">{log.path}</td>
                                        <td className="py-2 px-2">
                                          <span className={`px-2 py-0.5 rounded-lg font-black ${typeof log.status === 'number' ? 'text-red-400 bg-red-400/10 border border-red-400/20' : 'text-orange-400 bg-orange-400/10 border border-orange-400/20'}`}>
                                            {log.status}
                                          </span>
                                        </td>
                                        <td className="py-2 px-2 text-rose/60 italic hidden sm:table-cell">"{log.message}"</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center gap-6 py-10 opacity-30">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-dark/20" />
          <div className="flex items-center gap-3 text-xs font-black text-dark uppercase tracking-[0.2em]">
            <Info size={16} /> Support Center
          </div>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-dark/20" />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default IncidentPage;
