import React, { useState } from 'react';
import {
  FolderGit2,
  Calendar,
  Layers,
  CheckCircle,
  ExternalLink,
  Filter,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RECOMMENDED_PROJECTS } from '../data/projectsData';
import { SkillBadge } from '../components/SkillBadge';
import { Link } from 'react-router-dom';

export const Projects: React.FC = () => {
  const { selectedRoleId, targetRoles } = useApp();
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('ALL');

  const currentRole = targetRoles.find((r) => r.id === selectedRoleId);

  const filteredProjects = RECOMMENDED_PROJECTS.filter((proj) => {
    const matchesDiff =
      selectedDifficulty === 'ALL' || proj.difficulty === selectedDifficulty;
    return matchesDiff;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2.5">
            <FolderGit2 className="w-7 h-7 text-cyan-400" />
            <span>Recommended Portfolio Projects</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Build high-signal portfolio pieces engineered to prove competencies for{' '}
            <strong className="text-white">{currentRole?.title || 'Target Role'}</strong>.
          </p>
        </div>

        {/* Difficulty Filter */}
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded-xl">
          {['ALL', 'Beginner', 'Intermediate', 'Advanced'].map((diff) => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                selectedDifficulty === diff
                  ? 'bg-cyan-500 text-slate-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProjects.map((proj) => (
          <div
            key={proj.id}
            className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700 transition-all space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    proj.difficulty === 'Advanced'
                      ? 'bg-rose-950 text-rose-400 border border-rose-800'
                      : proj.difficulty === 'Intermediate'
                      ? 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                      : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  }`}
                >
                  {proj.difficulty}
                </span>

                <div className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{proj.durationWeeks} weeks</span>
                </div>
              </div>

              <h3 className="text-lg font-bold text-white">{proj.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{proj.description}</p>

              {/* Covered Skills */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-semibold text-slate-400 block">
                  Demonstrated Competencies:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {proj.coveredSkills.map((s) => (
                    <span
                      key={s}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-950 text-cyan-300 border border-slate-800"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Architecture Blueprint */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1 text-xs">
                <span className="text-slate-400 font-semibold block flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Architecture Blueprint:</span>
                </span>
                <p className="text-slate-300 font-mono text-[11px] leading-relaxed">
                  {proj.architecture}
                </p>
              </div>

              {/* Key Deliverables */}
              <div className="space-y-1.5 pt-1 text-xs">
                <span className="text-[11px] font-semibold text-slate-400 block">
                  Portfolio Deliverables:
                </span>
                <ul className="space-y-1 text-slate-300">
                  {proj.deliverables.map((d, i) => (
                    <li key={i} className="flex items-center gap-1.5 text-xs">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <Link
                to="/roadmap"
                className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                <span>Bridge required skills in Roadmap</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
