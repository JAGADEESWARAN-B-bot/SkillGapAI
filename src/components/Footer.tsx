import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, Shield, Code, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg text-white">SKILLGAP AI</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Transparent, deterministic skill gap analysis and personalized roadmap generation for career acceleration.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">Core Features</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/analyze" className="hover:text-cyan-400 transition-colors">Skill Gap Benchmark</Link></li>
              <li><Link to="/roadmap" className="hover:text-cyan-400 transition-colors">Phased Learning Roadmap</Link></li>
              <li><Link to="/resume" className="hover:text-cyan-400 transition-colors">Resume Skill Extractor</Link></li>
              <li><Link to="/projects" className="hover:text-cyan-400 transition-colors">Curated Portfolio Projects</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">Career Tracks</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/job-roles" className="hover:text-cyan-400 transition-colors">Data Analyst & Data Science</Link></li>
              <li><Link to="/job-roles" className="hover:text-cyan-400 transition-colors">Full-Stack & Frontend</Link></li>
              <li><Link to="/job-roles" className="hover:text-cyan-400 transition-colors">AI / ML Engineering</Link></li>
              <li><Link to="/job-roles" className="hover:text-cyan-400 transition-colors">Cloud & DevOps</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">Platform</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/about" className="hover:text-cyan-400 transition-colors">About & Methodology</Link></li>
              <li><Link to="/interview" className="hover:text-cyan-400 transition-colors">Interview Preparation</Link></li>
              <li><Link to="/history" className="hover:text-cyan-400 transition-colors">Analysis History</Link></li>
              <li><Link to="/settings" className="hover:text-cyan-400 transition-colors">API Keys & Settings</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div className="flex items-center gap-1.5">
            <span>Built with deterministic algorithms & AI intelligence</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:text-slate-300">Methodology</Link>
            <Link to="/settings" className="hover:text-slate-300">Settings</Link>
            <span className="text-slate-500">v1.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
