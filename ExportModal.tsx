import React, { useState } from 'react';
import { X, Download, FileText, Check, Copy, Code } from 'lucide-react';
import { UserProfile, CareerRoadmap } from '../types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  activeRoadmap?: CareerRoadmap;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  profile,
  activeRoadmap
}) => {
  const [format, setFormat] = useState<'markdown' | 'json'>('markdown');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const generateMarkdown = () => {
    let md = `# 🎓 Career Guidance Profile & Action Roadmap\n\n`;
    md += `*Generated on ${new Date().toLocaleDateString()} by CareerGuide AI*\n\n`;
    md += `## 👤 Student Background\n`;
    md += `- **Academic Stage**: ${profile.academicStage || 'Not specified'}\n`;
    md += `- **Interests**: ${profile.interests.join(', ') || 'None specified'}\n`;
    md += `- **Current Skills**: ${profile.currentSkills.join(', ') || 'None specified'}\n`;
    md += `- **Weekly Study Time**: ${profile.constraints?.timeCommitment || 'Flexible'}\n`;
    md += `- **Budget**: ${profile.constraints?.budget || 'Free/Low-cost'}\n\n`;

    if (activeRoadmap) {
      md += `## 🗺️ Career Roadmap: ${activeRoadmap.careerPath}\n`;
      md += `**Target Timeframe**: ${activeRoadmap.timeframe}\n\n`;
      md += `> ${activeRoadmap.summary}\n\n`;

      activeRoadmap.phases.forEach((phase, idx) => {
        md += `### ${phase.phase} (${phase.weekOrMonth})\n`;
        md += `**Focus**: ${phase.focus}\n\n`;
        md += `#### Action Items:\n`;
        phase.actionItems.forEach(item => {
          md += `- [ ] ${item}\n`;
        });
        md += `\n**Key Skills to Acquire**: \`${phase.skillsToAcquire.join('`, `')}\`\n\n`;
        md += `**Recommended Courses**:\n`;
        phase.recommendedCourses.forEach(c => {
          md += `- ${c}\n`;
        });
        if (phase.portfolioProject) {
          md += `\n**🎯 Milestone Capstone Project**: **${phase.portfolioProject.title}**\n`;
          md += `${phase.portfolioProject.description}\n`;
          md += `*Deliverable*: ${phase.portfolioProject.deliverable}\n`;
        }
        md += `\n---\n\n`;
      });

      if (activeRoadmap.tipsForSuccess) {
        md += `### 💡 Success Strategies:\n`;
        activeRoadmap.tipsForSuccess.forEach(tip => {
          md += `- ${tip}\n`;
        });
      }
    }

    return md;
  };

  const generateJSON = () => {
    return JSON.stringify(
      {
        exportedAt: new Date().toISOString(),
        userProfile: profile,
        roadmap: activeRoadmap || null
      },
      null,
      2
    );
  };

  const exportContent = format === 'markdown' ? generateMarkdown() : generateJSON();

  const handleCopy = () => {
    navigator.clipboard.writeText(exportContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const filename = `career-roadmap-${(activeRoadmap?.careerPath || 'profile').toLowerCase().replace(/[^a-z0-9]/g, '-')}.${format === 'markdown' ? 'md' : 'json'}`;
    const blob = new Blob([exportContent], { type: format === 'markdown' ? 'text/markdown' : 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 animate-fade-in text-xs">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Export Career Plan & Roadmap</h3>
              <p className="text-slate-400 text-[11px]">Save your personalized guidance report</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Format Selector */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFormat('markdown')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-semibold transition ${
                format === 'markdown'
                  ? 'bg-blue-600/30 border-blue-500 text-blue-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Markdown (.md)</span>
            </button>

            <button
              onClick={() => setFormat('json')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-semibold transition ${
                format === 'json'
                  ? 'bg-blue-600/30 border-blue-500 text-blue-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>JSON (.json)</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold shadow-md transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File</span>
            </button>
          </div>
        </div>

        {/* Preview text area */}
        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 max-h-80 overflow-y-auto whitespace-pre-wrap leading-relaxed">
          {exportContent}
        </div>
      </div>
    </div>
  );
};
