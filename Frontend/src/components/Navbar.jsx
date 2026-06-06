import React, { useState } from 'react';
import { Search, Bell, User, ChevronDown, Menu, X } from 'lucide-react';
import { useAuth } from '../features/auth/hooks/useAuth';

const Navbar = ({ onMenuClick }) => {
  const { user } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="h-16 sm:h-20 w-full flex items-center justify-between px-4 sm:px-8 bg-cream/50 backdrop-blur-xl border-b border-rose/30 sticky top-0 z-40">
      {/* Left: Hamburger (mobile) + Search */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Mobile hamburger — only visible on mobile */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl text-accent hover:text-primary hover:bg-white/50 transition-colors flex-shrink-0"
          aria-label="Open sidebar"
        >
          <Menu size={22} />
        </button>

        {/* Search — hidden on very small screens, shown on sm+ */}
        <div className={`relative flex-1 max-w-xs sm:max-w-md ${searchOpen ? 'flex' : 'hidden sm:flex'}`}>
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-accent">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Search monitors, incidents..."
            className="w-full bg-white/50 border border-rose text-dark rounded-full py-2 sm:py-2.5 pl-12 pr-4 outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/5 transition-all text-sm font-medium"
          />
        </div>

        {/* Mobile search toggle */}
        <button
          onClick={() => setSearchOpen(v => !v)}
          className="sm:hidden p-2 rounded-xl text-accent hover:text-primary hover:bg-white/50 transition-colors flex-shrink-0"
          aria-label="Toggle search"
        >
          {searchOpen ? <X size={20} /> : <Search size={20} />}
        </button>
      </div>

      {/* Right: Bell + User */}
      <div className="flex items-center gap-3 sm:gap-6 flex-shrink-0">
        <button className="relative p-2 text-accent hover:text-primary transition-colors group">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full border-2 border-cream"></span>
        </button>

        <div className="flex items-center gap-2 sm:gap-3 sm:pl-6 sm:border-l sm:border-rose/50 cursor-pointer group">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-secondary to-primary flex items-center justify-center border-2 border-white shadow-md flex-shrink-0">
            <span className="text-xs font-bold text-cream">{user?.username?.[0]?.toUpperCase() || 'U'}</span>
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-bold text-primary">{user?.username || 'User'}</p>
            <p className="text-[10px] font-bold text-accent uppercase tracking-wider">Premium Plan</p>
          </div>
          <ChevronDown size={16} className="hidden sm:block text-accent group-hover:translate-y-0.5 transition-transform" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
