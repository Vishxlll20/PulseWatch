import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';

const AvailabilityChart = ({ data }) => (
  <div className="chart-container opacity-0 bg-[#3E2522] p-10 rounded-[2.5rem] border border-white/10 shadow-2xl">
    <div className="space-y-10">
      <div>
        <h3 className="text-2xl font-black text-cream tracking-tight">Availability</h3>
        <p className="text-rose/30 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">7-Day performance cycle</p>
      </div>

      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis 
              dataKey="day" 
              stroke="#DFB6B220" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              tick={{ fill: '#DFB6B240', fontWeight: 800 }}
              dy={10}
            />
            <Tooltip 
              cursor={{ fill: 'rgba(255,255,255,0.03)' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-dark/95 backdrop-blur-2xl border border-white/10 p-4 rounded-2xl shadow-3xl">
                      <p className="text-cream font-black text-sm">{payload[0].value}% Uptime</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="percentage" radius={[12, 12, 12, 12]} barSize={32}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.percentage === 100 ? '#DFB6B2' : '#854F6C'} 
                  fillOpacity={0.8}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="pt-6 border-t border-white/5">
        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em]">
          <span className="text-rose/30">Network Status</span>
          <span className="text-emerald-400 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]"></div>
            Optimal
          </span>
        </div>
      </div>
    </div>
  </div>
);

export default AvailabilityChart;
