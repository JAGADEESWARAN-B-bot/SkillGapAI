import React from 'react';
import {
  Compass,
  CheckCircle2,
  Clock,
  BookOpen,
  ArrowRight,
  Sparkles,
  Layers,
  Award,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RoadmapItem } from '../types';
import { Link } from 'react-router-dom';

export const Roadmap: React.FC = () => {
  const { roadmap, updateRoadmapItemStatus, selectedRoleId, targetRoles } = useApp();

  const currentRole = targetRoles.find((r) => r.id === selectedRoleId);

  const completedCount = roadmap.filter((r) => r.status === 'COMPLETED').length;
  const inProgressCount = roadmap.filter((r) => r.status === 'IN_PROGRESS').length;
  const percentComplete =
    roadmap.length > 0 ? Math.round((completedCount / roadmap.length) * 100) : 0;

  // Group roadmap by phase
  const phases = Array.from(new Set(roadmap.map((item) => item.phase))).sort((a, b) => a - b);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2.5">
            <Compass className="w-7 h-7 text-cyan-400" />
            <span>Personalized Learning Roadmap</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Topological prerequisite-ordered curriculum tailored to bridge your gaps for{' '}
            <strong className="text-white">{currentRole?.title || 'Target Role'}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/projects"
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Recommended Projects</span>
          </Link>
        </div>
      </div>

      {/* Progress Metric Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-3 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-cyan-400" />
            <span className="text-sm font-bold text-white">Roadmap Completion Trajectory</span>
          </div>
          <div className="text-xs font-semibold text-slate-300">
            <span className="text-emerald-400">{completedCount}</span> completed &bull;{' '}
            <span className="text-cyan-400">{inProgressCount}</span> in progress &bull;{' '}
            <span className="text-slate-400">{roadmap.length} total milestones</span>
          </div>
        </div>

        <div className="w-full h-3 rounded-full bg-slate-950 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${percentComplete}%` }}
          />
        </div>
      </div>

      {/* Phased Milestones List */}
      {roadmap.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 border border-slate-800 rounded-2xl space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
          <h3 className="text-base font-semibold text-white">No Missing Gaps Found!</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            You meet or exceed all current requirements for this target role. Check out interview preparation or try benchmarking a more advanced role.
          </p>
          <Link
            to="/interview"
            className="inline-block mt-2 px-4 py-2 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400"
          >
            Prepare for Interviews
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {phases.map((phaseNum) => {
            const phaseItems = roadmap.filter((item) => item.phase === phaseNum);
            const phaseTitle = phaseItems[0]?.phaseTitle || `Phase ${phaseNum}`;

            return (
              <div key={phaseNum} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-sm">
                    {phaseNum}
                  </div>
                  <h2 className="text-lg font-bold text-white tracking-tight">{phaseTitle}</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {phaseItems.map((item) => {
                    const isDone = item.status === 'COMPLETED';
                    const isInProgress = item.status === 'IN_PROGRESS';

                    return (
                      <div
                        key={item.id}
                        className={`rounded-2xl border p-5 flex flex-col justify-between transition-colors ${
                          isDone
                            ? 'bg-slate-900/40 border-emerald-900/50'
                            : isInProgress
                            ? 'bg-slate-900/90 border-cyan-500/50 shadow-md'
                            : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-cyan-400">
                              {item.category}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                item.importance === 'Essential'
                                  ? 'bg-rose-950 text-rose-400 border border-rose-800'
                                  : 'bg-slate-800 text-slate-300'
                              }`}
                            >
                              {item.importance}
                            </span>
                          </div>

                          <div>
                            <h3 className="text-base font-bold text-white flex items-center gap-2">
                              <span>{item.skillName}</span>
                              {isDone && (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                              )}
                            </h3>
                            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                              {item.practiceTask}
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                            <div className="flex items-center gap-1.5 text-slate-400">
                              <Clock className="w-3.5 h-3.5 text-cyan-400" />
                              <span>~{item.estimatedHours} study hours</span>
                            </div>
                            {item.prerequisites.length > 0 && (
                              <div className="flex items-center gap-1.5 text-slate-400">
                                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                                <span className="truncate">
                                  Prereq: {item.prerequisites[0]}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Status Toggle Selector */}
                        <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                          <span className="text-[11px] font-medium text-slate-400">Status:</span>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => updateRoadmapItemStatus(item.id, 'NOT_STARTED')}
                              className={`px-2 py-1 text-[10px] font-semibold rounded ${
                                item.status === 'NOT_STARTED'
                                  ? 'bg-slate-800 text-white'
                                  : 'text-slate-500 hover:text-slate-300'
                              }`}
                            >
                              Not Started
                            </button>
                            <button
                              type="button"
                              onClick={() => updateRoadmapItemStatus(item.id, 'IN_PROGRESS')}
                              className={`px-2 py-1 text-[10px] font-semibold rounded ${
                                item.status === 'IN_PROGRESS'
                                  ? 'bg-cyan-500 text-slate-950 font-bold'
                                  : 'text-slate-500 hover:text-slate-300'
                              }`}
                            >
                              In Progress
                            </button>
                            <button
                              type="button"
                              onClick={() => updateRoadmapItemStatus(item.id, 'COMPLETED')}
                              className={`px-2.5 py-1 text-[10px] font-semibold rounded ${
                                item.status === 'COMPLETED'
                                  ? 'bg-emerald-600 text-white font-bold'
                                  : 'text-slate-500 hover:text-slate-300'
                              }`}
                            >
                              ✓ Completed
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
