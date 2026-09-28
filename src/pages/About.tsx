import React from 'react';
import {
  Sparkles,
  Calculator,
  ShieldCheck,
  Compass,
  CheckCircle2,
  Code2,
  Cpu,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center mx-auto shadow-lg shadow-cyan-500/20">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          About SkillGap AI
        </h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
          Democratizing career readiness analytics for students and early-career software professionals.
        </p>
      </div>

      {/* Mission Section */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-8 space-y-4">
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-cyan-400" />
          <span>The Problem with Traditional Job Searching</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Students and fresh graduates face an overwhelming job market filled with inflated job descriptions, vague buzzwords, and rejection emails that never explain what competencies were missing. SkillGap AI replaces this opaque guesswork with transparent, mathematical benchmarking.
        </p>
      </div>

      {/* Core Methodology */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-8 space-y-6">
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Calculator className="w-5 h-5 text-cyan-400" />
          <span>Transparent Mathematical Methodology</span>
        </h2>

        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-mono text-cyan-300 space-y-2">
          <div>Readiness Score (%) = (&Sigma; Earned Competency Weights / &Sigma; Max Required Weights) &times; 100%</div>
          <div>Skill Gap (%) = 100% - Readiness Score (%)</div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="font-bold text-emerald-400 block">Fully Matched (1.0x)</span>
            <p className="text-slate-400 text-[11px]">
              Candidate holds verified experience meeting or exceeding the role's minimum required tier.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="font-bold text-amber-400 block">Partially Matched (0.5x)</span>
            <p className="text-slate-400 text-[11px]">
              Candidate possesses beginner knowledge where intermediate or advanced mastery is expected.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="font-bold text-rose-400 block">Missing (0.0x)</span>
            <p className="text-slate-400 text-[11px]">
              Competency is absent from candidate profile; prioritized by role importance.
            </p>
          </div>
        </div>
      </div>

      {/* System Architecture */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-8 space-y-4">
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Cpu className="w-5 h-5 text-cyan-400" />
          <span>Zero-Failure Architecture Principle</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          SkillGap AI does not make Large Language Models a fragile single point of failure. The entire skill comparison, mathematical score calculation, category breakdowns, and phased roadmap generation operate deterministically on local data structures. Gemini AI provides supplemental coaching and advice, but if offline, the app runs 100% functional.
        </p>
      </div>

      <div className="text-center pt-4">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all"
        >
          <span>Explore Your Skill Gap Now</span>
        </Link>
      </div>
    </div>
  );
};
