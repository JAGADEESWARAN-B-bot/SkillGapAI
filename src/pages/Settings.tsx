import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Key,
  Database,
  Trash2,
  RefreshCw,
  CheckCircle2,
  Shield,
  Info,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { isSupabaseConfigured } from '../services/supabaseClient';

export const Settings: React.FC = () => {
  const { geminiApiKey, setGeminiApiKey, loadDemoData, clearAllData } = useApp();

  const [inputKey, setInputKey] = useState(geminiApiKey);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    setGeminiApiKey(inputKey.trim());
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleResetDemo = () => {
    loadDemoData();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleFullClear = () => {
    clearAllData();
    setConfirmClear(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2.5">
          <SettingsIcon className="w-7 h-7 text-cyan-400" />
          <span>System Settings & Configuration</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Configure API credentials, inspect database status, and manage local persistence.
        </p>
      </div>

      {/* AI Credentials Configuration */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Key className="w-4 h-4 text-cyan-400" />
            <span>Google Gemini AI API Key</span>
          </h3>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded ${
              geminiApiKey
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            {geminiApiKey ? 'Configured' : 'Local Fallback Active'}
          </span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Gemini powers enhanced career coaching and dynamic interview explanations. If omitted, the application uses 100% deterministic local intelligence with zero downtime.
        </p>

        <form onSubmit={handleSaveKey} className="space-y-3">
          <input
            type="password"
            placeholder="AIzaSy..."
            value={inputKey}
            onChange={(e) => setInputKey(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
          />

          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-500">
              Keys are stored securely in your browser's private storage.
            </span>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all"
            >
              Save API Key
            </button>
          </div>
        </form>
      </div>

      {/* Database & Cloud Sync Status */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Database className="w-4 h-4 text-cyan-400" />
          <span>Storage & Cloud Sync Architecture</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
            <div className="text-slate-400 font-medium">Local Persistence:</div>
            <div className="text-emerald-400 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Browser LocalStorage (Active)</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Skills, custom roles, roadmap milestones, and analysis records persist across sessions.
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
            <div className="text-slate-400 font-medium">Supabase Cloud Sync:</div>
            <div
              className={`font-bold flex items-center gap-1.5 ${
                isSupabaseConfigured() ? 'text-emerald-400' : 'text-slate-400'
              }`}
            >
              <Info className="w-4 h-4" />
              <span>{isSupabaseConfigured() ? 'Connected' : 'Standalone Mode'}</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable remote PostgreSQL storage.
            </p>
          </div>
        </div>
      </div>

      {/* Demo & Data Management */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Data Management & Demo Seeds
        </h3>

        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={handleResetDemo}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <RefreshCw className="w-4 h-4 text-cyan-400" />
            <span>Load Demo Student Profile & Skills</span>
          </button>

          {!confirmClear ? (
            <button
              type="button"
              onClick={() => setConfirmClear(true)}
              className="px-4 py-2.5 rounded-xl bg-rose-950/60 hover:bg-rose-950 border border-rose-800 text-rose-300 text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <Trash2 className="w-4 h-4 text-rose-400" />
              <span>Clear All Local Data</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs text-rose-400 font-medium">Are you sure?</span>
              <button
                type="button"
                onClick={handleFullClear}
                className="px-3 py-1.5 rounded-lg bg-rose-600 text-white font-bold text-xs"
              >
                Yes, Reset All
              </button>
              <button
                type="button"
                onClick={() => setConfirmClear(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {savedSuccess && (
          <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>Action completed successfully!</span>
          </div>
        )}
      </div>
    </div>
  );
};
