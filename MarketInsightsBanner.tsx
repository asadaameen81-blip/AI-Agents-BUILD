import React, { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, ChevronRight, X, Lightbulb, Zap } from 'lucide-react';

const insights = [
  { icon: <TrendingUp className="w-3.5 h-3.5 text-purple-400" />, text: "🔥 Top Emerging Field: AI Ethics & Governance (+45% YoY growth)" },
  { icon: <Zap className="w-3.5 h-3.5 text-amber-400" />, text: "⚡ High Demand: Machine Learning Engineers command median $145k+ salaries" },
  { icon: <Sparkles className="w-3.5 h-3.5 text-emerald-400" />, text: "🧬 Hybrid Tech: Bioinformatics bridges computational algorithms and genetics" },
  { icon: <Lightbulb className="w-3.5 h-3.5 text-blue-400" />, text: "💡 Career Pro Tip: 2 deployed capstone projects on GitHub double interview rates" }
];

export const MarketInsightsBanner: React.FC<{ onExploreTrending?: (keyword: string) => void }> = ({ onExploreTrending }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % insights.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  if (!isVisible) return null;

  const current = insights[currentIndex];

  return (
    <div className="bg-gradient-to-r from-blue-950/60 via-slate-900/90 to-indigo-950/60 border-b border-slate-800/80 px-4 py-1.5 flex items-center justify-between text-xs text-slate-300 backdrop-blur z-10 transition-all">
      <div className="flex items-center gap-2 overflow-hidden">
        <span className="hidden sm:inline-flex items-center gap-1 font-semibold text-blue-400 text-[11px] bg-blue-950 px-2 py-0.5 rounded-full border border-blue-800 shrink-0">
          <Zap className="w-3 h-3 text-amber-400" /> Market Pulse
        </span>

        <div className="flex items-center gap-2 transition-all duration-300 truncate">
          <span className="shrink-0">{current.icon}</span>
          <span className="truncate text-slate-200 text-xs font-medium">{current.text}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => onExploreTrending && onExploreTrending(current.text.includes('Bioinformatics') ? 'Bioinformatics Specialist' : current.text.includes('Machine Learning') ? 'Machine Learning Engineer' : 'AI')}
          className="hidden md:flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 font-semibold px-2 py-0.5 rounded hover:bg-blue-950/40 transition"
        >
          <span>Explore</span>
          <ChevronRight className="w-3 h-3" />
        </button>

        <button
          onClick={() => setIsVisible(false)}
          className="p-1 text-slate-500 hover:text-slate-300 rounded transition"
          title="Dismiss banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
