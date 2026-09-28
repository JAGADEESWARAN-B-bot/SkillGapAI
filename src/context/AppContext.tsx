import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  UserSkill,
  TargetRole,
  SkillGapAnalysisResult,
  RoadmapItem,
  AnalysisRecord,
} from '../types';
import { INITIAL_TARGET_ROLES } from '../data/rolesData';
import { calculateSkillGap, generateRoadmapForRole } from '../utils/calculator';

interface AppContextType {
  user: { email: string; name: string } | null;
  profile: UserProfile;
  skills: UserSkill[];
  targetRoles: TargetRole[];
  selectedRoleId: string;
  analysis: SkillGapAnalysisResult;
  roadmap: RoadmapItem[];
  history: AnalysisRecord[];
  simulatedSkills: string[];
  geminiApiKey: string;
  setGeminiApiKey: (key: string) => void;
  setUser: (user: { email: string; name: string } | null) => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  addSkill: (skill: Omit<UserSkill, 'id'>) => void;
  updateSkill: (id: string, skill: Partial<UserSkill>) => void;
  deleteSkill: (id: string) => void;
  bulkAddSkills: (newSkills: UserSkill[]) => void;
  setSelectedRoleId: (roleId: string) => void;
  addCustomRole: (role: TargetRole) => void;
  toggleSimulatedSkill: (skillName: string) => void;
  clearSimulatedSkills: () => void;
  updateRoadmapItemStatus: (id: string, status: RoadmapItem['status']) => void;
  runAndSaveAnalysis: () => void;
  loadDemoData: () => void;
  clearAllData: () => void;
}

const DEFAULT_PROFILE: UserProfile = {
  name: 'Alex Rivera',
  email: 'alex.rivera@example.com',
  course: 'Computer Science & Engineering',
  department: 'Information Technology',
  yearOfStudy: 'Final Year (2025)',
  institution: 'State Technical University',
  careerGoal: 'Secure a full-time role as a Data Analyst or Software Engineer at an innovative technology firm.',
  targetRoleId: 'data-analyst',
  experienceLevel: 'Fresher',
  githubUrl: 'https://github.com/alexrivera-data',
  linkedinUrl: 'https://linkedin.com/in/alexrivera-tech',
};

const DEFAULT_SKILLS: UserSkill[] = [
  { id: 'sk-1', name: 'SQL', category: 'Database', proficiency: 'ADVANCED', monthsOfExperience: 18 },
  { id: 'sk-2', name: 'Python', category: 'Programming', proficiency: 'INTERMEDIATE', monthsOfExperience: 14 },
  { id: 'sk-3', name: 'Excel', category: 'Tools', proficiency: 'ADVANCED', monthsOfExperience: 24 },
  { id: 'sk-4', name: 'Git', category: 'Tools', proficiency: 'BEGINNER', monthsOfExperience: 6 },
  { id: 'sk-5', name: 'Communication', category: 'Soft Skills', proficiency: 'INTERMEDIATE', monthsOfExperience: 24 },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ email: string; name: string } | null>(() => {
    const saved = localStorage.getItem('skillgap_auth_user');
    return saved ? JSON.parse(saved) : { email: 'alex.rivera@example.com', name: 'Alex Rivera' };
  });

  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('skillgap_user_profile');
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
  });

  const [skills, setSkills] = useState<UserSkill[]>(() => {
    const saved = localStorage.getItem('skillgap_user_skills');
    return saved ? JSON.parse(saved) : DEFAULT_SKILLS;
  });

  const [targetRoles, setTargetRoles] = useState<TargetRole[]>(() => {
    const saved = localStorage.getItem('skillgap_target_roles');
    return saved ? JSON.parse(saved) : INITIAL_TARGET_ROLES;
  });

  const [selectedRoleId, setSelectedRoleIdState] = useState<string>(() => {
    return localStorage.getItem('skillgap_selected_role_id') || 'data-analyst';
  });

  const [simulatedSkills, setSimulatedSkills] = useState<string[]>([]);
  const [history, setHistory] = useState<AnalysisRecord[]>(() => {
    const saved = localStorage.getItem('skillgap_analysis_history');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'hist-1',
        timestamp: new Date(Date.now() - 7 * 86400000).toISOString(),
        roleId: 'data-analyst',
        roleTitle: 'Data Analyst',
        coveragePercent: 48,
        gapPercent: 52,
        matchedCount: 3,
        missingCount: 6,
        topPriorityMissing: ['Power BI', 'Pandas', 'Data Visualization'],
      },
    ];
  });

  const [geminiApiKey, setGeminiApiKey] = useState<string>(() => {
    return localStorage.getItem('skillgap_gemini_api_key') || '';
  });

  // Calculate current analysis reactively
  const currentRole =
    targetRoles.find((r) => r.id === selectedRoleId) ||
    targetRoles[0] ||
    INITIAL_TARGET_ROLES[0];

  const analysis = calculateSkillGap(skills, currentRole, simulatedSkills);

  const [roadmap, setRoadmap] = useState<RoadmapItem[]>(() => {
    const saved = localStorage.getItem(`skillgap_roadmap_${selectedRoleId}`);
    if (saved) return JSON.parse(saved);
    return generateRoadmapForRole(analysis, currentRole);
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('skillgap_user_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('skillgap_user_skills', JSON.stringify(skills));
  }, [skills]);

  useEffect(() => {
    localStorage.setItem('skillgap_selected_role_id', selectedRoleId);
    const newRoadmap = generateRoadmapForRole(analysis, currentRole);
    setRoadmap(newRoadmap);
  }, [selectedRoleId]);

  useEffect(() => {
    localStorage.setItem('skillgap_analysis_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('skillgap_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('skillgap_auth_user');
    }
  }, [user]);

  const updateProfile = (newProps: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...newProps }));
  };

  const addSkill = (newSkill: Omit<UserSkill, 'id'>) => {
    const skill: UserSkill = {
      ...newSkill,
      id: `sk-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };
    setSkills((prev) => [...prev, skill]);
  };

  const updateSkill = (id: string, updated: Partial<UserSkill>) => {
    setSkills((prev) => prev.map((s) => (s.id === id ? { ...s, ...updated } : s)));
  };

  const deleteSkill = (id: string) => {
    setSkills((prev) => prev.filter((s) => s.id !== id));
  };

  const bulkAddSkills = (newSkills: UserSkill[]) => {
    setSkills((prev) => {
      const existingNames = new Set(prev.map((s) => s.name.toLowerCase()));
      const filtered = newSkills.filter((s) => !existingNames.has(s.name.toLowerCase()));
      return [...prev, ...filtered];
    });
  };

  const setSelectedRoleId = (roleId: string) => {
    setSelectedRoleIdState(roleId);
  };

  const addCustomRole = (role: TargetRole) => {
    setTargetRoles((prev) => [role, ...prev]);
    setSelectedRoleIdState(role.id);
  };

  const toggleSimulatedSkill = (skillName: string) => {
    setSimulatedSkills((prev) => {
      if (prev.includes(skillName)) {
        return prev.filter((s) => s !== skillName);
      }
      return [...prev, skillName];
    });
  };

  const clearSimulatedSkills = () => {
    setSimulatedSkills([]);
  };

  const updateRoadmapItemStatus = (id: string, status: RoadmapItem['status']) => {
    setRoadmap((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          // If completed, add to user skills!
          if (status === 'COMPLETED' && item.status !== 'COMPLETED') {
            const alreadyHas = skills.some(
              (s) => s.name.toLowerCase() === item.skillName.toLowerCase()
            );
            if (!alreadyHas) {
              addSkill({
                name: item.skillName,
                category: item.category,
                proficiency: 'INTERMEDIATE',
                monthsOfExperience: 3,
              });
            }
          }
          return { ...item, status };
        }
        return item;
      })
    );
  };

  const runAndSaveAnalysis = () => {
    const record: AnalysisRecord = {
      id: `hist-${Date.now()}`,
      timestamp: new Date().toISOString(),
      roleId: currentRole.id,
      roleTitle: currentRole.title,
      coveragePercent: analysis.coveragePercent,
      gapPercent: analysis.gapPercent,
      matchedCount: analysis.matchedCount,
      missingCount: analysis.missingCount,
      topPriorityMissing: analysis.topPriorityMissing,
    };
    setHistory((prev) => [record, ...prev.slice(0, 20)]);
  };

  const loadDemoData = () => {
    setProfile(DEFAULT_PROFILE);
    setSkills(DEFAULT_SKILLS);
    setSelectedRoleIdState('data-analyst');
    setSimulatedSkills([]);
  };

  const clearAllData = () => {
    setSkills([]);
    setHistory([]);
    setSimulatedSkills([]);
    localStorage.clear();
  };

  return (
    <AppContext.Provider
      value={{
        user,
        profile,
        skills,
        targetRoles,
        selectedRoleId,
        analysis,
        roadmap,
        history,
        simulatedSkills,
        geminiApiKey,
        setGeminiApiKey: (key: string) => {
          setGeminiApiKey(key);
          localStorage.setItem('skillgap_gemini_api_key', key);
        },
        setUser,
        updateProfile,
        addSkill,
        updateSkill,
        deleteSkill,
        bulkAddSkills,
        setSelectedRoleId,
        addCustomRole,
        toggleSimulatedSkill,
        clearSimulatedSkills,
        updateRoadmapItemStatus,
        runAndSaveAnalysis,
        loadDemoData,
        clearAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
