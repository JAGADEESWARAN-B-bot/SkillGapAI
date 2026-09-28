import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Target,
  Sparkles,
  TrendingUp,
  BrainCircuit,
  Compass,
  FolderGit2,
  HelpCircle,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  Plus,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ScoreGauge } from '../components/ScoreGauge';
import { SkillBadge } from '../components/SkillBadge';
import { getGeminiCareerInsights } from '../services/geminiService';

export const Dashboard: React.FC = () => {
  const {
    user,
    profile,
    skills,
    targetRoles,
    selectedRoleId,
    setSelectedRoleId,
    analysis,
    roadmap,
    geminiApiKey,
    runAndSaveAnalysis,
  } = useApp();

  const [aiAdvice, setAiAdvice] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState<boolean>(false);

  const fetchAiAdvice = async () => {
    setLoadingAi(true);
    const text = await getGeminiCareerInsights(
      {
        roleTitle: analysis.roleTitle,
        coveragePercent: analysis.coveragePercent,
        missingSkills: analysis.topPriorityMissing,
        userSkills: skills.map((s) => s.name),
      },
      geminiApiKey
    );
    setAiAdvice(text);
    setLoadingAi(false);
  };

  useEffect(() => {
    fetchAiAdvice();
  }, [selectedRoleId, skills.length]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Welcome & Role Selector Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-6 rounded-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Welcome, {profile.name || 'Candidate'}
            </h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 font-semibold">
              {profile.experienceLevel}
            </span>
          </div>
          <p className="text-xs text-slate-400">
            {profile.institution || 'State University'} &bull; {profile.course}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 flex items-center gap-2">
            <Target className="w-4 h-4 text-cyan-400" />
            <select
              value={selectedRoleId}
              onChange={(e) => setSelectedRoleId(e.target.value)}
              className="bg-transparent text-sm font-semibold text-white focus:outline-none cursor-pointer"
            >
              {targetRoles.map((role) => (
                <option key={role.id} value={role.id} className="bg-slate-900 text-white">
                  {role.title}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => {
              runAndSaveAnalysis();
              fetchAiAdvice();
            }}
            title="Recalculate and snapshot to history"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-semibold transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingAi ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {/* Main KPI Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Readiness Gauge Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-4 left-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Overall Readiness
          </div>
          <ScoreGauge score={analysis.coveragePercent} size={190} strokeWidth={16} />

          <div className="w-full grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-800 text-center">
            <div className="bg-slate-950/60 p-2 rounded-lg">
              <span className="block text-[10px] text-slate-400 uppercase font-semibold">Matched</span>
              <span className="text-emerald-400 font-bold text-sm">{analysis.matchedCount}</span>
            </div>
            <div className="bg-slate-950/60 p-2 rounded-lg">
              <span className="block text-[10px] text-slate-400 uppercase font-semibold">Partial</span>
              <span className="text-amber-400 font-bold text-sm">{analysis.partialCount}</span>
            </div>
            <div className="bg-slate-950/60 p-2 rounded-lg">
              <span className="block text-[10px] text-slate-400 uppercase font-semibold">Missing</span>
              <span className="text-rose-400 font-bold text-sm">{analysis.missingCount}</span>
            </div>
          </div>
        </div>

        {/* Category Breakdown Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Competency Breakdown
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                {analysis.totalEarnedScore} / {analysis.maxPossibleScore} pts
              </span>
            </div>

            <div className="space-y-3.5">
              {analysis.categoryBreakdown.map((cat) => (
                <div key={cat.category} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">{cat.category}</span>
                    <span className="font-semibold text-cyan-400">{cat.coverage}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${cat.coverage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Link
            to="/analyze"
            className="mt-6 flex items-center justify-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 pt-3 border-t border-slate-800"
          >
            <span>Open Detailed Gap Analysis</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Priority Missing Skills Action Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-rose-400" />
                <span>Priority Gaps to Close</span>
              </h3>
              <span className="text-xs text-rose-400 font-semibold">{analysis.gapPercent}% Gap</span>
            </div>

            {analysis.topPriorityMissing.length === 0 ? (
              <div className="text-center py-8 space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <p className="text-sm font-semibold text-white">Full Role Mastery!</p>
                <p className="text-xs text-slate-400">All required competencies are met.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {analysis.topPriorityMissing.map((skillName, idx) => (
                  <div
                    key={skillName}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-rose-950 text-rose-400 font-bold flex items-center justify-center text-[10px]">
                        {idx + 1}
                      </span>
                      <span className="font-semibold text-white">{skillName}</span>
                    </div>
                    <Link
                      to="/roadmap"
                      className="text-cyan-400 hover:text-cyan-300 font-semibold text-[11px] flex items-center gap-1"
                    >
                      <span>Study</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 pt-3 border-t border-slate-800 flex items-center justify-between">
            <Link
              to="/skills"
              className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Skill</span>
            </Link>
            <Link
              to="/roadmap"
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>View Full Roadmap ({roadmap.length} items)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* AI Intelligence / Career Coaching Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">AI Career Coach Intelligence</h3>
              <p className="text-xs text-slate-400">
                Personalized strategy based on your current {analysis.coveragePercent}% readiness score
              </p>
            </div>
          </div>

          <button
            onClick={fetchAiAdvice}
            disabled={loadingAi}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingAi ? 'animate-spin' : ''}`} />
            <span>Regenerate</span>
          </button>
        </div>

        <div className="text-xs sm:text-sm text-slate-300 whitespace-pre-line leading-relaxed bg-slate-950/70 p-5 rounded-xl border border-slate-800/80">
          {loadingAi ? 'Analyzing your competencies and crafting strategic advice...' : aiAdvice}
        </div>
      </div>

      {/* Quick Action Navigation Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link
          to="/roadmap"
          className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors space-y-2 group"
        >
          <Compass className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
          <h4 className="text-sm font-bold text-white">Learning Roadmap</h4>
          <p className="text-[11px] text-slate-400">Step-by-step milestones to complete</p>
        </Link>

        <Link
          to="/projects"
          className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors space-y-2 group"
        >
          <FolderGit2 className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
          <h4 className="text-sm font-bold text-white">Portfolio Projects</h4>
          <p className="text-[11px] text-slate-400">Hands-on builds targeting gaps</p>
        </Link>

        <Link
          to="/interview"
          className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors space-y-2 group"
        >
          <HelpCircle className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
          <h4 className="text-sm font-bold text-white">Interview Prep</h4>
          <p className="text-[11px] text-slate-400">Role-specific Q&A and coding</p>
        </Link>

        <Link
          to="/resume"
          className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors space-y-2 group"
        >
          <BrainCircuit className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
          <h4 className="text-sm font-bold text-white">Resume Extractor</h4>
          <p className="text-[11px] text-slate-400">Sync skills directly from text</p>
        </Link>
      </div>
    </div>
  );
};
