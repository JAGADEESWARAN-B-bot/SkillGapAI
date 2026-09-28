import React from 'react';

interface ScoreGaugeProps {
  score: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  label?: string;
  subLabel?: string;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  score,
  size = 180,
  strokeWidth = 14,
  label = 'Readiness Score',
  subLabel = 'Industry Benchmark',
}) => {
  const clamped = Math.max(0, Math.min(100, score));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clamped / 100) * circumference;

  let strokeColor = '#38a8f7'; // brand cyan/blue
  let badgeText = 'Developing';
  let badgeColor = 'text-cyan-400 bg-cyan-950/50 border-cyan-800';

  if (clamped >= 80) {
    strokeColor = '#10b981'; // emerald green
    badgeText = 'Job Ready';
    badgeColor = 'text-emerald-400 bg-emerald-950/50 border-emerald-800';
  } else if (clamped >= 50) {
    strokeColor = '#06b6d4'; // cyan
    badgeText = 'Competitive';
    badgeColor = 'text-cyan-400 bg-cyan-950/50 border-cyan-800';
  } else {
    strokeColor = '#f59e0b'; // amber
    badgeText = 'Skill Gap Present';
    badgeColor = 'text-amber-400 bg-amber-950/50 border-amber-800';
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#1e293b"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress Arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="none"
            style={{
              transition: 'stroke-dashoffset 0.8s ease-in-out, stroke 0.5s ease',
            }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            {clamped}%
          </span>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
            Coverage
          </span>
        </div>
      </div>

      <div className="mt-3 text-center">
        <span
          className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full border ${badgeColor}`}
        >
          {badgeText}
        </span>
        <p className="text-xs text-slate-400 font-medium mt-1">{label}</p>
      </div>
    </div>
  );
};
