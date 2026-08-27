import React, { useState } from 'react';
import { MapPin, Calendar, CheckSquare, Square, FolderGit2, BookOpen, Lightbulb, ChevronDown, ChevronUp, Share2, Download } from 'lucide-react';
import { CareerRoadmap, RoadmapMilestone } from '../types';

interface RoadmapViewProps {
  roadmap: CareerRoadmap;
  onExportRoadmap?: (roadmap: CareerRoadmap) => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({ roadmap, onExportRoadmap }) => {
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({});
  const [expandedPhases, setExpandedPhases] = useState<Record<number, boolean>>({
    0: true,
    1: true,
    2: true
  });

  const toggleCheck = (id: string) => {
    setCompletedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const togglePhase = (idx: number) => {
    setExpandedPhases(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  return (
    <div className="rounded-xl border border-indigo-500/40 bg-gradient-to-b from-slate-800/95 to-slate-900/95 backdrop-blur p-4 my-3 text-xs shadow-xl shadow-indigo-950/20">
      {/* Roadmap Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-700/70">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-300">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">
              Action Plan: {roadmap.careerPath}
            </h3>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span className="flex items-center gap-1 text-indigo-300 font-medium">
                <Calendar className="w-3 h-3" /> {roadmap.timeframe}
              </span>
              <span>•</span>
              <span>{roadmap.phases.length} Structured Phases</span>
            </div>
          </div>
        </div>

        {onExportRoadmap && (
          <button
            onClick={() => onExportRoadmap(roadmap)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 transition active:scale-95 self-start sm:self-auto"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Roadmap</span>
          </button>
        )}
      </div>

      <p className="text-slate-300 text-xs my-2.5 leading-relaxed bg-slate-900/40 p-2.5 rounded-lg border border-slate-800">
        {roadmap.summary}
      </p>

      {/* Phased Milestones Accordion / List */}
      <div className="space-y-3 my-3">
        {roadmap.phases.map((phase: RoadmapMilestone, pIdx: number) => {
          const isExpanded = expandedPhases[pIdx] ?? true;

          return (
            <div
              key={pIdx}
              className="rounded-xl border border-slate-700/80 bg-slate-900/70 overflow-hidden"
            >
              {/* Phase Header */}
              <button
                onClick={() => togglePhase(pIdx)}
                className="w-full flex items-center justify-between p-3 bg-slate-800/70 hover:bg-slate-800 transition text-left"
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 flex items-center justify-center font-bold text-[10px]">
                    {pIdx + 1}
                  </span>
                  <div>
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">
                      {phase.weekOrMonth}
                    </span>
                    <span className="font-semibold text-white text-xs">
                      {phase.phase}
                    </span>
                  </div>
                </div>

                <div className="text-slate-400">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {/* Phase Body */}
              {isExpanded && (
                <div className="p-3 border-t border-slate-800 space-y-3 text-xs">
                  {/* Focus Goal */}
                  <div className="text-slate-300 italic text-[11px] bg-slate-950/40 p-2 rounded border border-slate-800/60">
                    🎯 <strong className="text-slate-200 not-italic">Core Goal:</strong> {phase.focus}
                  </div>

                  {/* Action Items Checklist */}
                  <div>
                    <div className="text-[11px] font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                      Weekly Action Items:
                    </div>
                    <div className="space-y-1.5">
                      {phase.actionItems.map((item, aIdx) => {
                        const checkKey = `p${pIdx}-a${aIdx}`;
                        const isDone = completedItems[checkKey] || false;

                        return (
                          <div
                            key={aIdx}
                            onClick={() => toggleCheck(checkKey)}
                            className={`flex items-start gap-2 p-1.5 rounded cursor-pointer transition select-none ${
                              isDone ? 'bg-emerald-950/20 text-slate-400 line-through' : 'hover:bg-slate-800/60 text-slate-200'
                            }`}
                          >
                            <span className="mt-0.5 shrink-0 text-indigo-400">
                              {isDone ? (
                                <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Square className="w-3.5 h-3.5 text-slate-500" />
                              )}
                            </span>
                            <span className="text-[11px]">{item}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Skills to Acquire & Recommended Courses */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
                    {/* Skills */}
                    <div className="bg-slate-950/50 p-2 rounded border border-slate-800">
                      <div className="text-[10px] font-semibold text-slate-400 mb-1">
                        Skills to Acquire:
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {phase.skillsToAcquire.map((sk, idx) => (
                          <span
                            key={idx}
                            className="px-1.5 py-0.5 rounded bg-indigo-950/60 text-indigo-300 border border-indigo-800/50 text-[10px] font-mono"
                          >
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Courses */}
                    <div className="bg-slate-950/50 p-2 rounded border border-slate-800">
                      <div className="text-[10px] font-semibold text-slate-400 mb-1 flex items-center gap-1">
                        <BookOpen className="w-3 h-3 text-amber-400" /> Suggested Courses:
                      </div>
                      <ul className="space-y-0.5 text-[10px] text-slate-300">
                        {phase.recommendedCourses.map((cName, idx) => (
                          <li key={idx} className="truncate" title={cName}>
                            • {cName}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Portfolio Milestone Project */}
                  {phase.portfolioProject && (
                    <div className="rounded-lg bg-gradient-to-r from-blue-950/40 to-indigo-950/40 border border-blue-800/40 p-2.5 text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-blue-300 mb-1 text-[11px]">
                        <FolderGit2 className="w-3.5 h-3.5 text-blue-400" />
                        <span>Milestone Project: {phase.portfolioProject.title}</span>
                      </div>
                      <p className="text-slate-300 text-[11px] mb-1">
                        {phase.portfolioProject.description}
                      </p>
                      <div className="text-[10px] text-slate-400">
                        <strong className="text-slate-300">Deliverable:</strong> {phase.portfolioProject.deliverable}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Tips for Success */}
      {roadmap.tipsForSuccess && (
        <div className="rounded-lg bg-amber-950/20 border border-amber-800/30 p-2.5 mt-2">
          <div className="flex items-center gap-1.5 font-bold text-amber-300 mb-1 text-[11px]">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>Success Strategies:</span>
          </div>
          <ul className="space-y-1 text-slate-300 text-[11px]">
            {roadmap.tipsForSuccess.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-amber-400 font-bold">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
