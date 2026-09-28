import React, { useState } from 'react';
import {
  HelpCircle,
  Code2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  MessageSquare,
  BookOpen,
  Terminal,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  ROLE_INTERVIEW_QUESTIONS,
  DEFAULT_INTERVIEW_QUESTIONS,
} from '../data/interviewData';
import { InterviewQuestion } from '../types';

export const Interview: React.FC = () => {
  const { selectedRoleId, targetRoles } = useApp();

  const currentRole = targetRoles.find((r) => r.id === selectedRoleId);
  const questions: InterviewQuestion[] =
    ROLE_INTERVIEW_QUESTIONS[selectedRoleId] || DEFAULT_INTERVIEW_QUESTIONS;

  const [expandedId, setExpandedId] = useState<string | null>(questions[0]?.id || null);
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');

  const filteredQuestions = questions.filter(
    (q) => selectedFilter === 'ALL' || q.category === selectedFilter
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2.5">
          <HelpCircle className="w-7 h-7 text-cyan-400" />
          <span>Technical Interview Preparation</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Master real technical questions, system concepts, and behavioral STAR stories for{' '}
          <strong className="text-white">{currentRole?.title || 'Target Role'}</strong>.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {['ALL', 'Technical', 'Conceptual', 'Coding Challenge', 'Behavioral'].map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedFilter(tab)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedFilter === tab
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Questions Accordion List */}
      <div className="space-y-4">
        {filteredQuestions.map((q) => {
          const isExpanded = expandedId === q.id;

          return (
            <div
              key={q.id}
              className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden transition-colors hover:border-slate-700"
            >
              <button
                type="button"
                onClick={() => setExpandedId(isExpanded ? null : q.id)}
                className="w-full p-5 text-left flex items-start justify-between gap-4 focus:outline-none"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-cyan-400">
                      {q.category}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400">
                      {q.topic} &bull; {q.difficulty} Level
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white leading-snug">{q.question}</h3>
                </div>

                <div className="p-1 rounded-lg text-slate-400 bg-slate-800/60 mt-1 flex-shrink-0">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {isExpanded && (
                <div className="p-5 pt-0 border-t border-slate-800/80 bg-slate-950/40 space-y-4 animate-in fade-in duration-150">
                  {/* Model Answer Summary */}
                  <div className="space-y-1.5 pt-4">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Model Answer & Insights</span>
                    </span>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {q.answerSummary}
                    </p>
                  </div>

                  {/* Code snippet if present */}
                  {q.codeSnippet && (
                    <div className="space-y-1 pt-2">
                      <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                        <span className="flex items-center gap-1">
                          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Code Example</span>
                        </span>
                      </div>
                      <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto leading-relaxed">
                        <code>{q.codeSnippet}</code>
                      </pre>
                    </div>
                  )}

                  {/* Key Concepts Tags */}
                  <div className="flex items-center gap-1.5 pt-2 flex-wrap text-xs">
                    <span className="text-slate-400 font-semibold text-[11px]">Key concepts:</span>
                    {q.keyConcepts.map((kc) => (
                      <span
                        key={kc}
                        className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300"
                      >
                        {kc}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
