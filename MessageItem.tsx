import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Bot, User, Sparkles } from 'lucide-react';
import { ChatMessage, CareerRoadmap } from '../types';
import { AgentThoughtPill } from './AgentThoughtPill';
import { CareerCard } from './CareerCard';
import { SkillGapView } from './SkillGapView';
import { RoadmapView } from './RoadmapView';
import { CourseList } from './CourseList';

interface MessageItemProps {
  message: ChatMessage;
  onAssessCareerGap?: (careerTitle: string) => void;
  onGenerateCareerRoadmap?: (careerTitle: string) => void;
  onSearchCourseGaps?: (careerTitle: string, skills: string[]) => void;
  onExportRoadmap?: (roadmap: CareerRoadmap) => void;
}

export const MessageItem: React.FC<MessageItemProps> = ({
  message,
  onAssessCareerGap,
  onGenerateCareerRoadmap,
  onSearchCourseGaps,
  onExportRoadmap
}) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 my-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {/* Avatar for Assistant */}
      {!isUser && (
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-600/20 shrink-0 mt-0.5 ring-1 ring-blue-400/40">
          <Bot className="w-4 h-4" />
        </div>
      )}

      {/* Bubble Content */}
      <div className={`max-w-[90%] md:max-w-[80%] rounded-2xl p-4 text-xs md:text-sm ${
        isUser
          ? 'bg-blue-600 text-white rounded-tr-none shadow-md shadow-blue-600/10 font-sans'
          : 'bg-slate-800/90 text-slate-100 rounded-tl-none border border-slate-700/80 shadow-lg shadow-slate-950/40'
      }`}>
        {/* Agent Thought & Tool Execution Pill */}
        {!isUser && message.steps && message.steps.length > 0 && (
          <AgentThoughtPill steps={message.steps} />
        )}

        {/* Message Content Markdown */}
        <div className="prose prose-invert prose-xs md:prose-sm max-w-none leading-relaxed space-y-2">
          <ReactMarkdown
            components={{
              h3: ({ node, ...props }) => <h3 className="text-base font-bold text-white mt-2 mb-1" {...props} />,
              h4: ({ node, ...props }) => <h4 className="text-sm font-bold text-blue-300 mt-2 mb-1" {...props} />,
              p: ({ node, ...props }) => <p className="mb-2 leading-relaxed" {...props} />,
              ul: ({ node, ...props }) => <ul className="list-disc pl-4 space-y-1 mb-2" {...props} />,
              ol: ({ node, ...props }) => <ol className="list-decimal pl-4 space-y-1 mb-2" {...props} />,
              li: ({ node, ...props }) => <li className="text-slate-200" {...props} />,
              strong: ({ node, ...props }) => <strong className="font-semibold text-white" {...props} />,
              code: ({ node, ...props }) => (
                <code className="px-1.5 py-0.5 rounded bg-slate-900 text-blue-300 border border-slate-700 font-mono text-[11px]" {...props} />
              ),
              blockquote: ({ node, ...props }) => (
                <blockquote className="border-l-2 border-blue-500 pl-3 my-2 text-slate-300 italic bg-blue-950/20 py-1 rounded-r" {...props} />
              )
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>

        {/* Embedded Career Results Cards */}
        {!isUser && message.careerResults && message.careerResults.length > 0 && (
          <div className="mt-3 space-y-2.5">
            <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Matched Career Paths ({message.careerResults.length})</span>
            </div>
            <div className="grid grid-cols-1 gap-2.5">
              {message.careerResults.map((career) => (
                <CareerCard
                  key={career.id}
                  career={career}
                  onAssessGap={onAssessCareerGap}
                  onGenerateRoadmap={onGenerateCareerRoadmap}
                />
              ))}
            </div>
          </div>
        )}

        {/* Embedded Skill Gap View */}
        {!isUser && message.skillGapResult && (
          <SkillGapView
            assessment={message.skillGapResult}
            onSearchCourses={onSearchCourseGaps}
            onGenerateRoadmap={onGenerateCareerRoadmap}
          />
        )}

        {/* Embedded Phased Roadmap */}
        {!isUser && message.roadmapResult && (
          <RoadmapView
            roadmap={message.roadmapResult}
            onExportRoadmap={onExportRoadmap}
          />
        )}

        {/* Embedded Course Recommendations List */}
        {!isUser && message.courseResults && message.courseResults.length > 0 && (
          <CourseList
            courses={message.courseResults}
            title="Curated Courses & Learning Resources"
          />
        )}

        {/* Timestamp */}
        <div className={`text-[10px] mt-2 flex items-center ${isUser ? 'justify-end text-blue-200' : 'justify-start text-slate-500'}`}>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {/* Avatar for User */}
      {isUser && (
        <div className="w-8 h-8 rounded-xl bg-slate-700 flex items-center justify-center text-slate-200 shrink-0 mt-0.5 border border-slate-600">
          <User className="w-4 h-4" />
        </div>
      )}
    </div>
  );
};
