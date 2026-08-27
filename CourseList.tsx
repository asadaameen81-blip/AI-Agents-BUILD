import React from 'react';
import { BookOpen, ExternalLink, Star, Clock, Award, CheckCircle } from 'lucide-react';
import { CourseResource } from '../types';

interface CourseListProps {
  courses: CourseResource[];
  title?: string;
}

export const CourseList: React.FC<CourseListProps> = ({ courses, title }) => {
  if (!courses || courses.length === 0) return null;

  const getCostBadge = (cost: string) => {
    switch (cost) {
      case 'Free':
        return 'bg-emerald-950/60 text-emerald-300 border-emerald-700/50';
      case 'Free to Audit':
        return 'bg-sky-950/60 text-sky-300 border-sky-700/50';
      case 'Certification':
        return 'bg-purple-950/60 text-purple-300 border-purple-700/50';
      default:
        return 'bg-amber-950/60 text-amber-300 border-amber-700/50';
    }
  };

  return (
    <div className="my-3 space-y-2">
      {title && (
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 mb-2">
          <BookOpen className="w-4 h-4 text-amber-400" />
          <span>{title} ({courses.length})</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        {courses.map((course) => (
          <div
            key={course.id}
            className="rounded-xl border border-slate-700/80 bg-slate-800/80 hover:bg-slate-800 p-3 flex flex-col justify-between transition-all group"
          >
            <div>
              {/* Badges: Provider & Cost */}
              <div className="flex items-center justify-between gap-1.5 mb-1.5 text-[10px]">
                <span className="font-semibold text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/60 truncate max-w-[170px]">
                  {course.provider}
                </span>

                <span className={`px-2 py-0.5 rounded border font-medium ${getCostBadge(course.costType)}`}>
                  {course.costType}
                </span>
              </div>

              {/* Title */}
              <h5 className="font-bold text-xs text-white group-hover:text-blue-300 transition-colors line-clamp-2 mb-1.5">
                {course.title}
              </h5>

              {/* Description */}
              <p className="text-[11px] text-slate-300 line-clamp-2 mb-2 leading-relaxed">
                {course.description}
              </p>

              {/* Metrics: Duration & Rating */}
              <div className="flex items-center gap-3 text-[10px] text-slate-400 mb-2">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" /> {course.duration}
                </span>
                <span className="flex items-center gap-1 text-amber-300">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {course.rating}
                </span>
                <span className="px-1.5 py-0.2 bg-slate-900 rounded text-slate-300 border border-slate-800">
                  {course.level}
                </span>
              </div>
            </div>

            {/* Target Skills & Link Button */}
            <div className="pt-2 border-t border-slate-700/50 flex items-center justify-between gap-2 mt-auto">
              <div className="flex flex-wrap gap-1 overflow-hidden max-h-5">
                {course.targetSkills.slice(0, 3).map((sk, idx) => (
                  <span
                    key={idx}
                    className="text-[9px] px-1.5 py-0.5 rounded bg-slate-900/80 text-slate-300 border border-slate-800 font-mono"
                  >
                    {sk}
                  </span>
                ))}
              </div>

              <a
                href={course.url}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 p-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 border border-blue-500/30 transition flex items-center gap-1 text-[10px] font-semibold"
                title="Open Course Resource"
              >
                <span>View</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
