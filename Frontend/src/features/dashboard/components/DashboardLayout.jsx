import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Navbar from '../../../components/Navbar';

/**
 * Shared layout wrapper for all dashboard pages.
 * Manages the mobile sidebar open/close state in one place
 * so individual pages don't need to handle it themselves.
 */
const DashboardLayout = ({ children, pageRef }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar on route change or window resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  return (
    <div ref={pageRef} className="flex h-screen bg-cream overflow-hidden font-['Inter',sans-serif]">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Decorative background blobs */}
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-rose/20 rounded-full blur-[120px] pointer-events-none z-0" />
        <div className="absolute bottom-[-10%] left-[10%] w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px] pointer-events-none z-0" />

        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative z-10 hide-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
