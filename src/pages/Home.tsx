import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Target,
  BrainCircuit,
  Compass,
  Briefcase,
  FileCheck2,
  CheckCircle2,
  TrendingUp,
  Award,
  Zap,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ScoreGauge } from '../components/ScoreGauge';

export const Home: React.FC = () => {
  const { analysis, targetRoles, selectedRoleId, setSelectedRoleId } = useApp();

  return (
    <div className="space-y-16 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 p-8 sm:p-12 lg:p-16 text-center">
        {/* Glow backdrop */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-950/60 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered Career Intelligence
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Know Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">Skill Gap</span>. Build Your Career.
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Eliminate guesswork in your career journey. Benchmark your current skills against industry standard job descriptions, compute your transparent readiness percentage, and follow an actionable learning roadmap.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5"
            >
              <Target className="w-4 h-4" />
              <span>Launch Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/resume"
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-semibold text-sm transition-all"
            >
              <FileCheck2 className="w-4 h-4 text-cyan-400" />
              <span>Scan My Resume</span>
            </Link>
          </div>
        </div>

        {/* Live readiness card snapshot */}
        <div className="mt-12 max-w-xl mx-auto bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <ScoreGauge score={analysis.coveragePercent} size={150} />
            <div className="text-left space-y-3">
              <div className="space-y-1">
                <span className="text-xs font-medium text-slate-400">Current Benchmark</span>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  {analysis.roleTitle}
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block">Matched Skills</span>
                  <span className="text-emerald-400 font-bold text-sm">
                    {analysis.matchedCount} of {analysis.totalSkillsCount}
                  </span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block">Skill Gap</span>
                  <span className="text-rose-400 font-bold text-sm">
                    {analysis.gapPercent}%
                  </span>
                </div>
              </div>

              <Link
                to="/analyze"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300"
              >
                <span>View Full Mathematical Breakdown</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Step Interactive Process */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            How SkillGap AI Accelerates Your Career
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            From skill ingestion to interview readiness, our deterministic algorithms guide every step.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl space-y-3 relative hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold">
              1
            </div>
            <h3 className="text-base font-bold text-white">Input Skills or Resume</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Add your technical competencies manually or paste your raw resume text to auto-extract 70+ technology keywords.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl space-y-3 relative hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
              2
            </div>
            <h3 className="text-base font-bold text-white">Benchmark Role Match</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Select from 14 industry career roles. Our weighted engine calculates exact coverage and categorizes gaps.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl space-y-3 relative hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold">
              3
            </div>
            <h3 className="text-base font-bold text-white">Phased Roadmap</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Follow topological milestones ordered by prerequisite logic, complete with tasks and hours.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl space-y-3 relative hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
              4
            </div>
            <h3 className="text-base font-bold text-white">Projects & Interviews</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Build recommended projects that target your specific missing skills, then prep with real interview questions.
            </p>
          </div>
        </div>
      </section>

      {/* Target Roles Carousel / Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">Explore Career Roles</h2>
            <p className="text-xs text-slate-400">Select any role to immediately benchmark your skill readiness</p>
          </div>
          <Link to="/job-roles" className="text-xs font-semibold text-cyan-400 hover:underline">
            View All ({targetRoles.length}) &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {targetRoles.slice(0, 6).map((role) => (
            <div
              key={role.id}
              onClick={() => setSelectedRoleId(role.id)}
              className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                selectedRoleId === role.id
                  ? 'bg-slate-900 border-cyan-500 shadow-lg shadow-cyan-500/10'
                  : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {role.category}
                </span>
                <span className="text-xs font-semibold text-emerald-400">{role.avgSalary}</span>
              </div>
              <h3 className="text-base font-bold text-white mb-1.5">{role.title}</h3>
              <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                {role.description}
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs font-medium">
                <span className="text-slate-400">{role.requiredSkills.length} Required Skills</span>
                <span className="text-cyan-400 flex items-center gap-1 font-semibold">
                  {selectedRoleId === role.id ? 'Selected' : 'Benchmark'} &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
