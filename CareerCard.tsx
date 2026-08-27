import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Briefcase, 
  ChevronRight, 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  Bookmark, 
  BookmarkCheck, 
  HelpCircle,
  Award
} from 'lucide-react';
import { CareerPath } from '../types';

interface CareerCardProps {
  career: CareerPath;
  isSelected?: boolean;
  isSaved?: boolean;
  onSelect?: (careerTitle: string) => void;
  onAssessGap?: (careerTitle: string) => void;
  onGenerateRoadmap?: (careerTitle: string) => void;
  onToggleSave?: (careerTitle: string) => void;
}

const domainColors: Record<string, { badge: string; border: string }> = {
  'Data & AI': { badge: 'bg-purple-900/50 text-purple-300 border-purple-700/50', border: 'hover:border-purple-500/50' },
  'Tech': { badge: 'bg-blue-900/50 text-blue-300 border-blue-700/50', border: 'hover:border-blue-500/50' },
  'Healthcare & Science': { badge: 'bg-emerald-900/50 text-emerald-300 border-emerald-700/50', border: 'hover:border-emerald-500/50' },
  'Design & Creative': { badge: 'bg-pink-900/50 text-pink-300 border-pink-700/50', border: 'hover:border-pink-500/50' },
  'Business & Finance': { badge: 'bg-amber-900/50 text-amber-300 border-amber-700/50', border: 'hover:border-amber-500/50' },
  'Engineering': { badge: 'bg-cyan-900/50 text-cyan-300 border-cyan-700/50', border: 'hover:border-cyan-500/50' }
};

export const CareerCard: React.FC<CareerCardProps> = ({
  career,
  isSelected,
  isSaved = false,
  onSelect,
  onAssessGap,
  onGenerateRoadmap,
  onToggleSave
}) => {
  const [showSalaryDetail, setShowSalaryDetail] = useState(false);

  const styling = domainColors[career.domain] || {
    badge: 'bg-blue-900/50 text-blue-300 border-blue-700/50',
    border: 'hover:border-blue-500/50'
  };

  return (
    <div
      className={`rounded-2xl border p-4 transition-all duration-200 bg-slate-800/80 backdrop-blur ${
        isSelected
          ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-lg shadow-blue-500/10'
          : 'border-slate-700/70 hover:bg-slate-800 ' + styling.border
      }`}
    >
      {/* Header Domain & Title */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className={`inline-block px-2.5 py-0.5 text-[10px] font-semibold rounded-full border ${styling.badge}`}>
              {career.domain}
            </span>

            <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/60 flex items-center gap-1">
              <Award className="w-2.5 h-2.5" /> High Placement Rate
            </span>
          </div>

          <h4 className="text-base font-bold text-white tracking-tight">
            {career.title}
          </h4>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {onToggleSave && (
            <button
              onClick={() => onToggleSave(career.title)}
              className={`p-1.5 rounded-lg border transition ${
                isSaved
                  ? 'bg-amber-950/80 border-amber-600 text-amber-300'
                  : 'bg-slate-900/60 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
              title={isSaved ? 'Saved to bookmarks' : 'Bookmark this career'}
            >
              {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            </button>
          )}

          {isSelected && (
            <span className="flex items-center gap-1 text-xs font-semibold text-blue-400 bg-blue-950/70 px-2 py-1 rounded-full border border-blue-800">
              <CheckCircle2 className="w-3.5 h-3.5" /> Active Target
            </span>
          )}
        </div>
      </div>

      <p className="text-xs text-slate-300 mb-3 leading-relaxed">
        {career.description}
      </p>

      {/* Highlights Metrics: Salary & Growth */}
      <div className="grid grid-cols-2 gap-2 mb-3 bg-slate-900/70 p-2.5 rounded-xl border border-slate-800 text-xs">
        <div 
          onClick={() => setShowSalaryDetail(!showSalaryDetail)}
          className="flex items-center gap-2 text-slate-300 cursor-pointer hover:opacity-90 transition select-none"
          title="Click to view compensation spectrum"
        >
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
            <DollarSign className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-medium">Median Salary</div>
            <div className="font-bold text-white text-xs">{career.medianSalary}</div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-300">
          <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/30">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-medium">Market Growth</div>
            <div className="font-bold text-white text-xs truncate max-w-[120px]">{career.growthRate}</div>
          </div>
        </div>
      </div>

      {/* Core Skills Badges */}
      <div className="mb-3">
        <div className="text-[11px] font-medium text-slate-400 mb-1.5 flex items-center gap-1">
          <Briefcase className="w-3 h-3 text-slate-400" /> Core Skills Required:
        </div>
        <div className="flex flex-wrap gap-1">
          {career.coreSkills.slice(0, 5).map((skill, idx) => (
            <span
              key={idx}
              className="text-[11px] px-2 py-0.5 rounded-md bg-slate-900/90 text-slate-300 border border-slate-700/60 font-mono"
            >
              {skill}
            </span>
          ))}
          {career.coreSkills.length > 5 && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900/50 text-slate-400">
              +{career.coreSkills.length - 5} more
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-2.5 border-t border-slate-700/50 flex flex-wrap items-center gap-2">
        {onAssessGap && (
          <button
            onClick={() => onAssessGap(career.title)}
            className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 flex items-center justify-center gap-1.5 transition active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Assess Skill Gap</span>
          </button>
        )}

        {onGenerateRoadmap && (
          <button
            onClick={() => onGenerateRoadmap(career.title)}
            className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white flex items-center justify-center gap-1.5 transition shadow-sm active:scale-95"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Build Roadmap</span>
          </button>
        )}
      </div>
    </div>
  );
};
