import React, { useState } from 'react';
import { 
  User, 
  GraduationCap, 
  Sparkles, 
  Code2, 
  Clock, 
  DollarSign, 
  Target, 
  Plus, 
  X, 
  Check, 
  Edit3, 
  Layers, 
  Briefcase, 
  Compass, 
  BookOpen, 
  Bookmark, 
  CheckCircle2, 
  Award,
  Zap
} from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileSidebarProps {
  profile: UserProfile;
  savedCareers?: string[];
  onUpdateProfile: (updated: UserProfile) => void;
  onExploreCareer?: (career: string) => void;
  onRemoveSavedCareer?: (career: string) => void;
  onCloseMobile?: () => void;
  className?: string;
}

export const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
  profile,
  savedCareers = [],
  onUpdateProfile,
  onExploreCareer,
  onRemoveSavedCareer,
  onCloseMobile,
  className = ''
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');

  // Editable state
  const [draftStage, setDraftStage] = useState(profile.academicStage || '');
  const [draftTime, setDraftTime] = useState(profile.constraints?.timeCommitment || '');
  const [draftBudget, setDraftBudget] = useState(profile.constraints?.budget || '');

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    const updated = {
      ...profile,
      currentSkills: Array.from(new Set([...profile.currentSkills, newSkill.trim()]))
    };
    onUpdateProfile(updated);
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const updated = {
      ...profile,
      currentSkills: profile.currentSkills.filter(s => s !== skillToRemove)
    };
    onUpdateProfile(updated);
  };

  const handleAddInterest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInterest.trim()) return;
    const updated = {
      ...profile,
      interests: Array.from(new Set([...profile.interests, newInterest.trim()]))
    };
    onUpdateProfile(updated);
    setNewInterest('');
  };

  const handleRemoveInterest = (interestToRemove: string) => {
    const updated = {
      ...profile,
      interests: profile.interests.filter(i => i !== interestToRemove)
    };
    onUpdateProfile(updated);
  };

  const handleSaveGeneral = () => {
    const updated: UserProfile = {
      ...profile,
      academicStage: draftStage.trim() || undefined,
      constraints: {
        ...profile.constraints,
        timeCommitment: draftTime.trim() || undefined,
        budget: draftBudget.trim() || undefined
      }
    };
    onUpdateProfile(updated);
    setIsEditing(false);
  };

  return (
    <aside className={`bg-slate-900 border-l border-slate-800 flex flex-col h-full overflow-y-auto ${className}`}>
      {/* Sidebar Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/95 sticky top-0 z-10 backdrop-blur flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
            <User className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-bold text-sm text-white">Live Student Profile</h2>
            <div className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Autonomous Memory Sync</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              if (isEditing) handleSaveGeneral();
              else {
                setDraftStage(profile.academicStage || '');
                setDraftTime(profile.constraints?.timeCommitment || '');
                setDraftBudget(profile.constraints?.budget || '');
                setIsEditing(true);
              }
            }}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition text-xs flex items-center gap-1 border border-slate-700/60"
            title={isEditing ? 'Save profile changes' : 'Edit profile attributes'}
          >
            {isEditing ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Edit3 className="w-3.5 h-3.5 text-blue-400" />}
            <span className="font-medium">{isEditing ? 'Done' : 'Edit'}</span>
          </button>

          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Close drawer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="p-4 space-y-5 text-xs">
        {/* Section: Academic Stage & Constraints */}
        <div className="bg-slate-800/60 rounded-2xl p-3.5 border border-slate-700/70 space-y-3 shadow-inner">
          {isEditing ? (
            <div className="space-y-2.5">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                  Academic Stage / Background:
                </label>
                <input
                  type="text"
                  value={draftStage}
                  onChange={e => setDraftStage(e.target.value)}
                  placeholder="e.g. 2nd Year CS Undergrad"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                  Weekly Study Hours:
                </label>
                <input
                  type="text"
                  value={draftTime}
                  onChange={e => setDraftTime(e.target.value)}
                  placeholder="e.g. 10-15 hrs/week"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                  Budget / Cost Preference:
                </label>
                <input
                  type="text"
                  value={draftBudget}
                  onChange={e => setDraftBudget(e.target.value)}
                  placeholder="e.g. Free only / < $200"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2.5">
              <div className="flex items-start gap-2 text-slate-300">
                <div className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5 border border-blue-500/30">
                  <GraduationCap className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-medium">Academic Stage</div>
                  <div className="font-semibold text-white">
                    {profile.academicStage || <span className="text-slate-500 italic">Discovered in conversation...</span>}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-700/50">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Clock className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <div>
                    <div className="text-[10px] text-slate-400">Study Time</div>
                    <div className="font-semibold text-white truncate text-[11px]">
                      {profile.constraints?.timeCommitment || 'Flexible'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-slate-300">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <div>
                    <div className="text-[10px] text-slate-400">Budget</div>
                    <div className="font-semibold text-white truncate text-[11px]">
                      {profile.constraints?.budget || 'Free/Low-cost'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section: Interests & Passions */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-slate-200 font-bold text-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Interests & Domains ({profile.interests.length})</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-2">
            {profile.interests.map((interest, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-950/40 text-amber-200 border border-amber-700/50 text-[11px] font-medium"
              >
                <span>{interest}</span>
                <button
                  onClick={() => handleRemoveInterest(interest)}
                  className="hover:text-rose-400 p-0.5 rounded"
                  title="Remove"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            ))}

            {profile.interests.length === 0 && (
              <span className="text-slate-500 italic text-[11px]">
                Mention topics you enjoy (AI, visual design, healthcare, etc.)
              </span>
            )}
          </div>

          {/* Add Interest form */}
          <form onSubmit={handleAddInterest} className="flex gap-1.5 mt-1.5">
            <input
              type="text"
              value={newInterest}
              onChange={e => setNewInterest(e.target.value)}
              placeholder="+ Add interest tag..."
              className="flex-1 bg-slate-950/80 border border-slate-700 rounded-xl px-2.5 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              className="p-1 rounded-xl bg-amber-600/30 hover:bg-amber-600/50 text-amber-200 border border-amber-500/40 transition"
              title="Add"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Section: Current Skills Inventory */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-slate-200 font-bold text-xs">
              <Code2 className="w-3.5 h-3.5 text-blue-400" />
              <span>Current Skills ({profile.currentSkills.length})</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-2">
            {profile.currentSkills.map((skill, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-blue-950/50 text-blue-200 border border-blue-700/50 text-[11px] font-mono"
              >
                <span>{skill}</span>
                <button
                  onClick={() => handleRemoveSkill(skill)}
                  className="hover:text-rose-400 p-0.5 rounded"
                  title="Remove skill"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            ))}

            {profile.currentSkills.length === 0 && (
              <span className="text-slate-500 italic text-[11px]">
                No skills logged yet (mention Python, Figma, SQL, Excel, etc.)
              </span>
            )}
          </div>

          {/* Add Skill Form */}
          <form onSubmit={handleAddSkill} className="flex gap-1.5 mt-1.5">
            <input
              type="text"
              value={newSkill}
              onChange={e => setNewSkill(e.target.value)}
              placeholder="+ Add known skill..."
              className="flex-1 bg-slate-950/80 border border-slate-700 rounded-xl px-2.5 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-400"
            />
            <button
              type="submit"
              className="p-1 rounded-xl bg-blue-600/30 hover:bg-blue-600/50 text-blue-200 border border-blue-500/40 transition"
              title="Add"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Section: Bookmarked / Saved Careers */}
        {savedCareers.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 text-slate-200 font-bold text-xs mb-2">
              <Bookmark className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
              <span>Saved Career Bookmarks ({savedCareers.length})</span>
            </div>

            <div className="space-y-1.5">
              {savedCareers.map((careerTitle, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between group hover:border-amber-500/40 transition"
                >
                  <span className="font-semibold text-slate-200 truncate">{careerTitle}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onExploreCareer && onExploreCareer(careerTitle)}
                      className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-600/20 hover:bg-amber-600/40 text-amber-300 border border-amber-500/30 transition"
                    >
                      Explore
                    </button>
                    {onRemoveSavedCareer && (
                      <button
                        onClick={() => onRemoveSavedCareer(careerTitle)}
                        className="p-1 text-slate-500 hover:text-rose-400 transition"
                        title="Remove bookmark"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section: Candidate Target Career Paths */}
        {profile.targetCareers && profile.targetCareers.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 text-slate-200 font-bold text-xs mb-2">
              <Target className="w-3.5 h-3.5 text-purple-400" />
              <span>Target Pathways ({profile.targetCareers.length})</span>
            </div>

            <div className="space-y-1.5">
              {profile.targetCareers.map((career, idx) => (
                <div
                  key={idx}
                  onClick={() => onExploreCareer && onExploreCareer(career)}
                  className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                    profile.selectedCareer === career
                      ? 'bg-purple-950/50 border-purple-500 text-purple-200 font-semibold shadow-md shadow-purple-950/40'
                      : 'bg-slate-800/40 border-slate-700 hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <span className="truncate">{career}</span>
                  <span className="text-[10px] text-purple-400 underline shrink-0 font-medium">Gap Analysis</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
