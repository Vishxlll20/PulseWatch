import React from 'react';
import { Search, Bell, User, ChevronDown } from 'lucide-react';
import { useAuth } from '../../auth/hooks/useAuth';

const Navbar = () => {
  const { user } = useAuth();
  return (
    <div className="h-20 w-full flex items-center justify-between px-8 bg-cream/50 backdrop-blur-xl border-b border-rose/30 sticky top-0 z-40">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative max-w-md w-full">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-accent">
            <Search size={18} />
          </div>
          <input 
            type="text" 
            placeholder="Search analytics, monitors, incidents..." 
            className="w-full bg-white/50 border border-rose text-dark rounded-full py-2.5 pl-12 pr-4 outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/5 transition-all text-sm font-medium"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2 text-accent hover:text-primary transition-colors group">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full border-2 border-cream"></span>
        </button>
        
        <div className="flex items-center gap-3 pl-6 border-l border-rose/50 cursor-pointer group">
          <div className="w-10 h-10 rounded-full bg-linear-to-tr from-secondary to-primary flex items-center justify-center border-2 border-cream shadow-md">
            <span className="text-xs font-bold text-cream">{user?.username?.[0]?.toUpperCase() || 'U'}</span>
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-bold text-dark">{user?.username || 'User'}</p>
            <p className="text-[10px] font-bold text-accent uppercase tracking-wider">Premium Plan</p>
          </div>
          <ChevronDown size={16} className="text-accent group-hover:translate-y-0.5 transition-transform" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
