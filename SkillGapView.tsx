import React from 'react';
import { Award, CheckCircle2, AlertTriangle, Clock, ArrowRight, BookOpen, Layers } from 'lucide-react';
import { SkillGapAssessment } from '../types';

interface SkillGapViewProps {
  assessment: SkillGapAssessment;
  onSearchCourses?: (careerTitle: string, skills: string[]) => void;
  onGenerateRoadmap?: (careerTitle: string) => void;
}

export const SkillGapView: React.FC<SkillGapViewProps> = ({
  assessment,
  onSearchCourses,
  onGenerateRoadmap
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-emerald-400 border-emerald-500 bg-emerald-950/40';
    if (score >= 45) return 'text-amber-400 border-amber-500 bg-amber-950/40';
    return 'text-blue-400 border-blue-500 bg-blue-950/40';
  };

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800/90 backdrop-blur p-4 text-xs my-3 shadow-md">
      {/* Header Assessment Title & Score */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-700/60">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-400" />
            <h4 className="font-bold text-sm text-white">
              Skill Gap Assessment: {assessment.careerTitle}
            </h4>
          </div>
          <p className="text-slate-400 text-[11px] mt-0.5">
            Transition Difficulty: <span className="font-semibold text-slate-200">{assessment.difficultyToTransition}</span> • Est. Time: <span className="font-semibold text-slate-200">{assessment.estimatedTimeToBridge}</span>
          </p>
        </div>

        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${getScoreColor(assessment.overallMatchScore)} shrink-0`}>
          <div className="text-right">
            <div className="text-[10px] uppercase font-bold text-slate-400">Match Score</div>
            <div className="text-lg font-extrabold tracking-tight leading-none">
              {assessment.overallMatchScore}%
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Mastered vs Missing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-3">
        {/* Mastered / Current Strengths */}
        <div className="rounded-lg bg-emerald-950/20 border border-emerald-800/30 p-3">
          <div className="flex items-center gap-1.5 text-emerald-300 font-semibold mb-2 text-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Mastered & Matched Skills ({assessment.masteredSkills.length})</span>
          </div>

          {assessment.masteredSkills.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {assessment.masteredSkills.map((sk, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-emerald-900/40 text-emerald-200 border border-emerald-700/50 font-mono text-[11px]"
                >
                  ✓ {sk}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 italic text-[11px]">
              Ready to learn from the ground up! No prerequisite skills required to begin.
            </p>
          )}
        </div>

        {/* Missing Critical Skills */}
        <div className="rounded-lg bg-rose-950/20 border border-rose-800/30 p-3">
          <div className="flex items-center gap-1.5 text-rose-300 font-semibold mb-2 text-xs">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span>Critical Priority Skills to Build ({assessment.missingCriticalSkills.length})</span>
          </div>

          {assessment.missingCriticalSkills.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {assessment.missingCriticalSkills.map((sk, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-rose-900/40 text-rose-200 border border-rose-700/50 font-mono text-[11px]"
                >
                  + {sk}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-emerald-400 font-medium text-[11px]">
              All core requirements covered! Ready for advanced electives and portfolio building.
            </p>
          )}
        </div>
      </div>

      {/* Key Actionable Recommendations */}
      {assessment.keyRecommendations && assessment.keyRecommendations.length > 0 && (
        <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 mb-3">
          <div className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider mb-1.5">
            Key Recommendations:
          </div>
          <ul className="space-y-1 text-slate-300 text-[11px]">
            {assessment.keyRecommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-blue-400 font-bold">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-700/40">
        {onSearchCourses && (
          <button
            onClick={() => onSearchCourses(assessment.careerTitle, assessment.missingCriticalSkills)}
            className="flex-1 py-1.5 px-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium flex items-center justify-center gap-1.5 transition active:scale-95 text-xs"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>Find Courses for Gaps</span>
          </button>
        )}

        {onGenerateRoadmap && (
          <button
            onClick={() => onGenerateRoadmap(assessment.careerTitle)}
            className="flex-1 py-1.5 px-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold flex items-center justify-center gap-1.5 transition shadow-sm active:scale-95 text-xs"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Generate Learning Roadmap</span>
          </button>
        )}
      </div>
    </div>
  );
};
