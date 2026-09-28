import {
  UserSkill,
  TargetRole,
  ProficiencyLevel,
  SkillComparisonItem,
  SkillGapAnalysisResult,
  CategorySummary,
  RoadmapItem,
  SkillCategory,
  MatchStatus,
  PriorityLevel,
} from '../types';

const PROFICIENCY_RANKS: Record<ProficiencyLevel, number> = {
  BEGINNER: 1,
  INTERMEDIATE: 2,
  ADVANCED: 3,
  EXPERT: 4,
};

const SKILL_ALIASES: Record<string, string> = {
  js: 'JavaScript',
  javascript: 'JavaScript',
  ts: 'TypeScript',
  typescript: 'TypeScript',
  py: 'Python',
  python: 'Python',
  react: 'React',
  reactjs: 'React',
  'react.js': 'React',
  node: 'Node.js',
  nodejs: 'Node.js',
  'node.js': 'Node.js',
  postgres: 'PostgreSQL',
  postgresql: 'PostgreSQL',
  sql: 'SQL',
  'power bi': 'Power BI',
  powerbi: 'Power BI',
  k8s: 'Kubernetes',
  kubernetes: 'Kubernetes',
  docker: 'Docker',
  aws: 'AWS',
  gcp: 'Google Cloud',
  azure: 'Azure',
  html: 'HTML5',
  html5: 'HTML5',
  css: 'CSS3',
  css3: 'CSS3',
  tailwind: 'Tailwind CSS',
  tailwindcss: 'Tailwind CSS',
  git: 'Git',
  github: 'Git',
  pandas: 'Pandas',
  numpy: 'NumPy',
  pytorch: 'PyTorch',
  tensorflow: 'TensorFlow',
  fastapi: 'FastAPI',
  django: 'Django',
  flask: 'Flask',
  express: 'Express',
  figma: 'Figma',
  linux: 'Linux',
};

export function normalizeSkillName(name: string): string {
  const clean = name.trim().toLowerCase();
  return SKILL_ALIASES[clean] || name.trim();
}

export function calculateSkillGap(
  userSkills: UserSkill[],
  targetRole: TargetRole,
  hypotheticalSkills?: string[] // For What-If simulator
): SkillGapAnalysisResult {
  const userSkillMap = new Map<string, UserSkill>();
  for (const s of userSkills) {
    userSkillMap.set(normalizeSkillName(s.name).toLowerCase(), s);
  }

  // Include hypothetical skills with INTERMEDIATE level
  const simulatedNames = new Set(
    (hypotheticalSkills || []).map((h) => normalizeSkillName(h).toLowerCase())
  );

  let totalEarnedScore = 0;
  let maxPossibleScore = 0;
  let matchedCount = 0;
  let partialCount = 0;
  let missingCount = 0;

  const comparisonItems: SkillComparisonItem[] = [];
  const categoryMap = new Map<SkillCategory, { earned: number; total: number }>();

  for (const req of targetRole.requiredSkills) {
    const reqNormalized = normalizeSkillName(req.name).toLowerCase();
    const existing = userSkillMap.get(reqNormalized);
    const isSimulated = simulatedNames.has(reqNormalized);

    const maxScore = req.weight * 10;
    maxPossibleScore += maxScore;

    let status: MatchStatus = 'MISSING';
    let earned = 0;
    let userProf: ProficiencyLevel | undefined = undefined;

    if (existing) {
      userProf = existing.proficiency;
      const userRank = PROFICIENCY_RANKS[existing.proficiency] || 1;
      const reqRank = PROFICIENCY_RANKS[req.minProficiency] || 1;

      if (userRank >= reqRank) {
        status = 'FULLY_MATCHED';
        earned = maxScore;
        matchedCount++;
      } else {
        status = 'PARTIALLY_MATCHED';
        earned = Math.round(maxScore * 0.5);
        partialCount++;
      }
    } else if (isSimulated) {
      status = 'FULLY_MATCHED';
      earned = maxScore;
      matchedCount++;
      userProf = 'INTERMEDIATE';
    } else {
      status = 'MISSING';
      earned = 0;
      missingCount++;
    }

    totalEarnedScore += earned;

    // Determine priority
    let priority: PriorityLevel = 'LOW';
    if (status === 'MISSING') {
      if (req.isCore && req.weight >= 4) {
        priority = 'CRITICAL';
      } else if (req.weight >= 4 || req.isCore) {
        priority = 'HIGH';
      } else {
        priority = 'MEDIUM';
      }
    } else if (status === 'PARTIALLY_MATCHED') {
      priority = req.isCore ? 'HIGH' : 'MEDIUM';
    }

    comparisonItems.push({
      skillName: req.name,
      category: req.category,
      status,
      weight: req.weight,
      userProficiency: userProf,
      requiredProficiency: req.minProficiency,
      isCore: req.isCore,
      scoreEarned: earned,
      maxScore,
      priority,
    });

    // Accumulate category data
    const catData = categoryMap.get(req.category) || { earned: 0, total: 0 };
    catData.earned += earned;
    catData.total += maxScore;
    categoryMap.set(req.category, catData);
  }

  // Calculate percentages (strictly 0 to 100)
  const coveragePercent =
    maxPossibleScore > 0 ? Math.round((totalEarnedScore / maxPossibleScore) * 100) : 0;
  const gapPercent = Math.max(0, 100 - coveragePercent);

  // Category breakdown
  const categoryBreakdown: CategorySummary[] = Array.from(categoryMap.entries()).map(
    ([category, data]) => ({
      category,
      earned: data.earned,
      total: data.total,
      coverage: data.total > 0 ? Math.round((data.earned / data.total) * 100) : 0,
    })
  );

  // Top priority missing skills
  const topPriorityMissing = comparisonItems
    .filter((i) => i.status !== 'FULLY_MATCHED')
    .sort((a, b) => {
      const order = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
      return (order[b.priority] || 0) - (order[a.priority] || 0) || b.weight - a.weight;
    })
    .map((i) => i.skillName)
    .slice(0, 5);

  return {
    roleId: targetRole.id,
    roleTitle: targetRole.title,
    coveragePercent,
    gapPercent,
    totalEarnedScore,
    maxPossibleScore,
    matchedCount,
    partialCount,
    missingCount,
    totalSkillsCount: targetRole.requiredSkills.length,
    items: comparisonItems,
    categoryBreakdown,
    topPriorityMissing,
    calculatedAt: new Date().toISOString(),
  };
}

export function generateRoadmapForRole(
  analysis: SkillGapAnalysisResult,
  targetRole: TargetRole
): RoadmapItem[] {
  const missingItems = analysis.items.filter((item) => item.status !== 'FULLY_MATCHED');

  const roadmap: RoadmapItem[] = [];

  // Group into phases
  // Phase 1: Core Fundamentals & Tools (Git, Linux, Bash, Excel, Basic Syntax)
  // Phase 2: Core Engineering & Databases (SQL, PostgreSQL, Main Languages)
  // Phase 3: Applied Frameworks & Libraries (React, Pandas, FastAPI, Node)
  // Phase 4: Production & Deployment (Docker, AWS, Testing, CI/CD)
  // Phase 5: Advanced Optimization & Capstone (Performance, Architecture)

  let idCounter = 1;

  for (const item of missingItems) {
    let phase = 3;
    let phaseTitle = 'Phase 3: Applied Frameworks';
    let estHours = 20;
    let prerequisites: string[] = [];
    let practiceTask = `Build a hands-on exercise implementing ${item.skillName} in practice.`;

    const cat = item.category;
    const name = item.skillName.toLowerCase();

    if (name.includes('git') || name.includes('excel') || name.includes('linux')) {
      phase = 1;
      phaseTitle = 'Phase 1: Foundations & Essential Tooling';
      estHours = 10;
      practiceTask = `Set up a development repository and master core command line / workflow basics for ${item.skillName}.`;
    } else if (cat === 'Database' || name.includes('sql') || cat === 'Programming') {
      phase = 2;
      phaseTitle = 'Phase 2: Core Engineering & Data Storage';
      estHours = 25;
      prerequisites = phase > 1 ? ['Foundations & Logic'] : [];
      practiceTask = `Design a relational schema and write multi-table queries or procedural algorithms using ${item.skillName}.`;
    } else if (name.includes('docker') || name.includes('aws') || name.includes('ci/cd') || name.includes('kubernetes')) {
      phase = 4;
      phaseTitle = 'Phase 4: Cloud & Deployment Pipelines';
      estHours = 30;
      prerequisites = ['Backend/Frontend Application', 'Command Line'];
      practiceTask = `Containerize a sample application and deploy it via automated workflow using ${item.skillName}.`;
    } else {
      phase = 3;
      phaseTitle = 'Phase 3: Applied Frameworks & UI';
      estHours = 20;
      prerequisites = ['Core Programming Syntax'];
      practiceTask = `Build an end-to-end feature integrating ${item.skillName} with state management and API calls.`;
    }

    roadmap.push({
      id: `rm-${idCounter++}`,
      roleId: targetRole.id,
      phase,
      phaseTitle,
      skillName: item.skillName,
      category: item.category,
      importance: item.priority === 'CRITICAL' ? 'Essential' : item.priority === 'HIGH' ? 'High' : 'Recommended',
      estimatedHours: estHours,
      prerequisites,
      practiceTask,
      resources: [
        `Official Documentation: ${item.skillName}`,
        `Interactive Exercises & Free Tutorial: ${item.skillName} in 2026`,
      ],
      status: 'NOT_STARTED',
    });
  }

  // Sort by phase then importance
  roadmap.sort((a, b) => a.phase - b.phase);

  return roadmap;
}
