import React from 'react';
import { ProficiencyLevel, MatchStatus, PriorityLevel } from '../types';

interface SkillBadgeProps {
  name: string;
  category?: string;
  proficiency?: ProficiencyLevel;
  status?: MatchStatus;
  priority?: PriorityLevel;
  isCore?: boolean;
  onRemove?: () => void;
  size?: 'sm' | 'md';
}

export const SkillBadge: React.FC<SkillBadgeProps> = ({
  name,
  category,
  proficiency,
  status,
  priority,
  isCore,
  onRemove,
  size = 'md',
}) => {
  let statusBadge = null;

  if (status === 'FULLY_MATCHED') {
    statusBadge = (
      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
        Matched
      </span>
    );
  } else if (status === 'PARTIALLY_MATCHED') {
    statusBadge = (
      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800">
        Partial
      </span>
    );
  } else if (status === 'MISSING') {
    statusBadge = (
      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800">
        Missing
      </span>
    );
  }

  let profBadge = null;
  if (proficiency) {
    const profColors: Record<ProficiencyLevel, string> = {
      BEGINNER: 'text-slate-400 bg-slate-800/80',
      INTERMEDIATE: 'text-cyan-300 bg-cyan-950/80',
      ADVANCED: 'text-blue-300 bg-blue-950/80',
      EXPERT: 'text-emerald-300 bg-emerald-950/80',
    };
    profBadge = (
      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${profColors[proficiency]}`}>
        {proficiency.toLowerCase()}
      </span>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg ${
        size === 'sm' ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-xs'
      } text-slate-200 font-medium hover:border-slate-700 transition-colors`}
    >
      <span className="font-semibold text-white">{name}</span>
      {isCore && (
        <span className="text-[9px] font-extrabold uppercase px-1 py-0.2 rounded bg-cyan-500/20 text-cyan-400">
          Core
        </span>
      )}
      {profBadge}
      {statusBadge}
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-1 text-slate-500 hover:text-rose-400 font-bold focus:outline-none"
          title={`Remove ${name}`}
        >
          &times;
        </button>
      )}
    </div>
  );
};
