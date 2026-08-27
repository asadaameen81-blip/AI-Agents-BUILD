import React from 'react';
import { 
  Compass, 
  Sparkles, 
  Plus, 
  Settings, 
  Download, 
  Trash2, 
  Cpu, 
  Search, 
  Scale, 
  User, 
  Layers 
} from 'lucide-react';

interface HeaderProps {
  onNewSession: () => void;
  onOpenSettings: () => void;
  onOpenExport: () => void;
  onClearSession: () => void;
  onOpenExplorer: () => void;
  onOpenQuiz: () => void;
  onToggleMobileSidebar: () => void;
  sessionTitle: string;
  provider: string;
  hasApiKey: boolean;
  savedCareersCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  onNewSession,
  onOpenSettings,
  onOpenExport,
  onClearSession,
  onOpenExplorer,
  onOpenQuiz,
  onToggleMobileSidebar,
  sessionTitle,
  provider,
  hasApiKey,
  savedCareersCount = 0
}) => {
  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur px-3 sm:px-6 flex items-center justify-between z-20 shrink-0">
      {/* Brand & Logo */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-teal-400 flex items-center justify-center shadow-lg shadow-blue-500/20 ring-1 ring-blue-400/40 shrink-0">
          <Compass className="w-5 h-5 text-white animate-spin-slow" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-sm sm:text-base tracking-tight text-white flex items-center gap-1.5">
              CareerGuide <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300 font-extrabold text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-blue-950/80 border border-blue-800/60">AGENTIC AI</span>
            </h1>
          </div>
          <p className="text-[11px] text-slate-400 hidden lg:block">
            Multi-step autonomous career discovery, skill gap analysis & roadmaps
          </p>
        </div>
      </div>

      {/* Center Nav Tools */}
      <div className="hidden md:flex items-center gap-1.5 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
        <button
          onClick={onOpenExplorer}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/80 transition"
        >
          <Search className="w-3.5 h-3.5 text-blue-400" />
          <span>Explore Careers</span>
        </button>

        <button
          onClick={onOpenQuiz}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 transition shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Career Matchmaker Quiz</span>
        </button>
      </div>

      {/* Right action controls */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Quick Quiz on Mobile */}
        <button
          onClick={onOpenQuiz}
          className="md:hidden p-1.5 rounded-lg bg-blue-600/20 text-blue-300 border border-blue-500/30"
          title="Career Quiz"
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
        </button>

        {/* Explore on Mobile */}
        <button
          onClick={onOpenExplorer}
          className="md:hidden p-1.5 rounded-lg text-slate-300 hover:bg-slate-800 border border-slate-700"
          title="Explore Careers"
        >
          <Search className="w-4 h-4 text-blue-400" />
        </button>

        {/* Provider badge */}
        <button
          onClick={onOpenSettings}
          className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-slate-300 transition-colors"
          title="Configure AI Provider & API Keys"
        >
          <Cpu className="w-3.5 h-3.5 text-blue-400" />
          <span>{provider === 'claude' ? (hasApiKey ? 'Claude 3.7 Sonnet' : 'Claude (Key required)') : 'Autonomous Engine'}</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        </button>

        {/* Export Roadmap Button */}
        <button
          onClick={onOpenExport}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          title="Export Career Roadmap & Profile"
        >
          <Download className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden sm:inline">Export</span>
        </button>

        {/* New Session Button */}
        <button
          onClick={onNewSession}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-500/20 transition active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Chat</span>
        </button>

        {/* Mobile Profile Toggle */}
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-1.5 rounded-lg text-slate-300 hover:bg-slate-800 border border-slate-700 relative"
          title="Toggle Student Profile"
        >
          <User className="w-4 h-4 text-blue-400" />
          {savedCareersCount > 0 && (
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-500 rounded-full text-[9px] font-bold text-slate-900 flex items-center justify-center">
              {savedCareersCount}
            </span>
          )}
        </button>

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          title="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
