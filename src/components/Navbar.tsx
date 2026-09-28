import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sparkles,
  LayoutDashboard,
  BrainCircuit,
  FileText,
  Briefcase,
  Target,
  Compass,
  FolderGit2,
  HelpCircle,
  History,
  Settings,
  Menu,
  X,
  User,
  ChevronDown,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { targetRoles, selectedRoleId, setSelectedRoleId, user } = useApp();

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Skills', path: '/skills', icon: BrainCircuit },
    { name: 'Resume', path: '/resume', icon: FileText },
    { name: 'Roles', path: '/job-roles', icon: Briefcase },
    { name: 'Analyze', path: '/analyze', icon: Target },
    { name: 'Roadmap', path: '/roadmap', icon: Compass },
    { name: 'Projects', path: '/projects', icon: FolderGit2 },
    { name: 'Interview', path: '/interview', icon: HelpCircle },
    { name: 'History', path: '/history', icon: History },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1.5">
                SKILLGAP <span className="text-cyan-400 font-bold">AI</span>
              </span>
              <span className="hidden sm:block text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                Career Intelligence
              </span>
            </div>
          </Link>

          {/* Target Role Selector in Nav */}
          <div className="hidden lg:flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-lg">
            <Target className="w-4 h-4 text-cyan-400" />
            <span className="text-xs text-slate-400 font-medium">Target Role:</span>
            <select
              value={selectedRoleId}
              onChange={(e) => setSelectedRoleId(e.target.value)}
              className="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer"
            >
              {targetRoles.map((role) => (
                <option key={role.id} value={role.id} className="bg-slate-900 text-white">
                  {role.title}
                </option>
              ))}
            </select>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right action icons */}
          <div className="hidden sm:flex items-center gap-2">
            <Link
              to="/settings"
              title="Settings"
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
            >
              <Settings className="w-4 h-4" />
            </Link>

            {user ? (
              <Link
                to="/profile"
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-medium text-slate-200 transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-[10px]">
                  {user.name.charAt(0)}
                </div>
                <span>{user.name.split(' ')[0]}</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="px-3 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-semibold text-xs hover:bg-cyan-400 transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950 px-4 pt-2 pb-6 space-y-2">
          {/* Target Role Selector in Mobile */}
          <div className="mb-3 p-3 bg-slate-900 rounded-lg border border-slate-800">
            <label className="block text-xs font-medium text-slate-400 mb-1">Active Target Role</label>
            <select
              value={selectedRoleId}
              onChange={(e) => {
                setSelectedRoleId(e.target.value);
                setMobileMenuOpen(false);
              }}
              className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-xs font-semibold text-white focus:outline-none"
            >
              {targetRoles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.title}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 p-2.5 rounded-lg text-xs font-medium ${
                    isActive
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                      : 'text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <Link
              to="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 text-xs font-medium text-slate-300"
            >
              <User className="w-4 h-4 text-cyan-400" />
              <span>Profile & Account</span>
            </Link>
            <Link
              to="/settings"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 text-xs font-medium text-slate-300"
            >
              <Settings className="w-4 h-4 text-cyan-400" />
              <span>Settings</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
