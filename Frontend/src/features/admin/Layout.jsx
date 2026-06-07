import { NavLink, Outlet, useNavigate } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import authService from "../auth/service/authService";
import { useAuth } from "../auth/hooks/useAuth";

const navItems = [
  {
    section: "Admin",
    links: [
      { label: "Monitors", path: "/admin/monitors", icon: "◈" },
      { label: "Users", path: "/admin/users", icon: "👥" }
    ],
  },
];

const Layout = () => {
  const sidebarRef = useRef(null);
  const navigate = useNavigate();
  const { logoutUser } = useAuth();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Auth check & token verification
  useEffect(() => {
    const checkAuth = async () => {
      // Direct cookie check (if cookie is not httpOnly)
      const hasCookieToken = document.cookie.split(';').some(c => c.trim().startsWith('token='));
      
      // We primarily rely on the API response since the token might be httpOnly
      try {
        const isAdmin = await authService.isAdmin();
        if (!isAdmin && !hasCookieToken) {
          navigate('/login', { replace: true });
          return;
        }
      } catch (error) {
        navigate('/login', { replace: true });
        return;
      }
      setIsLoading(false);
    };
    
    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    await logoutUser();
    navigate('/login', { replace: true });
  };

  // animation
  useEffect(() => {
    if (isLoading) return;

    let mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      gsap.from(sidebarRef.current, {
        x: -40,
        opacity: 0,
        duration: 0.5,
      });
    });

    return () => mm.revert();
  }, [isLoading]);

  //  FIX: reset mobile state on resize (NO reload issue)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // prevent scroll when sidebar open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "auto";
  }, [mobileOpen]);

  const toggleCollapse = () => setCollapsed(!collapsed);

  return (
    <div className="flex h-screen bg-cream text-stone-800 overflow-hidden">
      {/* Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 bg-black/40 z-20 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`
          fixed top-0 left-0 z-30 h-full bg-[#140b06]
          transform transition-all duration-300
          overflow-hidden

          w-[240px]

          ${collapsed ? "lg:w-[72px]" : "lg:w-[240px]"}

          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-white/10">
          {!collapsed && (
            <p className="text-cream text-lg font-semibold">MonitorIQ</p>
          )}

          <div className="flex items-center gap-2">
            {/* Desktop collapse */}
            <button
              onClick={toggleCollapse}
              className="hidden lg:block text-white"
            >
              ⇄
            </button>

            {/* Mobile close */}
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden text-white text-xl"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Nav */}
        <nav className="p-3">
          {isLoading ? (
            <p className="text-white/50 text-sm">Loading...</p>
          ) : (
            <>
              {navItems.map((group) => (
                <div key={group.section}>
                  {!collapsed && (
                    <p className="text-white/40 text-xs mb-2 px-2">
                      {group.section}
                    </p>
                  )}

                  {group.links.map((link) => (
                    <NavLink
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileOpen(false)}
                    >
                      {({ isActive }) => (
                        <div
                          className={`
                            mb-2 rounded-lg flex items-center py-2
                            ${collapsed ? "justify-center" : "gap-3 px-3"}
                            ${
                              isActive
                                ? "bg-white/20 text-white"
                                : "text-white/60 hover:bg-white/10"
                            }
                          `}
                        >
                          <span className="text-lg">{link.icon}</span>

                          {!collapsed && (
                            <span className="text-sm">{link.label}</span>
                          )}
                        </div>
                      )}
                    </NavLink>
                  ))}
                </div>
              ))}
              
              <div className="mt-4 pt-4 border-t border-white/10">
                <button
                  onClick={handleLogout}
                  className={`
                    w-full rounded-lg flex items-center py-2 text-white/60 hover:bg-red-500/10 hover:text-red-400 transition-colors
                    ${collapsed ? "justify-center" : "gap-3 px-3"}
                  `}
                >
                  <span className="text-lg">🚪</span>
                  {!collapsed && <span className="text-sm font-medium">Logout</span>}
                </button>
              </div>
            </>
          )}
        </nav>
      </aside>

      {/* Main */}
      <div
        className={`
          flex-1 flex flex-col transition-all duration-300
          ${collapsed ? "lg:ml-[72px]" : "lg:ml-[240px]"}
        `}
      >
        {/* Topbar */}
        <div className="lg:hidden flex items-center p-4 bg-[#140b06] text-white">
          <button onClick={() => setMobileOpen(true)}>☰</button>
          <p className="ml-3 font-semibold">MonitorIQ</p>
        </div>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
