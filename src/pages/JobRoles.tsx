import React, { useState } from 'react';
import {
  Briefcase,
  Search,
  Plus,
  CheckCircle2,
  X,
  Target,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TargetRole, SkillCategory, ProficiencyLevel } from '../types';
import { SkillBadge } from '../components/SkillBadge';
import { useNavigate } from 'react-router-dom';

export const JobRoles: React.FC = () => {
  const { targetRoles, selectedRoleId, setSelectedRoleId, addCustomRole } = useApp();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Custom role creator state
  const [isCreating, setIsCreating] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customCategory, setCustomCategory] = useState('Engineering');
  const [customDescription, setCustomDescription] = useState('');
  const [customSalary, setCustomSalary] = useState('$80,000 - $110,000');
  const [customSkillInput, setCustomSkillInput] = useState('');

  const handleCreateCustomRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim()) return;

    const skills = customSkillInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((name) => ({
        name,
        category: 'Programming' as SkillCategory,
        weight: 4,
        minProficiency: 'INTERMEDIATE' as ProficiencyLevel,
        isCore: true,
      }));

    if (skills.length === 0) {
      skills.push({
        name: 'Core Skills',
        category: 'Programming',
        weight: 5,
        minProficiency: 'INTERMEDIATE',
        isCore: true,
      });
    }

    const newRole: TargetRole = {
      id: `custom-${Date.now()}`,
      title: customTitle.trim(),
      category: customCategory,
      description: customDescription || 'Custom target role configured by user.',
      avgSalary: customSalary,
      demandLevel: 'High',
      requiredSkills: skills,
      isCustom: true,
    };

    addCustomRole(newRole);
    setIsCreating(false);
    setCustomTitle('');
    setCustomSkillInput('');
  };

  const categories = Array.from(new Set(targetRoles.map((r) => r.category)));

  const filteredRoles = targetRoles.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.requiredSkills.some((s) => s.name.toLowerCase().includes(search.toLowerCase()));
    const matchesCat = selectedCategory === 'ALL' || r.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2.5">
            <Briefcase className="w-7 h-7 text-cyan-400" />
            <span>Target Career Roles</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Choose from curated industry role blueprints or create your own custom career profile.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Custom Role</span>
        </button>
      </div>

      {/* Custom Role Creation Modal */}
      {isCreating && (
        <form
          onSubmit={handleCreateCustomRole}
          className="bg-slate-900 border border-cyan-500/30 rounded-2xl p-6 shadow-xl space-y-4 animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-cyan-400" />
              <span>Define Custom Career Role</span>
            </h3>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Role Title</label>
              <input
                type="text"
                placeholder="e.g. Solutions Architect"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Category</label>
              <input
                type="text"
                placeholder="e.g. Cloud & DevOps"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Average Salary Range</label>
              <input
                type="text"
                placeholder="e.g. $95,000 - $130,000"
                value={customSalary}
                onChange={(e) => setCustomSalary(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">
              Required Skills (comma separated)
            </label>
            <input
              type="text"
              placeholder="e.g. Python, Docker, AWS, PostgreSQL, Terraform"
              value={customSkillInput}
              onChange={(e) => setCustomSkillInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-cyan-500 text-slate-950 text-xs font-bold hover:bg-cyan-400"
            >
              Save & Benchmark
            </button>
          </div>
        </form>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search roles or skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === 'ALL'
                ? 'bg-cyan-500 text-slate-950'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            All Roles ({targetRoles.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-cyan-500 text-slate-950'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRoles.map((role) => {
          const isSelected = selectedRoleId === role.id;
          return (
            <div
              key={role.id}
              className={`bg-slate-900/70 border rounded-2xl p-6 flex flex-col justify-between transition-all ${
                isSelected
                  ? 'border-cyan-500 shadow-xl shadow-cyan-500/10'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-cyan-400">
                    {role.category}
                  </span>
                  <span className="text-xs font-semibold text-emerald-400">{role.avgSalary}</span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>{role.title}</span>
                    {isSelected && (
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
                        Active
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-3">
                    {role.description}
                  </p>
                </div>

                {/* Skills tags */}
                <div className="space-y-1.5 pt-2">
                  <span className="text-[11px] font-semibold text-slate-400 block">
                    Key Competencies ({role.requiredSkills.length}):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {role.requiredSkills.slice(0, 6).map((req) => (
                      <span
                        key={req.name}
                        className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800"
                      >
                        {req.name}
                      </span>
                    ))}
                    {role.requiredSkills.length > 6 && (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-950 text-slate-500">
                        +{role.requiredSkills.length - 6} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-slate-800/80 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRoleId(role.id);
                    navigate('/analyze');
                  }}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                    isSelected
                      ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                >
                  <Target className="w-3.5 h-3.5" />
                  <span>{isSelected ? 'View Gap Analysis' : 'Benchmark This Role'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
