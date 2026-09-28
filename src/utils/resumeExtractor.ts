import { UserSkill, SkillCategory, ProficiencyLevel } from '../types';

interface ExtractedResumeData {
  candidateName?: string;
  email?: string;
  phone?: string;
  education?: string;
  detectedSkills: UserSkill[];
  rawText: string;
}

const KNOWN_SKILL_KEYWORDS: {
  keyword: string;
  name: string;
  category: SkillCategory;
  defaultProficiency: ProficiencyLevel;
}[] = [
  // Programming
  { keyword: '\\bpython\\b', name: 'Python', category: 'Programming', defaultProficiency: 'INTERMEDIATE' },
  { keyword: '\\bjavascript\\b|\\bjs\\b', name: 'JavaScript', category: 'Programming', defaultProficiency: 'INTERMEDIATE' },
  { keyword: '\\btypescript\\b|\\bts\\b', name: 'TypeScript', category: 'Programming', defaultProficiency: 'INTERMEDIATE' },
  { keyword: '\\bjava\\b', name: 'Java', category: 'Programming', defaultProficiency: 'INTERMEDIATE' },
  { keyword: '\\bc\\+\\+\\b', name: 'C++', category: 'Programming', defaultProficiency: 'INTERMEDIATE' },
  { keyword: '\\bkotlin\\b', name: 'Kotlin', category: 'Programming', defaultProficiency: 'INTERMEDIATE' },
  { keyword: '\\bbash\\b|\\bshell\\b', name: 'Bash', category: 'Programming', defaultProficiency: 'BEGINNER' },

  // Frontend
  { keyword: '\\breact\\b|\\breactjs\\b', name: 'React', category: 'Frontend', defaultProficiency: 'INTERMEDIATE' },
  { keyword: '\\bnext\\.?js\\b', name: 'Next.js', category: 'Frontend', defaultProficiency: 'INTERMEDIATE' },
  { keyword: '\\bhtml5?\\b', name: 'HTML5', category: 'Frontend', defaultProficiency: 'ADVANCED' },
  { keyword: '\\bcss3?\\b', name: 'CSS3', category: 'Frontend', defaultProficiency: 'ADVANCED' },
  { keyword: '\\btailwind(css)?\\b', name: 'Tailwind CSS', category: 'Frontend', defaultProficiency: 'INTERMEDIATE' },
  { keyword: '\\bvue(\\.js)?\\b', name: 'Vue.js', category: 'Frontend', defaultProficiency: 'INTERMEDIATE' },

  // Backend
  { keyword: '\\bnode(\\.js)?\\b', name: 'Node.js', category: 'Backend', defaultProficiency: 'INTERMEDIATE' },
  { keyword: '\\bexpress(\\.js)?\\b', name: 'Express', category: 'Backend', defaultProficiency: 'INTERMEDIATE' },
  { keyword: '\\bfastapi\\b', name: 'FastAPI', category: 'Backend', defaultProficiency: 'INTERMEDIATE' },
  { keyword: '\\bdjango\\b', name: 'Django', category: 'Backend', defaultProficiency: 'INTERMEDIATE' },
  { keyword: '\\bspring\\s*boot\\b', name: 'Spring Boot', category: 'Backend', defaultProficiency: 'INTERMEDIATE' },
  { keyword: '\\brest(ful)?\\s*apis?\\b|\\brest\\b', name: 'REST APIs', category: 'Backend', defaultProficiency: 'INTERMEDIATE' },

  // Database
  { keyword: '\\bsql\\b', name: 'SQL', category: 'Database', defaultProficiency: 'INTERMEDIATE' },
  { keyword: '\\bpostgres(ql)?\\b', name: 'PostgreSQL', category: 'Database', defaultProficiency: 'INTERMEDIATE' },
  { keyword: '\\bmongo(db)?\\b', name: 'MongoDB', category: 'Database', defaultProficiency: 'INTERMEDIATE' },
  { keyword: '\\bmysql\\b', name: 'MySQL', category: 'Database', defaultProficiency: 'INTERMEDIATE' },
  { keyword: '\\bredis\\b', name: 'Redis', category: 'Database', defaultProficiency: 'BEGINNER' },

  // Data & AI
  { keyword: '\\bpandas\\b', name: 'Pandas', category: 'Data & AI', defaultProficiency: 'INTERMEDIATE' },
  { keyword: '\\bnumpy\\b', name: 'NumPy', category: 'Data & AI', defaultProficiency: 'INTERMEDIATE' },
  { keyword: '\\bpower\\s*bi\\b', name: 'Power BI', category: 'Data & AI', defaultProficiency: 'INTERMEDIATE' },
  { keyword: '\\btableau\\b', name: 'Tableau', category: 'Data & AI', defaultProficiency: 'BEGINNER' },
  { keyword: '\\bmachine\\s*learning\\b|\\bml\\b', name: 'Machine Learning', category: 'Data & AI', defaultProficiency: 'INTERMEDIATE' },
  { keyword: '\\bpytorch\\b', name: 'PyTorch', category: 'Data & AI', defaultProficiency: 'INTERMEDIATE' },
  { keyword: '\\btensorflow\\b', name: 'TensorFlow', category: 'Data & AI', defaultProficiency: 'INTERMEDIATE' },
  { keyword: '\\bscikit-learn\\b|\\bsklearn\\b', name: 'Scikit-Learn', category: 'Data & AI', defaultProficiency: 'INTERMEDIATE' },
  { keyword: '\\bdata\\s*visualization\\b', name: 'Data Visualization', category: 'Data & AI', defaultProficiency: 'INTERMEDIATE' },
  { keyword: '\\bstatistics\\b', name: 'Statistics', category: 'Data & AI', defaultProficiency: 'INTERMEDIATE' },

  // Cloud & DevOps
  { keyword: '\\bdocker\\b', name: 'Docker', category: 'Cloud & DevOps', defaultProficiency: 'BEGINNER' },
  { keyword: '\\bkubernetes\\b|\\bk8s\\b', name: 'Kubernetes', category: 'Cloud & DevOps', defaultProficiency: 'BEGINNER' },
  { keyword: '\\baws\\b|\\bamazon\\s*web\\s*services\\b', name: 'AWS', category: 'Cloud & DevOps', defaultProficiency: 'BEGINNER' },
  { keyword: '\\bci[/-]?cd\\b', name: 'CI/CD', category: 'Cloud & DevOps', defaultProficiency: 'BEGINNER' },
  { keyword: '\\blinux\\b', name: 'Linux', category: 'Tools', defaultProficiency: 'INTERMEDIATE' },

  // Tools & Soft Skills
  { keyword: '\\bgit\\b|\\bgithub\\b', name: 'Git', category: 'Tools', defaultProficiency: 'INTERMEDIATE' },
  { keyword: '\\bexcel\\b|\\bms\\s*excel\\b', name: 'Excel', category: 'Tools', defaultProficiency: 'ADVANCED' },
  { keyword: '\\bfigma\\b', name: 'Figma', category: 'Tools', defaultProficiency: 'INTERMEDIATE' },
  { keyword: '\\bcommunication\\b', name: 'Communication', category: 'Soft Skills', defaultProficiency: 'INTERMEDIATE' },
];

export function extractSkillsFromResume(text: string): ExtractedResumeData {
  const detectedSkills: UserSkill[] = [];
  const seenSkills = new Set<string>();

  // Extract Email
  const emailMatch = text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/);
  const email = emailMatch ? emailMatch[1] : undefined;

  // Extract Phone
  const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  const phone = phoneMatch ? phoneMatch[0] : undefined;

  // Extract Candidate Name heuristic (first line or line with name)
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  let candidateName = lines.length > 0 ? lines[0] : undefined;
  if (candidateName && candidateName.length > 50) {
    candidateName = candidateName.slice(0, 50);
  }

  // Scan for keywords
  for (const item of KNOWN_SKILL_KEYWORDS) {
    const regex = new RegExp(item.keyword, 'i');
    if (regex.test(text) && !seenSkills.has(item.name.toLowerCase())) {
      seenSkills.add(item.name.toLowerCase());
      detectedSkills.push({
        id: `extracted-${Date.now()}-${detectedSkills.length}`,
        name: item.name,
        category: item.category,
        proficiency: item.defaultProficiency,
        monthsOfExperience: 12,
      });
    }
  }

  return {
    candidateName,
    email,
    phone,
    detectedSkills,
    rawText: text,
  };
}

export const SAMPLE_RESUME_DATA_ANALYST = `Alex Rivera
Email: alex.rivera@example.com | Phone: (555) 349-2819
San Francisco, CA | LinkedIn: linkedin.com/in/alexrivera-data

CAREER OBJECTIVE
Enthusiastic Computer Science graduate seeking an entry-level Data Analyst position to apply data modeling, SQL queries, and interactive dashboard skills.

EDUCATION
B.S. in Computer Science & Data Analytics | University of California, Davis
Graduation: May 2025 | GPA: 3.82

TECHNICAL SKILLS
- Languages: Python, SQL (PostgreSQL, MySQL), R
- Data Tools: Pandas, NumPy, MS Excel (VLOOKUP, Pivot Tables), Power BI, Tableau
- Concepts: Data Visualization, Exploratory Data Analysis, Statistics, A/B Testing
- Developer Tools: Git, GitHub, Jupyter Notebooks

PROJECTS
E-Commerce Customer Retention & Sales Dashboard
- Extracted and cleaned 250,000+ orders from a PostgreSQL database using complex SQL queries and window functions.
- Built automated ETL scripts using Python (Pandas) to aggregate monthly recurring revenue and churn metrics.
- Designed an interactive Power BI dashboard featuring drill-down slicers, resulting in 15% better insight velocity.

Healthcare Patient Wait-Time Statistical Analysis
- Performed statistical hypothesis testing and probability distribution modeling on hospital admission logs.
- Visualized patient flow patterns with Seaborn and Matplotlib in Python.`;

export const SAMPLE_RESUME_FULLSTACK = `Jordan Chen
Email: jordan.chen@example.com | GitHub: github.com/jordanchen-dev
Austin, TX | Portfolio: jordanchen.dev

EDUCATION
B.S. in Software Engineering, University of Texas at Austin (2025)

TECHNICAL STACK
- Frontend: JavaScript (ES6+), TypeScript, React, HTML5, CSS3, Tailwind CSS, Next.js
- Backend: Node.js, Express, REST APIs, Python, FastAPI
- Databases: PostgreSQL, MongoDB, Redis
- DevOps & Tools: Git, GitHub Actions, Docker, Linux, Jest

EXPERIENCE & PROJECTS
Full-Stack Campus Marketplace App
- Developed a student exchange platform using React, TypeScript, and Tailwind CSS.
- Implemented authenticated REST APIs in Node.js & Express with JWT tokens and PostgreSQL relations.
- Containerized the services using Docker and configured continuous deployment on Vercel.`;
