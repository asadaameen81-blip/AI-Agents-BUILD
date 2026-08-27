import React from 'react';
import { X, Scale, DollarSign, TrendingUp, Briefcase, GraduationCap, Clock, Sparkles, Layers, ArrowRight } from 'lucide-react';
import { CareerPath } from '../types';

interface CareerCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  careers: CareerPath[];
  onAssessGap: (careerTitle: string) => void;
  onGenerateRoadmap: (careerTitle: string) => void;
}

export const CareerCompareModal: React.FC<CareerCompareModalProps> = ({
  isOpen,
  onClose,
  careers,
  onAssessGap,
  onGenerateRoadmap
}) => {
  if (!isOpen || careers.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-6 overflow-hidden">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-fade-in text-xs">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Side-by-Side Career Comparison
              </h2>
              <p className="text-slate-400 text-xs">
                Comparing {careers.length} career pathways across compensation, skills, and day-to-day focus
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comparison Table / Columns */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className={`grid grid-cols-1 md:grid-cols-${careers.length} gap-4`}>
            {careers.map((career) => (
              <div
                key={career.id}
                className="rounded-2xl border border-slate-700/80 bg-slate-800/80 p-4 space-y-4 flex flex-col justify-between"
              >
                <div>
                  {/* Title & Domain */}
                  <div className="mb-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800">
                      {career.domain}
                    </span>
                    <h3 className="text-base font-extrabold text-white mt-1.5">
                      {career.title}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mb-3">
                    {career.description}
                  </p>

                  {/* Metrics Block */}
                  <div className="space-y-2 bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Median Salary:
                      </span>
                      <span className="font-bold text-emerald-300">{career.medianSalary}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5 text-blue-400" /> Growth Outlook:
                      </span>
                      <span className="font-bold text-blue-300 text-[11px] truncate max-w-[140px]">{career.growthRate}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Demand:
                      </span>
                      <span className="font-bold text-amber-300">{career.marketDemand}</span>
                    </div>
                  </div>

                  {/* Core Skills Required */}
                  <div className="mt-3">
                    <div className="text-[11px] font-semibold text-slate-300 mb-1 flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5 text-slate-400" /> Core Skills:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {career.coreSkills.map((sk, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700/60 font-mono"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Day in the Life */}
                  <div className="mt-3 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 text-[11px] text-slate-300 leading-relaxed">
                    <span className="font-semibold text-indigo-300 block mb-1">A Day in the Life:</span>
                    {career.dayInTheLife}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-slate-700/50 space-y-1.5 mt-auto">
                  <button
                    onClick={() => {
                      onAssessGap(career.title);
                      onClose();
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 font-semibold transition text-center"
                  >
                    Assess Skill Gap
                  </button>

                  <button
                    onClick={() => {
                      onGenerateRoadmap(career.title);
                      onClose();
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold shadow-md transition text-center"
                  >
                    Generate Roadmap
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
