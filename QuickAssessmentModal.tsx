import React, { useState } from 'react';
import { Sparkles, X, ArrowRight, ArrowLeft, Check, Compass, Cpu, Palette, HeartPulse, BarChart3, Bot, Clock } from 'lucide-react';

interface QuickAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleteQuiz: (quizSummary: string) => void;
}

interface Question {
  id: number;
  title: string;
  subtitle: string;
  options: { label: string; icon: string; desc: string; value: string }[];
}

const quizQuestions: Question[] = [
  {
    id: 1,
    title: "What domains or topics spark your curiosity the most?",
    subtitle: "Select the area that you would love to spend hours building or learning about.",
    options: [
      { label: "Artificial Intelligence & Algorithms", icon: "🤖", desc: "Machine learning models, neural networks, predictive systems", value: "Artificial Intelligence and Machine Learning" },
      { label: "Design, UI/UX & Creative Tech", icon: "🎨", desc: "User psychology, intuitive mobile/web interfaces, visual design", value: "UI/UX Design and Creative Technology" },
      { label: "Biology, Genetics & Healthcare", icon: "🧬", desc: "Genomics, computational biology, clinical trials, health informatics", value: "Bioinformatics and Healthcare Science" },
      { label: "Software Engineering & Cloud Systems", icon: "💻", desc: "Full-stack apps, DevOps, scalable cloud architecture, backend APIs", value: "Full Stack Software Engineering and Cloud DevOps" },
      { label: "Finance, Markets & Business Strategy", icon: "📈", desc: "Quantitative trading, data-driven marketing, management consulting", value: "Quantitative Finance and Product Strategy" },
      { label: "Cybersecurity & Ethical Defense", icon: "🛡️", desc: "Network security, ethical hacking, incident response, vulnerability triage", value: "Cybersecurity and Network Defense" }
    ]
  },
  {
    id: 2,
    title: "What is your current experience level or academic stage?",
    subtitle: "Helps tailor the roadmap prerequisites and timeframe.",
    options: [
      { label: "High School Student", icon: "🎒", desc: "Exploring future college majors & foundational tech skills", value: "High School Student exploring future pathways" },
      { label: "1st or 2nd Year Undergrad", icon: "🎓", desc: "Building core skills for first internships and research roles", value: "1st/2nd Year Undergrad seeking internships" },
      { label: "Junior / Senior Undergrad", icon: "🏛️", desc: "Preparing for full-time job search and portfolio polishing", value: "Graduating Senior preparing for full-time entry roles" },
      { label: "Career Switcher / Non-Tech", icon: "🔄", desc: "Transitioning from a different field into high-growth tech", value: "Career Switcher looking for efficient transition" }
    ]
  },
  {
    id: 3,
    title: "Which technical or analytical skills do you already have?",
    subtitle: "Select all that apply to calibrate your skill gap baseline.",
    options: [
      { label: "Python & Data Tools (Pandas/SQL)", icon: "🐍", desc: "Basic or intermediate scripting and data manipulation", value: "Python, SQL" },
      { label: "Web Development (HTML/CSS/JS/React)", icon: "🌐", desc: "Front-end components, basic web pages, JavaScript", value: "JavaScript, HTML, CSS, React" },
      { label: "Visual Design & Figma", icon: "✨", desc: "Wireframing, prototypes, UI design principles", value: "Figma, User Research, Wireframing" },
      { label: "Math, Statistics & Excel", icon: "📊", desc: "Linear algebra, probability, data modeling in spreadsheets", value: "Statistics, Probability, Excel" },
      { label: "Complete Beginner", icon: "🌱", desc: "Excited to start from scratch with guided beginner fundamentals", value: "Beginner with no prior coding experience" }
    ]
  },
  {
    id: 4,
    title: "What is your weekly study bandwidth and main goal?",
    subtitle: "We will tailor the roadmap milestone pacing to your schedule.",
    options: [
      { label: "5-10 hours/week (Self-paced)", icon: "⏱️", desc: "Steady progress alongside coursework or full-time job", value: "5-10 hrs/week (Self-paced, low-stress)" },
      { label: "10-20 hours/week (Accelerated)", icon: "🚀", desc: "Fast-track preparation for upcoming hiring cycles", value: "10-20 hrs/week (Accelerated 6-month roadmap)" },
      { label: "20+ hours/week (Immersive)", icon: "⚡", desc: "Full-time intensive learning and portfolio building", value: "20+ hrs/week (Full-time intensive sprint)" }
    ]
  }
];

export const QuickAssessmentModal: React.FC<QuickAssessmentModalProps> = ({
  isOpen,
  onClose,
  onCompleteQuiz
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  if (!isOpen) return null;

  const currentQ = quizQuestions[currentStep];
  const selectedVal = answers[currentQ.id];

  const handleSelectOption = (value: string) => {
    setAnswers(prev => ({ ...prev, [currentQ.id]: value }));
  };

  const handleNext = () => {
    if (currentStep < quizQuestions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Build synthesized agent prompt
      const summary = `Hi! I just completed the Career Matchmaker Discovery Assessment:\n` +
        `- **Curiosity & Interests**: ${answers[1] || 'Artificial Intelligence'}\n` +
        `- **Academic Background**: ${answers[2] || 'College Student'}\n` +
        `- **Current Skills Baseline**: ${answers[3] || 'Basic familiarity'}\n` +
        `- **Study Bandwidth**: ${answers[4] || '10-15 hrs/week'}\n\n` +
        `Please assess my profile, save these attributes, search the top matching career pathways for me, and explain why each fits my background!`;
      onCompleteQuiz(summary);
      onClose();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const progressPercent = Math.round(((currentStep + 1) / quizQuestions.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 animate-fade-in text-xs relative overflow-hidden">
        {/* Top Progress bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-800">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-teal-400 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-blue-950 text-blue-400 font-bold text-[10px] border border-blue-800">
              Question {currentStep + 1} of {quizQuestions.length}
            </span>
            <span className="text-slate-400 text-[11px]">Career Matchmaker Quiz</span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Question Title & Subtitle */}
        <div>
          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
            {currentQ.title}
          </h3>
          <p className="text-slate-400 text-xs mt-1">
            {currentQ.subtitle}
          </p>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[50vh] overflow-y-auto pr-1">
          {currentQ.options.map((opt, idx) => {
            const isSelected = selectedVal === opt.value;

            return (
              <div
                key={idx}
                onClick={() => handleSelectOption(opt.value)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all duration-150 flex items-start gap-3 select-none ${
                  isSelected
                    ? 'bg-blue-950/60 border-blue-500 ring-2 ring-blue-500/30 text-white shadow-md shadow-blue-500/10'
                    : 'bg-slate-800/60 border-slate-700/80 hover:bg-slate-800 hover:border-slate-600 text-slate-300'
                }`}
              >
                <div className="text-xl shrink-0 p-1 bg-slate-900/80 rounded-xl border border-slate-800">
                  {opt.icon}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-xs text-white flex items-center justify-between">
                    <span>{opt.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                    {opt.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>

          <button
            onClick={handleNext}
            disabled={!selectedVal}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1.5 active:scale-95"
          >
            <span>{currentStep === quizQuestions.length - 1 ? 'Launch Agent Guidance' : 'Next Question'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
