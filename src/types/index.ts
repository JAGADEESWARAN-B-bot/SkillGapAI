export type ProficiencyLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';

export type SkillCategory =
  | 'Programming'
  | 'Frontend'
  | 'Backend'
  | 'Database'
  | 'Data & AI'
  | 'Cloud & DevOps'
  | 'Mobile'
  | 'Security'
  | 'Soft Skills'
  | 'Tools';

export interface UserSkill {
  id: string;
  name: string;
  category: SkillCategory;
  proficiency: ProficiencyLevel;
  monthsOfExperience: number;
}

export interface RequiredSkill {
  name: string;
  category: SkillCategory;
  weight: number; // 1 to 5
  minProficiency: ProficiencyLevel;
  isCore: boolean;
}

export interface TargetRole {
  id: string;
  title: string;
  category: string;
  description: string;
  avgSalary: string;
  demandLevel: 'High' | 'Very High' | 'Moderate';
  requiredSkills: RequiredSkill[];
  isCustom?: boolean;
}

export type MatchStatus = 'FULLY_MATCHED' | 'PARTIALLY_MATCHED' | 'MISSING';
export type PriorityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface SkillComparisonItem {
  skillName: string;
  category: SkillCategory;
  status: MatchStatus;
  weight: number;
  userProficiency?: ProficiencyLevel;
  requiredProficiency: ProficiencyLevel;
  isCore: boolean;
  scoreEarned: number;
  maxScore: number;
  priority: PriorityLevel;
}

export interface CategorySummary {
  category: SkillCategory;
  earned: number;
  total: number;
  coverage: number;
}

export interface SkillGapAnalysisResult {
  roleId: string;
  roleTitle: string;
  coveragePercent: number;
  gapPercent: number;
  totalEarnedScore: number;
  maxPossibleScore: number;
  matchedCount: number;
  partialCount: number;
  missingCount: number;
  totalSkillsCount: number;
  items: SkillComparisonItem[];
  categoryBreakdown: CategorySummary[];
  topPriorityMissing: string[];
  calculatedAt: string;
}

export interface UserProfile {
  name: string;
  email: string;
  course: string;
  department: string;
  yearOfStudy: string;
  institution: string;
  careerGoal: string;
  targetRoleId: string;
  experienceLevel: 'Student' | 'Fresher' | '1-2 Years' | '3+ Years';
  githubUrl: string;
  linkedinUrl: string;
}

export interface RoadmapItem {
  id: string;
  roleId: string;
  phase: number;
  phaseTitle: string;
  skillName: string;
  category: SkillCategory;
  importance: 'Essential' | 'High' | 'Recommended';
  estimatedHours: number;
  prerequisites: string[];
  practiceTask: string;
  resources: string[];
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
}

export interface RecommendedProject {
  id: string;
  title: string;
  roleId: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  durationWeeks: number;
  coveredSkills: string[];
  description: string;
  architecture: string;
  deliverables: string[];
}

export interface InterviewQuestion {
  id: string;
  topic: string;
  difficulty: 'Junior' | 'Mid' | 'Senior';
  question: string;
  answerSummary: string;
  keyConcepts: string[];
  codeSnippet?: string;
  category: 'Technical' | 'Conceptual' | 'Coding Challenge' | 'Behavioral';
}

export interface AnalysisRecord {
  id: string;
  timestamp: string;
  roleId: string;
  roleTitle: string;
  coveragePercent: number;
  gapPercent: number;
  matchedCount: number;
  missingCount: number;
  topPriorityMissing: string[];
}
