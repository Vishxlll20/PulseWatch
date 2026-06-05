import React, { useEffect, useRef, useState } from 'react';
import DashboardLayout from '../../dashboard/components/DashboardLayout';
import { useAnalytics } from '../hooks/useAnalytics';
import { useMonitor } from '../../monitors/hooks/useMonitor';
import gsap from 'gsap';
import {
  AlertCircle,
  Zap,
  ShieldCheck,
  ZapOff,
  Loader,
  TrendingUp
} from 'lucide-react';

import MetricCard from '../components/MetricCard';
import LatencyChart from '../components/LatencyChart';
import AvailabilityChart from '../components/AvailabilityChart';
import AIInsightCard from '../components/AIInsightCard';

const AnalyticsPage = () => {
  const { monitors, loading: monitorsLoading, fetchMonitors } = useMonitor();
  const [selectedMonitorId, setSelectedMonitorId] = useState(null);
  const [selectedRange, setSelectedRange] = useState('24h');

  useEffect(() => {
    fetchMonitors();
  }, []);

  useEffect(() => {
    if (monitors.length > 0 && !selectedMonitorId) {
      setSelectedMonitorId(monitors[0]._id);
    }
  }, [monitors, selectedMonitorId]);

  const { data, loading: analyticsLoading, fetchAnalytics } = useAnalytics(selectedMonitorId, selectedRange, false);
  const pageRef = useRef(null);

  useEffect(() => {
    if (selectedMonitorId) {
      fetchAnalytics(selectedMonitorId, selectedRange);
    }
  }, [selectedMonitorId, selectedRange]);

  useEffect(() => {
    if (!analyticsLoading && data) {
      const ctx = gsap.context(() => {
        gsap.set('.stat-card, .chart-container, .ai-card', { opacity: 0, y: 30 });
        gsap.to('.stat-card', { opacity: 1, y: 0, stagger: 0.1, duration: 0.8, ease: 'power3.out', delay: 0.2 });
        gsap.to('.chart-container', { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.6 });
        gsap.to('.ai-card', { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 1 });
      }, pageRef);
      return () => ctx.revert();
    }
  }, [analyticsLoading, data]);

  const isLoading = analyticsLoading || monitorsLoading;

  if (isLoading && !data) {
    return (
      <DashboardLayout pageRef={pageRef}>
        <div className="flex items-center justify-center h-full min-h-[60vh]">
          <div className="text-center space-y-4">
            <Loader className="animate-spin mx-auto text-accent" size={32} />
            <p className="text-accent font-medium">Loading analytics...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!data) {
    return (
      <DashboardLayout pageRef={pageRef}>
        <div className="flex items-center justify-center h-full min-h-[60vh]">
          <div className="text-center space-y-4">
            <AlertCircle className="mx-auto text-red-500" size={32} />
            <p className="text-dark font-bold">Failed to load analytics</p>
            <p className="text-accent text-sm">Please try selecting a different monitor</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const metrics = [
    { label: 'Uptime', value: `${parseFloat(data.uptime || 99.9).toFixed(2)}%`, icon: ShieldCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
    { label: 'Avg Latency', value: `${Math.round(data.avgResponseTime || 0)}ms`, icon: Zap, color: 'text-amber-400', bg: 'bg-amber-500/20' },
    { label: 'Error Rate', value: `${parseFloat(data.errorRate || 0).toFixed(2)}%`, icon: ZapOff, color: 'text-rose', bg: 'bg-rose/20' },
    { label: 'Downtime', value: `${Math.round(data.totalDowntimeMinutes || 0)}m`, icon: AlertCircle, color: 'text-primary', bg: 'bg-primary/20' },
  ];

  const selectedMonitor = monitors.find(m => m._id === selectedMonitorId);
  const aiInsights = data ? {
    confidence: Math.max(55, Math.min(99, Math.round(100 - (Number(data.errorRate || 0) * 2) - (Number(data.totalDowntimeMinutes || 0) / 2)))),
    summary: `${selectedMonitor?.name || 'This monitor'} is running at ${Number(data.uptime || 0).toFixed(2)}% uptime with an average response of ${Math.round(Number(data.avgResponseTime || 0))}ms over the selected range.`,
    recommendation: Number(data.errorRate || 0) > 1
      ? 'Investigate the highest-latency buckets and compare them with recent deploys or traffic spikes.'
      : 'Keep the current configuration and continue watching for short latency spikes.',
  } : null;

  return (
    <DashboardLayout pageRef={pageRef}>
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 pb-20">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-3xl sm:text-4xl font-black text-dark tracking-tight flex flex-wrap items-center gap-3">
            Analytics
            <span className="text-xs font-bold px-4 py-1.5 bg-secondary/10 text-secondary rounded-full border border-secondary/20 uppercase tracking-widest backdrop-blur-sm">
              <TrendingUp size={12} className="inline mr-1" />
              Live
            </span>
          </h1>
          <p className="text-accent/60 font-semibold text-sm">Detailed performance metrics and insights</p>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-xs font-bold text-accent/60 uppercase tracking-wider mb-2">Select Monitor</label>
              <select
                value={selectedMonitorId || ''}
                onChange={e => setSelectedMonitorId(e.target.value)}
                disabled={monitorsLoading}
                className="w-full px-4 py-3 bg-white border border-rose/30 rounded-xl text-dark font-medium focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all"
              >
                {monitors.map(monitor => (
                  <option key={monitor._id} value={monitor._id}>{monitor.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-accent/60 uppercase tracking-wider mb-2">Time Range</label>
              <div className="flex gap-2 p-1 bg-white border border-rose/30 rounded-xl">
                {['24h', '7d', '30d'].map(range => (
                  <button
                    key={range}
                    onClick={() => setSelectedRange(range)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${selectedRange === range ? 'bg-secondary text-white shadow-lg' : 'text-accent hover:text-dark'}`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {selectedMonitor && (
            <div className="p-4 bg-gradient-to-r from-secondary/5 to-accent/5 border border-secondary/10 rounded-xl">
              <p className="text-sm text-dark font-semibold">
                <span className="text-secondary">Monitoring:</span> {selectedMonitor.name}
              </p>
              <p className="text-xs text-accent/60 font-medium">{selectedMonitor.url}</p>
            </div>
          )}
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {metrics.map((stat, i) => (
            <MetricCard key={i} {...stat} />
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {data.graph && data.graph.length > 0 ? (
            <>
              <LatencyChart data={data.graph} />
              <AvailabilityChart data={data.graph} />
            </>
          ) : (
            <div className="lg:col-span-3 p-8 bg-white/50 border border-rose/30 rounded-2xl text-center">
              <p className="text-accent font-medium">No data available for this period</p>
            </div>
          )}
        </div>

        {/* AI Insights */}
        {aiInsights && <AIInsightCard insights={aiInsights} />}
      </div>
    </DashboardLayout>
  );
};

export default AnalyticsPage;
