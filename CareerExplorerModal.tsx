import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Search, 
  Filter, 
  X, 
  DollarSign, 
  TrendingUp, 
  Briefcase, 
  Sparkles, 
  ArrowRight, 
  Check, 
  Layers, 
  Scale, 
  ChevronRight, 
  Bookmark, 
  BookmarkCheck 
} from 'lucide-react';
import { CareerPath } from '../types';
import { fetchCareers } from '../services/api';

interface CareerExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCareerToChat: (careerTitle: string) => void;
  onAssessGap: (careerTitle: string) => void;
  onGenerateRoadmap: (careerTitle: string) => void;
  savedCareers: string[];
  onToggleSaveCareer: (careerTitle: string) => void;
  onOpenCompare: (selectedCareers: CareerPath[]) => void;
}

const domains = ['All Domains', 'Data & AI', 'Tech', 'Healthcare & Science', 'Design & Creative', 'Business & Finance', 'Engineering'];

export const CareerExplorerModal: React.FC<CareerExplorerModalProps> = ({
  isOpen,
  onClose,
  onSelectCareerToChat,
  onAssessGap,
  onGenerateRoadmap,
  savedCareers,
  onToggleSaveCareer,
  onOpenCompare
}) => {
  const [careers, setCareers] = useState<CareerPath[]>([]);
  const [selectedDomain, setSelectedDomain] = useState('All Domains');
  const [searchQuery, setSearchQuery] = useState('');
  const [compareList, setCompareList] = useState<CareerPath[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetchCareers()
        .then(setCareers)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredCareers = careers.filter(c => {
    const matchesDomain = selectedDomain === 'All Domains' || c.domain.toLowerCase() === selectedDomain.toLowerCase();
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery = !q || 
      c.title.toLowerCase().includes(q) || 
      c.description.toLowerCase().includes(q) || 
      c.coreSkills.some(s => s.toLowerCase().includes(q)) ||
      c.domain.toLowerCase().includes(q);
    return matchesDomain && matchesQuery;
  });

  const toggleCompare = (career: CareerPath) => {
    if (compareList.some(c => c.id === career.id)) {
      setCompareList(prev => prev.filter(c => c.id !== career.id));
    } else {
      if (compareList.length >= 3) {
        alert('You can compare up to 3 careers simultaneously.');
        return;
      }
      setCompareList(prev => [...prev, career]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-6 overflow-hidden">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-6xl w-full h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-fade-in text-xs">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-900/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                Career Pathways Directory
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800">
                  {careers.length} Verified Careers
                </span>
              </h2>
              <p className="text-slate-400 text-xs">
                Explore market compensation, core skill prerequisites, and demand outlooks
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {compareList.length >= 2 && (
              <button
                onClick={() => {
                  onOpenCompare(compareList);
                  onClose();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold shadow-md transition animate-pulse"
              >
                <Scale className="w-3.5 h-3.5" />
                <span>Compare Selected ({compareList.length})</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="p-3 sm:p-4 bg-slate-950/70 border-b border-slate-800 flex flex-col md:flex-row items-center gap-3 shrink-0">
          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search careers, skills (e.g. Python, Figma, AI)..."
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Domain tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-1 md:pb-0 scrollbar-none">
            {domains.map(d => (
              <button
                key={d}
                onClick={() => setSelectedDomain(d)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  selectedDomain === d
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 border border-slate-700/60'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Careers Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {loading ? (
            <div className="h-40 flex items-center justify-center text-slate-400 gap-2">
              <span className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></span>
              <span>Loading career directory...</span>
            </div>
          ) : filteredCareers.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <p className="text-sm font-semibold">No career pathways match your query.</p>
              <p className="text-xs text-slate-500 mt-1">Try searching for a different skill or select another domain.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCareers.map(career => {
                const isCompared = compareList.some(c => c.id === career.id);
                const isSaved = savedCareers.includes(career.title);

                return (
                  <div
                    key={career.id}
                    className="rounded-2xl border border-slate-700/80 bg-slate-800/70 hover:bg-slate-800 transition-all duration-200 p-4 flex flex-col justify-between group relative overflow-hidden"
                  >
                    <div>
                      {/* Top badges & actions */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-950/80 text-blue-300 border border-blue-800">
                          {career.domain}
                        </span>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => onToggleSaveCareer(career.title)}
                            className={`p-1 rounded-lg transition ${
                              isSaved ? 'text-amber-400 hover:text-amber-300' : 'text-slate-500 hover:text-slate-300'
                            }`}
                            title={isSaved ? 'Remove from saved' : 'Bookmark career'}
                          >
                            {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                          </button>

                          <button
                            onClick={() => toggleCompare(career)}
                            className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold border transition ${
                              isCompared
                                ? 'bg-purple-950/80 border-purple-500 text-purple-300'
                                : 'bg-slate-900/80 border-slate-700 text-slate-400 hover:text-slate-200'
                            }`}
                            title="Add to side-by-side comparison"
                          >
                            {isCompared ? '✓ Compare' : '+ Compare'}
                          </button>
                        </div>
                      </div>

                      {/* Title & Description */}
                      <h3 className="font-bold text-sm text-white group-hover:text-blue-300 transition-colors mb-1.5">
                        {career.title}
                      </h3>

                      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-3">
                        {career.description}
                      </p>

                      {/* Salary & Growth Metrics */}
                      <div className="grid grid-cols-2 gap-2 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800/80 mb-3">
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <DollarSign className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <div>
                            <div className="text-[9px] text-slate-500 uppercase">Median Salary</div>
                            <div className="font-bold text-white text-[11px]">{career.medianSalary}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 text-slate-300">
                          <TrendingUp className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                          <div>
                            <div className="text-[9px] text-slate-500 uppercase">Growth Rate</div>
                            <div className="font-bold text-white text-[11px] truncate">{career.growthRate}</div>
                          </div>
                        </div>
                      </div>

                      {/* Core Skills */}
                      <div className="mb-3">
                        <div className="text-[10px] font-medium text-slate-400 mb-1 flex items-center gap-1">
                          <Briefcase className="w-3 h-3 text-slate-500" /> Core Skills:
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {career.coreSkills.slice(0, 4).map((sk, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700/60 font-mono"
                            >
                              {sk}
                            </span>
                          ))}
                          {career.coreSkills.length > 4 && (
                            <span className="text-[9px] px-1 py-0.5 rounded text-slate-500">
                              +{career.coreSkills.length - 4}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="pt-2 border-t border-slate-700/50 flex items-center gap-1.5 mt-auto">
                      <button
                        onClick={() => {
                          onSelectCareerToChat(career.title);
                          onClose();
                        }}
                        className="flex-1 py-1.5 px-2 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 font-semibold transition text-center"
                      >
                        Ask Agent
                      </button>

                      <button
                        onClick={() => {
                          onAssessGap(career.title);
                          onClose();
                        }}
                        className="flex-1 py-1.5 px-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold shadow-sm transition text-center"
                      >
                        Assess Gap
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
