import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const MetricCard = ({ label, value, icon: Icon, color, bg }) => (
  <div className="stat-card opacity-0 bg-[#3E2522] p-7 rounded-[2.5rem] border border-white/10 shadow-2xl group hover:scale-[1.02] transition-all duration-500">
    <div className="flex items-center justify-between mb-6">
      <div className={`p-4 rounded-2xl ${bg} ${color} shadow-lg backdrop-blur-md`}>
        <Icon size={24} />
      </div>
      <ArrowUpRight size={20} className="text-white/20 group-hover:text-rose transition-colors" />
    </div>
    <p className="text-rose/40 text-[10px] font-black uppercase tracking-[0.2em] mb-2">{label}</p>
    <p className="text-4xl font-black text-cream tracking-tighter">{value}</p>
  </div>
);

export default MetricCard;
