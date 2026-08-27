import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  Loader2, 
  Compass, 
  ArrowRight, 
  Mic, 
  MicOff, 
  Flame, 
  Bot, 
  Zap,
  TrendingUp
} from 'lucide-react';
import { ChatMessage, CareerRoadmap } from '../types';
import { MessageItem } from './MessageItem';

interface ChatContainerProps {
  messages: ChatMessage[];
  isLoading: boolean;
  activeSteps?: any[];
  savedCareers?: string[];
  onSendMessage: (messageText: string) => void;
  onAssessCareerGap: (careerTitle: string) => void;
  onGenerateCareerRoadmap: (careerTitle: string) => void;
  onSearchCourseGaps: (careerTitle: string, skills: string[]) => void;
  onExportRoadmap: (roadmap: CareerRoadmap) => void;
  onToggleSaveCareer?: (careerTitle: string) => void;
}

const domainStarterPrompts = [
  { icon: "🤖", label: "AI & Data Science", prompt: "I'm interested in Machine Learning and Data Science. I know Python and SQL. What are the best career paths and requirements?" },
  { icon: "🧬", label: "Bioinformatics & Health", prompt: "I love biology and want to apply computational algorithms. What roles exist in Bioinformatics or Health Informatics?" },
  { icon: "🎨", label: "UI / UX Design", prompt: "I have an eye for design and user psychology. How can I transition into UI/UX Product Design?" },
  { icon: "💻", label: "Cloud & DevOps", prompt: "What skills do I need to become a Cloud DevOps or Infrastructure Engineer in 2026?" },
  { icon: "🛡️", label: "Cybersecurity", prompt: "I want to get into Cybersecurity analysis and threat response. Where should a beginner start?" },
  { icon: "📈", label: "Quantitative Finance", prompt: "I have strong math and statistics skills. How do I break into Financial Quantitative Analysis or Trading?" }
];

export const ChatContainer: React.FC<ChatContainerProps> = ({
  messages,
  isLoading,
  activeSteps,
  savedCareers = [],
  onSendMessage,
  onAssessCareerGap,
  onGenerateCareerRoadmap,
  onSearchCourseGaps,
  onExportRoadmap,
  onToggleSaveCareer
}) => {
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, activeSteps]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText.trim());
    setInputText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInputResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`;
  };

  const toggleMic = () => {
    if (!isRecording) {
      setIsRecording(true);
      // Simulate quick voice transcript prompt
      setTimeout(() => {
        setInputText("I'm a 2nd year CS student interested in AI and biology. What career paths match my skills?");
        setIsRecording(false);
      }, 1800);
    } else {
      setIsRecording(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 overflow-hidden relative">
      {/* Scrollable Message List */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-6 md:px-8 py-5 space-y-4">
        {/* Welcome Banner if only initial message */}
        {messages.length <= 1 && (
          <div className="max-w-3xl mx-auto my-3 p-5 sm:p-7 rounded-3xl bg-gradient-to-b from-blue-950/40 via-slate-900/70 to-slate-900/50 border border-blue-800/30 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <Compass className="w-48 h-48 text-blue-400" />
            </div>

            <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-teal-400 flex items-center justify-center text-white mb-3 shadow-lg shadow-blue-500/30 ring-1 ring-blue-400/40">
              <Compass className="w-6 h-6 animate-spin-slow" />
            </div>

            <h2 className="text-lg sm:text-2xl font-extrabold text-white tracking-tight mb-2">
              Autonomous AI Career Advisor
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto mb-6 leading-relaxed">
              Experience dynamic, multi-step career discovery. The agent autonomously updates your profile memory, queries verified salary & demand datasets, evaluates skill gaps, and formulates phased learning roadmaps.
            </p>

            {/* Starter Domain Chips */}
            <div className="text-left">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>Explore Popular Career Pathways:</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {domainStarterPrompts.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInputText(item.prompt);
                      onSendMessage(item.prompt);
                    }}
                    className="p-3 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/70 hover:border-blue-500/50 text-left transition group flex items-start gap-2.5 shadow-sm"
                  >
                    <span className="text-xl p-1 bg-slate-900 rounded-xl border border-slate-800 shrink-0">
                      {item.icon}
                    </span>
                    <div className="flex-1">
                      <div className="font-bold text-xs text-white group-hover:text-blue-300 transition-colors flex items-center justify-between">
                        <span>{item.label}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition" />
                      </div>
                      <p className="text-[10px] text-slate-400 line-clamp-2 mt-0.5 leading-snug">
                        {item.prompt}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Message Thread */}
        {messages.map((msg) => (
          <MessageItem
            key={msg.id}
            message={msg}
            onAssessCareerGap={onAssessCareerGap}
            onGenerateCareerRoadmap={onGenerateCareerRoadmap}
            onSearchCourseGaps={onSearchCourseGaps}
            onExportRoadmap={onExportRoadmap}
          />
        ))}

        {/* Active Autonomous Reasoning Step Streamer */}
        {isLoading && (
          <div className="flex items-center gap-3 py-3 px-4 rounded-2xl bg-gradient-to-r from-blue-950/60 to-indigo-950/60 border border-blue-800/50 text-xs text-blue-300 w-fit shadow-lg animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
            <div className="flex flex-col">
              <span className="font-semibold text-white">Agent reasoning in progress...</span>
              <span className="text-[10px] text-blue-300">Evaluating profile, executing tools & searching database</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form Bar */}
      <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-900/90 backdrop-blur">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative flex items-end gap-2">
          {/* Text Area */}
          <div className="relative flex-1 rounded-2xl bg-slate-800/90 border border-slate-700/80 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition shadow-inner flex items-center">
            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={handleInputResize}
              onKeyDown={handleKeyDown}
              placeholder="Ask about careers, share your skills/interests, assess gaps, or request a roadmap..."
              rows={1}
              className="w-full bg-transparent px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none resize-none max-h-40 leading-relaxed"
            />

            {/* Voice Dictation Simulation Button */}
            <button
              type="button"
              onClick={toggleMic}
              className={`p-2 mr-2 rounded-xl transition ${
                isRecording
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/60'
              }`}
              title="Voice Input"
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          </div>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="h-11 px-4 sm:px-5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold flex items-center justify-center gap-1.5 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-blue-500/20 active:scale-95 shrink-0"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline text-xs font-bold">Send</span>
              </>
            )}
          </button>
        </form>

        <div className="text-[10px] text-slate-500 text-center mt-2 flex items-center justify-center gap-1">
          <span>Press</span>
          <kbd className="px-1 py-0.5 bg-slate-800 rounded border border-slate-700 font-mono text-[9px]">Enter</kbd>
          <span>to send,</span>
          <kbd className="px-1 py-0.5 bg-slate-800 rounded border border-slate-700 font-mono text-[9px]">Shift + Enter</kbd>
          <span>for newline</span>
        </div>
      </div>
    </div>
  );
};
