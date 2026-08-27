import React, { useState } from 'react';
import { Bot, ChevronDown, ChevronRight, CheckCircle2, AlertCircle, Loader2, Database, Search, Award, MapPin, UserCheck, BookOpen } from 'lucide-react';
import { AgentStep, ToolCallLog } from '../types';

interface AgentThoughtPillProps {
  steps?: AgentStep[];
  isStreaming?: boolean;
}

const toolIcons: Record<string, React.ReactNode> = {
  get_user_profile: <UserCheck className="w-3.5 h-3.5 text-sky-400" />,
  update_user_profile: <Database className="w-3.5 h-3.5 text-blue-400" />,
  search_careers: <Search className="w-3.5 h-3.5 text-indigo-400" />,
  search_courses: <BookOpen className="w-3.5 h-3.5 text-amber-400" />,
  assess_skill_gap: <Award className="w-3.5 h-3.5 text-emerald-400" />,
  generate_roadmap: <MapPin className="w-3.5 h-3.5 text-purple-400" />
};

export const AgentThoughtPill: React.FC<AgentThoughtPillProps> = ({ steps, isStreaming }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!steps || steps.length === 0) {
    if (isStreaming) {
      return (
        <div className="flex items-center gap-2 py-2 px-3 rounded-lg bg-blue-950/40 border border-blue-800/40 text-xs text-blue-300 mb-3 animate-pulse">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-400" />
          <span>Agent is reasoning and evaluating tools...</span>
        </div>
      );
    }
    return null;
  }

  const allToolCalls = steps.flatMap(s => s.toolCalls || []);

  return (
    <div className="mb-3 rounded-xl border border-slate-700/60 bg-slate-800/50 backdrop-blur overflow-hidden transition-all duration-200">
      {/* Header Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs text-slate-300 hover:bg-slate-800/80 transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-blue-500/20 text-blue-400 flex items-center justify-center font-semibold text-[10px] border border-blue-500/30">
            {allToolCalls.length || steps.length}
          </div>
          <span className="font-medium text-slate-200">
            Agent Reasoning & Tool Chain ({allToolCalls.length} tool {allToolCalls.length === 1 ? 'call' : 'calls'})
          </span>
          {isStreaming && (
            <span className="flex items-center gap-1 text-[10px] text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded-full border border-blue-800">
              <Loader2 className="w-2.5 h-2.5 animate-spin" /> Active
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-slate-400">
          <span className="text-[11px]">{isOpen ? 'Hide Trace' : 'View Trace'}</span>
          {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </div>
      </button>

      {/* Expanded Step Log */}
      {isOpen && (
        <div className="p-3 border-t border-slate-700/50 space-y-3 bg-slate-900/60 text-xs">
          {steps.map((step, sIdx) => (
            <div key={sIdx} className="space-y-2 border-l-2 border-blue-500/40 pl-3">
              {/* Agent Thought */}
              {step.thought && (
                <div className="text-slate-300 bg-slate-800/70 p-2.5 rounded-lg border border-slate-700/50 leading-relaxed font-sans text-xs">
                  <span className="text-[10px] font-semibold text-blue-400 uppercase tracking-wider block mb-1">
                    Step {sIdx + 1} Internal Reasoning:
                  </span>
                  {step.thought}
                </div>
              )}

              {/* Tool Calls in this step */}
              {step.toolCalls && step.toolCalls.map((tc: ToolCallLog) => (
                <div
                  key={tc.id}
                  className="rounded-lg bg-slate-950/60 border border-slate-800 p-2.5 text-xs font-mono"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5 font-semibold text-blue-300">
                      {toolIcons[tc.toolName] || <Bot className="w-3.5 h-3.5 text-blue-400" />}
                      <span>{tc.toolName}()</span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px]">
                      {tc.status === 'success' && (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> completed
                        </span>
                      )}
                      {tc.status === 'pending' && (
                        <span className="text-amber-400 flex items-center gap-1">
                          <Loader2 className="w-3 h-3 animate-spin" /> executing...
                        </span>
                      )}
                      {tc.status === 'error' && (
                        <span className="text-rose-400 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> error
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Arguments */}
                  {tc.args && Object.keys(tc.args).length > 0 && (
                    <div className="text-[11px] text-slate-400 bg-slate-900/90 p-1.5 rounded mb-1.5 overflow-x-auto border border-slate-800">
                      <span className="text-slate-500">args: </span>
                      {JSON.stringify(tc.args)}
                    </div>
                  )}

                  {/* Summary / Result preview */}
                  {tc.result && (
                    <div className="text-[11px] text-slate-300 bg-slate-900/50 p-1.5 rounded border border-slate-800/80 max-h-28 overflow-y-auto font-sans">
                      {typeof tc.result === 'object' && tc.result.searchSummary
                        ? tc.result.searchSummary
                        : typeof tc.result === 'object' && tc.result.message
                        ? tc.result.message
                        : typeof tc.result === 'object' && tc.result.summary
                        ? tc.result.summary
                        : JSON.stringify(tc.result, null, 1)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
