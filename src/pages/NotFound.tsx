import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home, LayoutDashboard } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto">
        <Compass className="w-8 h-8" />
      </div>

      <div className="space-y-2 max-w-md">
        <h1 className="text-4xl font-extrabold text-white tracking-tight">404</h1>
        <h2 className="text-xl font-bold text-slate-200">Page Not Found</h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          The requested route does not exist. Navigate back to the home page or open your career dashboard.
        </p>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Link
          to="/"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Home</span>
        </Link>

        <Link
          to="/dashboard"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all"
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Go to Dashboard</span>
        </Link>
      </div>
    </div>
  );
};
