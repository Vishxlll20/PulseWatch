import React, { useEffect, useRef } from 'react';
import DashboardLayout from '../../dashboard/components/DashboardLayout';
import MonitorCard from '../components/MonitorCard';
import LogsModal from '../../dashboard/components/LogsModal';
import { useMonitor } from '../hooks/useMonitor';
import { Plus, Search, AlertCircle, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import toast from 'react-hot-toast';

const MonitorsPage = () => {
  const { monitors, loading, error, fetchMonitors, deleteMonitor } = useMonitor();
  const pageRef = useRef(null);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [showLogsModal, setShowLogsModal] = React.useState(false);
  const [selectedLogMonitor, setSelectedLogMonitor] = React.useState(null);

  useEffect(() => {
    fetchMonitors();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to('.monitor-card', {
        opacity: 1,
        y: 0,
        stagger: 0.05,
        duration: 0.6,
        ease: 'power2.out',
        delay: 0.2
      });
      gsap.from('.header-animate', {
        opacity: 0,
        x: -20,
        duration: 0.8,
        ease: 'power3.out'
      });
    }, pageRef);

    return () => ctx.revert();
  }, [monitors.length]);

  const filteredMonitors = monitors.filter(m =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (monitorId) => {
    if (window.confirm('Are you sure you want to delete this monitor?')) {
      try {
        await deleteMonitor(monitorId);
        toast.success('Monitor deleted successfully');
      } catch {
        toast.error('Failed to delete monitor');
      }
    }
  };

  return (
    <DashboardLayout pageRef={pageRef}>
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-start sm:items-end header-animate gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#190019] tracking-tight">Monitors</h1>
            <p className="text-accent font-medium text-sm">Manage and monitor your services and endpoints</p>
          </div>
          <button
            onClick={() => navigate('/dashboard/monitors/new')}
            className="flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-[#522B5B] to-[#2B124C] text-white rounded-2xl font-bold hover:shadow-lg transition-all active:scale-95 text-sm"
          >
            <Plus size={18} />
            New Monitor
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-accent" size={20} />
          <input
            type="text"
            placeholder="Search monitors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-rose/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
          />
        </div>

        {/* Error State */}
        {error && (
          <div className="flex items-center gap-4 p-5 bg-red-50 border border-red-200 rounded-2xl text-red-900">
            <AlertCircle size={24} className="text-red-500 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm">{error}</p>
              <button onClick={fetchMonitors} className="text-red-600 underline text-sm hover:text-red-700">
                Try again
              </button>
            </div>
          </div>
        )}

        {/* Loading / Empty / Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center space-y-4">
              <Loader className="animate-spin mx-auto text-accent" size={32} />
              <p className="text-accent font-medium">Loading monitors...</p>
            </div>
          </div>
        ) : filteredMonitors.length === 0 ? (
          <div className="text-center py-16 space-y-4">
            <AlertCircle size={48} className="mx-auto text-accent opacity-50" />
            <div>
              <p className="text-xl font-bold text-[#190019]">No monitors found</p>
              <p className="text-accent font-medium text-sm mt-1">
                {searchTerm ? 'Try adjusting your search' : 'Create your first monitor to get started'}
              </p>
            </div>
            {!searchTerm && (
              <button
                onClick={() => navigate('/dashboard/monitors/new')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#522B5B] to-[#2B124C] text-white rounded-2xl font-bold hover:shadow-lg transition-all"
              >
                <Plus size={20} />
                Create Monitor
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {filteredMonitors.map((monitor) => (
              <MonitorCard
                key={monitor._id}
                monitor={monitor}
                onDelete={handleDelete}
                onShowLogs={(id) => {
                  setSelectedLogMonitor(id);
                  setShowLogsModal(true);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {showLogsModal && selectedLogMonitor && (
        <LogsModal
          monitorId={selectedLogMonitor}
          onClose={() => {
            setShowLogsModal(false);
            setSelectedLogMonitor(null);
          }}
        />
      )}
    </DashboardLayout>
  );
};

export default MonitorsPage;
