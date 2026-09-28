import React, { useState } from 'react';
import {
  Target,
  Sparkles,
  Calculator,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  Save,
  RotateCcw,
  Sliders,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ScoreGauge } from '../components/ScoreGauge';
import { SkillBadge } from '../components/SkillBadge';
import { Link } from 'react-router-dom';

export const Analyze: React.FC = () => {
  const {
    analysis,
    targetRoles,
    selectedRoleId,
    setSelectedRoleId,
    simulatedSkills,
    toggleSimulatedSkill,
    clearSimulatedSkills,
    runAndSaveAnalysis,
  } = useApp();

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    runAndSaveAnalysis();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const missingOrPartialSkills = analysis.items.filter((i) => i.status !== 'FULLY_MATCHED');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2.5">
            <Target className="w-7 h-7 text-cyan-400" />
            <span>Deterministic Skill Gap Analysis</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Auditing your current profile against {analysis.roleTitle} competencies with transparent scoring.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>{savedSuccess ? 'Snapshot Saved!' : 'Save to History'}</span>
          </button>
        </div>
      </div>

      {/* Mathematical Formula Card */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 text-xs text-slate-300 space-y-2">
        <div className="flex items-center gap-2 font-bold text-white">
          <Calculator className="w-4 h-4 text-cyan-400" />
          <span>Calculation Methodology</span>
        </div>
        <p className="text-slate-400 leading-relaxed">
          Readiness is calculated strictly through weighted competency points:
          <span className="font-mono text-cyan-300 ml-1">
            Score = (&Sigma; Earned Weights / &Sigma; Total Required Weights) &times; 100%
          </span>
          . Fully matched skills grant 100% credit, partially matched skills grant 50% credit, and missing skills grant 0%.
        </p>
      </div>

      {/* KPI Comparison Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center">
          <ScoreGauge score={analysis.coveragePercent} size={170} />
          <div className="text-center mt-2">
            <span className="text-xs text-slate-400">
              Total Points: <strong className="text-white font-mono">{analysis.totalEarnedScore}</strong> / {analysis.maxPossibleScore}
            </span>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Match Distribution
          </h3>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Fully Matched
                </span>
                <span className="font-bold text-white">
                  {analysis.matchedCount} / {analysis.totalSkillsCount}
                </span>
              </div>
              <div className="h-2 rounded-full bg-slate-950 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${(analysis.matchedCount / analysis.totalSkillsCount) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-amber-400 font-semibold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Partially Matched
                </span>
                <span className="font-bold text-white">
                  {analysis.partialCount} / {analysis.totalSkillsCount}
                </span>
              </div>
              <div className="h-2 rounded-full bg-slate-950 overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full"
                  style={{ width: `${(analysis.partialCount / analysis.totalSkillsCount) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-rose-400 font-semibold flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" /> Missing
                </span>
                <span className="font-bold text-white">
                  {analysis.missingCount} / {analysis.totalSkillsCount}
                </span>
              </div>
              <div className="h-2 rounded-full bg-slate-950 overflow-hidden">
                <div
                  className="h-full bg-rose-500 rounded-full"
                  style={{ width: `${(analysis.missingCount / analysis.totalSkillsCount) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 text-xs text-slate-400">
            Target benchmark: <strong className="text-white">{analysis.roleTitle}</strong>
          </div>
        </div>

        {/* What-If Simulator Widget */}
        <div className="bg-slate-900/80 border border-cyan-500/30 rounded-2xl p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <span>What-If Simulator</span>
              </h3>
              {simulatedSkills.length > 0 && (
                <button
                  onClick={clearSimulatedSkills}
                  className="text-[11px] text-rose-400 hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>
            <p className="text-[11px] text-slate-400 mb-3">
              Click any missing skill below to simulate the projected jump in your readiness score.
            </p>

            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
              {missingOrPartialSkills.length === 0 ? (
                <span className="text-xs text-emerald-400">All competencies matched!</span>
              ) : (
                missingOrPartialSkills.map((item) => {
                  const isSim = simulatedSkills.includes(item.skillName);
                  return (
                    <button
                      key={item.skillName}
                      type="button"
                      onClick={() => toggleSimulatedSkill(item.skillName)}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition-all ${
                        isSim
                          ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-sm'
                          : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {isSim ? '✓ ' : '+ '}
                      {item.skillName}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400 block">Projected Coverage:</span>
            <span className="text-base font-extrabold text-cyan-400">
              {analysis.coveragePercent}%{' '}
              {simulatedSkills.length > 0 && (
                <span className="text-xs font-medium text-emerald-400 ml-1">
                  ({simulatedSkills.length} simulated skills active)
                </span>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Comprehensive Skill Comparison Table */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-base font-bold text-white">Full Competency Matrix</h3>
          <span className="text-xs text-slate-400">
            {analysis.items.length} Evaluated Requirements
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 uppercase text-[10px] text-slate-400 font-bold border-b border-slate-800">
              <tr>
                <th className="p-4">Required Competency</th>
                <th className="p-4">Category</th>
                <th className="p-4">Weight</th>
                <th className="p-4">Your Tier</th>
                <th className="p-4">Required Tier</th>
                <th className="p-4">Match Status</th>
                <th className="p-4">Points</th>
                <th className="p-4">Priority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {analysis.items.map((item) => (
                <tr key={item.skillName} className="hover:bg-slate-900/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{item.skillName}</span>
                      {item.isCore && (
                        <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 font-extrabold">
                          Core
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-slate-400">{item.category}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: item.weight }).map((_, i) => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      ))}
                    </div>
                  </td>
                  <td className="p-4">
                    {item.userProficiency ? (
                      <span className="text-slate-200">{item.userProficiency}</span>
                    ) : (
                      <span className="text-slate-500 italic">None</span>
                    )}
                  </td>
                  <td className="p-4 text-slate-300">{item.requiredProficiency}</td>
                  <td className="p-4">
                    {item.status === 'FULLY_MATCHED' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                        Matched
                      </span>
                    )}
                    {item.status === 'PARTIALLY_MATCHED' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-400 border border-amber-800">
                        Partial
                      </span>
                    )}
                    {item.status === 'MISSING' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950 text-rose-400 border border-rose-800">
                        Missing
                      </span>
                    )}
                  </td>
                  <td className="p-4 font-mono font-bold text-white">
                    {item.scoreEarned} / {item.maxScore}
                  </td>
                  <td className="p-4">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        item.priority === 'CRITICAL'
                          ? 'bg-rose-900/60 text-rose-300'
                          : item.priority === 'HIGH'
                          ? 'bg-amber-900/60 text-amber-300'
                          : item.priority === 'MEDIUM'
                          ? 'bg-blue-900/60 text-blue-300'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {item.priority}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
        <Link
          to="/dashboard"
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5"
        >
          &larr; Back to Dashboard
        </Link>
        <Link
          to="/roadmap"
          className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2"
        >
          <span>Generate Personalized Roadmap</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
