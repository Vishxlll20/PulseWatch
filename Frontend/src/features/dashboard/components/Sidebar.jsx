import React from 'react';
import {
  LayoutDashboard,
  Activity,
  Shield,
  Settings,
  LogOut,
  BarChart3,
  Bell,
  X
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/hooks/useAuth';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logoutUser } = useAuth();

  const handleLogout = async () => {
    await logoutUser();
    navigate('/login');
  };

  const handleLinkClick = () => {
    // Close sidebar on mobile after nav
    if (onClose) onClose();
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
    { icon: Activity, label: 'Monitors', path: '/dashboard/monitors' },
    { icon: Shield, label: 'Incidents', path: '/dashboard/incidents' },
    { icon: Bell, label: 'Alerts', path: '/dashboard/alerts' },
    { icon: BarChart3, label: 'Analytics', path: '/dashboard/analytics' },
  ];

  return (
    <>
      {/* Sidebar panel */}
      <div
        className={`
          fixed top-0 left-0 z-50 h-full w-64
          bg-[#3E2522] text-cream
          flex flex-col p-6 shadow-2xl border-r border-white/5
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto lg:flex lg:flex-shrink-0
        `}
      >
        {/* Header: Logo + mobile close button */}
        <div className="flex items-center justify-between mb-10 px-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cream rounded-xl flex items-center justify-center shadow-lg shadow-black/20">
              <Activity size={24} className="text-primary" />
            </div>
            <span className="text-xl font-bold tracking-tight">PulseWatch</span>
          </div>
          {/* Close button — mobile only */}
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-rose/60 hover:text-cream hover:bg-white/10 transition-colors"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav links */}
        <div className="flex-1 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.label}
                to={item.path}
                onClick={handleLinkClick}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all group ${
                  isActive
                    ? 'bg-cream text-primary font-bold shadow-lg shadow-black/20'
                    : 'hover:bg-cream/10 text-rose'
                }`}
              >
                <item.icon size={20} className={isActive ? 'text-primary' : 'group-hover:text-cream'} />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Bottom actions */}
        <div className="space-y-2 pt-6 border-t border-cream/10">
          <Link
            to="/dashboard/settings"
            onClick={handleLinkClick}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-cream/10 text-rose transition-all group"
          >
            <Settings size={20} className="group-hover:text-cream" />
            <span className="text-sm font-medium">Settings</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-cream/10 text-rose transition-all group"
          >
            <LogOut size={20} className="group-hover:text-cream" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
