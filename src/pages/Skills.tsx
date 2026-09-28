import React, { useState } from 'react';
import {
  BrainCircuit,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit2,
  Check,
  X,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserSkill, SkillCategory, ProficiencyLevel } from '../types';
import { SkillBadge } from '../components/SkillBadge';
import { Link } from 'react-router-dom';

const CATEGORIES: SkillCategory[] = [
  'Programming',
  'Frontend',
  'Backend',
  'Database',
  'Data & AI',
  'Cloud & DevOps',
  'Mobile',
  'Security',
  'Soft Skills',
  'Tools',
];

const PROFICIENCIES: ProficiencyLevel[] = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'];

export const Skills: React.FC = () => {
  const { skills, addSkill, updateSkill, deleteSkill } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Add form state
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<SkillCategory>('Programming');
  const [newProficiency, setNewProficiency] = useState<ProficiencyLevel>('INTERMEDIATE');
  const [newMonths, setNewMonths] = useState(12);

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editProficiency, setEditProficiency] = useState<ProficiencyLevel>('INTERMEDIATE');
  const [editMonths, setEditMonths] = useState(12);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    addSkill({
      name: newName.trim(),
      category: newCategory,
      proficiency: newProficiency,
      monthsOfExperience: Number(newMonths) || 6,
    });

    setNewName('');
    setIsAdding(false);
  };

  const startEdit = (s: UserSkill) => {
    setEditingId(s.id);
    setEditProficiency(s.proficiency);
    setEditMonths(s.monthsOfExperience);
  };

  const saveEdit = (id: string) => {
    updateSkill(id, {
      proficiency: editProficiency,
      monthsOfExperience: editMonths,
    });
    setEditingId(null);
  };

  const filteredSkills = skills.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || s.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2.5">
            <BrainCircuit className="w-7 h-7 text-cyan-400" />
            <span>My Current Competencies</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage your verified skills and proficiency levels for accurate gap benchmark calculations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/resume"
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Import From Resume</span>
          </Link>

          <button
            onClick={() => setIsAdding(true)}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Skill</span>
          </button>
        </div>
      </div>

      {/* Add Skill Modal / Inline Panel */}
      {isAdding && (
        <form
          onSubmit={handleAddSubmit}
          className="bg-slate-900 border border-cyan-500/30 rounded-2xl p-6 shadow-xl space-y-4 animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-cyan-400" />
              <span>Add Verified Competency</span>
            </h3>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Skill Name</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Python, Docker, React"
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as SkillCategory)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Proficiency Tier</label>
              <select
                value={newProficiency}
                onChange={(e) => setNewProficiency(e.target.value as ProficiencyLevel)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                {PROFICIENCIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Months of Experience</label>
              <input
                type="number"
                min="1"
                max="120"
                value={newMonths}
                onChange={(e) => setNewMonths(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-cyan-500 text-slate-950 text-xs font-bold hover:bg-cyan-400"
            >
              Save Skill
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
            placeholder="Search my skills..."
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
            All ({skills.length})
          </button>
          {CATEGORIES.map((cat) => {
            const count = skills.filter((s) => s.category === cat).length;
            if (count === 0) return null;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-cyan-500 text-slate-950'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Skills Grid */}
      {filteredSkills.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 border border-slate-800 rounded-2xl space-y-3">
          <BrainCircuit className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-semibold text-white">No Skills Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {search
              ? 'No registered skills matched your query.'
              : 'Add your competencies or parse them from a resume to power the gap analyzer.'}
          </p>
          <button
            onClick={() => setIsAdding(true)}
            className="mt-2 px-4 py-2 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400"
          >
            Add Your First Skill
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSkills.map((s) => {
            const isEditing = editingId === s.id;
            return (
              <div
                key={s.id}
                className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition-colors"
              >
                {isEditing ? (
                  <div className="space-y-3">
                    <div className="font-bold text-sm text-white">{s.name}</div>
                    <div className="space-y-1">
                      <label className="text-[11px] text-slate-400">Proficiency</label>
                      <select
                        value={editProficiency}
                        onChange={(e) => setEditProficiency(e.target.value as ProficiencyLevel)}
                        className="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-xs text-white"
                      >
                        {PROFICIENCIES.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] text-slate-400">Months of Experience</label>
                      <input
                        type="number"
                        value={editMonths}
                        onChange={(e) => setEditMonths(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-xs text-white"
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        onClick={() => setEditingId(null)}
                        className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => saveEdit(s.id)}
                        className="p-1 rounded bg-emerald-600 text-white"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-white">{s.name}</span>
                        <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                          {s.category}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            s.proficiency === 'EXPERT'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : s.proficiency === 'ADVANCED'
                              ? 'bg-blue-950 text-blue-400 border border-blue-800'
                              : s.proficiency === 'INTERMEDIATE'
                              ? 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {s.proficiency}
                        </span>
                        <span className="text-xs text-slate-400">
                          {s.monthsOfExperience} mos experience
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-1.5 pt-3 mt-3 border-t border-slate-800/80">
                      <button
                        onClick={() => startEdit(s)}
                        title="Edit Proficiency"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteSkill(s.id)}
                        title="Delete Skill"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
