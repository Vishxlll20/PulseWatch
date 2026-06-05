import React from 'react';
import { Sparkles } from 'lucide-react';

const AIInsightCard = ({ insights }) => (
  <div className="ai-card opacity-0 relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#3E2522] p-10 group/ai shadow-2xl">
    <div className="absolute top-0 right-0 p-12 opacity-5 group-hover/ai:opacity-10 transition-opacity">
      <Sparkles size={160} className="text-rose" />
    </div>
    <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center md:items-start">
      <div className="space-y-8 flex-1 text-center md:text-left">
        <div className="flex flex-col md:flex-row items-center gap-5">
          <h3 className="text-3xl font-black text-cream tracking-tighter">AI Stability Engine</h3>
          <div className="px-4 py-1.5 bg-rose/10 text-rose border border-rose/20 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-md">
            {insights.confidence}% Precision
          </div>
        </div>
        <p className="text-rose/60 text-xl leading-relaxed font-semibold max-w-4xl italic">
          "{insights.summary}"
        </p>
        <div className="pt-6 flex flex-col sm:flex-row items-center gap-6">
          <span className="text-cream/50 font-black uppercase tracking-[0.3em] text-[10px] border border-white/20 px-4 py-2 rounded-xl shrink-0">
            Recommendation
          </span>
          <span className="text-rose font-black text-2xl tracking-tight decoration-primary/50 decoration-4 underline underline-offset-12">
            {insights.recommendation}
          </span>
        </div>
      </div>
    </div>
  </div>
);

export default AIInsightCard;
