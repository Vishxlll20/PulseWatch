import React from 'react';
import { TrendingUp } from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-dark/95 backdrop-blur-2xl border border-white/10 p-4 rounded-2xl shadow-3xl">
        <p className="text-rose/50 text-[10px] font-black uppercase tracking-widest mb-1">{label}</p>
        <p className="text-cream font-bold text-lg flex items-center gap-2">
          {payload[0].value} <span className="text-xs font-medium text-rose/50">ms</span>
        </p>
      </div>
    );
  }
  return null;
};

const LatencyChart = ({ data }) => (
  <div className="lg:col-span-2 chart-container opacity-0 bg-[#3E2522] rounded-[2.5rem] border border-white/10 p-10 shadow-2xl relative overflow-hidden">
    <div className="absolute top-0 right-0 p-10 opacity-[0.03]">
      <TrendingUp size={150} className="text-rose" />
    </div>
    <div className="relative z-10 space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-black text-cream tracking-tight">Response Time Trend</h3>
          <p className="text-rose/30 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Global latency stream • 24h</p>
        </div>
        <div className="flex items-center gap-2.5 bg-white/5 px-4 py-2 rounded-2xl border border-white/5 backdrop-blur-md">
          <div className="w-2.5 h-2.5 rounded-full bg-rose animate-pulse shadow-[0_0_10px_rgba(223,182,178,0.5)]"></div>
          <span className="text-[10px] font-black text-rose uppercase tracking-widest">Live</span>
        </div>
      </div>
      
      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#DFB6B2" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#DFB6B2" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
            <XAxis 
              dataKey="time" 
              stroke="#DFB6B220" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              tick={{ fill: '#DFB6B240', fontWeight: 800 }}
              dy={10}
            />
            <YAxis 
              stroke="#DFB6B220" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              tick={{ fill: '#DFB6B240', fontWeight: 800 }}
              dx={-10}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#DFB6B2" 
              strokeWidth={5}
              fillOpacity={1} 
              fill="url(#colorValue)" 
              animationDuration={2500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
);

export default LatencyChart;
