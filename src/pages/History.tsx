import React from 'react';
import { History as HistoryIcon, Trash2, Calendar, ArrowRight, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';

export const History: React.FC = () => {
  const { history, setSelectedRoleId } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2.5">
            <HistoryIcon className="w-7 h-7 text-cyan-400" />
            <span>Analysis History & Progress</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Review past skill gap evaluations and track your readiness improvements over time.
          </p>
        </div>

        <Link
          to="/analyze"
          className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <span>Run New Benchmark</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 border border-slate-800 rounded-2xl space-y-3">
          <HistoryIcon className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-semibold text-white">No Saved Snapshots</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            You haven't saved any analysis snapshots yet. Go to the Analyze screen and click "Save to History".
          </p>
          <Link
            to="/analyze"
            className="inline-block mt-2 px-4 py-2 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400"
          >
            Run First Analysis
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((record) => {
            const dateStr = new Date(record.timestamp).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={record.id}
                className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-700 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-base font-bold text-white">{record.roleTitle}</span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{dateStr}</span>
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                      {record.matchedCount} Matched
                    </span>
                    <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800 font-bold">
                      {record.missingCount} Missing
                    </span>
                    {record.topPriorityMissing.length > 0 && (
                      <span className="text-slate-400 text-[11px]">
                        Priority gaps: {record.topPriorityMissing.join(', ')}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-2xl font-black text-cyan-400">
                      {record.coveragePercent}%
                    </div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">
                      Readiness Score
                    </span>
                  </div>

                  <Link
                    to="/analyze"
                    onClick={() => setSelectedRoleId(record.roleId)}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                    title="Load Role"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
