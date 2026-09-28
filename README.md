# SkillGap AI – Career Skill Gap Analyzer

> **"Know Your Skill Gap. Build Your Career."**  
> An AI-powered Career Intelligence and Skill Gap Analyzer designed for students and fresh graduates to discover missing competencies, benchmark against industry requirements, calculate deterministic readiness scores, and follow personalized learning roadmaps.

---

## 1. Project Objective

SkillGap AI eliminates guesswork in career preparation. By comparing a student's current skill profile or extracted resume content against real-world job roles (Data Analyst, Frontend, Backend, AI/ML, Cloud, etc.), the application calculates transparent, deterministic skill-coverage and skill-gap percentages, formulates topological learning roadmaps with prerequisite dependencies, recommends targeted portfolio projects, and provides comprehensive technical interview preparation.

---

## 2. Key Features

- **User Authentication & Profile**: Academic tracking (Course, Department, Year, University, Career Goals, Experience Level, LinkedIn, GitHub).
- **Competency Management**: Add, edit, delete, search, filter, and sort technical and soft skills across 10 categories with 4 proficiency tiers (Beginner, Intermediate, Advanced, Expert).
- **Target Career Roles**: 14 predefined structured industry roles + custom career role builder with weighted competency requirements.
- **Resume Skill Extractor**: Keyword boundary scanning & alias normalization (e.g. `JS` &rarr; `JavaScript`, `ReactJS` &rarr; `React`, `PostgreSQL DB` &rarr; `PostgreSQL`) with 1-click profile import.
- **Deterministic Skill Gap Calculation**:
  $$\text{Coverage \%} = \left(\frac{\sum \text{Earned Weights}}{\sum \text{Total Required Weights}}\right) \times 100$$
  $$\text{Skill Gap \%} = 100\% - \text{Coverage \%}$$
  - Fully Matched: $1.0\times$ credit
  - Partially Matched: $0.5\times$ credit
  - Missing: $0.0\times$ credit
- **What-If Skill Simulator**: Interactive forecasting allowing students to select missing skills and instantly recalculate projected coverage jumps and gap reductions.
- **Personalized Phased Learning Roadmap**: 5-phase progressive milestones (Foundations, Core Engineering, Applied Systems, Production Polish, Capstone Portfolio) with interactive completion tracking that syncs directly back to user skills.
- **Recommended Portfolio Projects**: Hands-on projects dynamically prioritized to address the student's specific missing skills.
- **Interview Preparation**: Role-tailored technical questions, key concepts, model answers, follow-up prompts, practical coding tasks, and behavioral STAR method guides.
- **Analysis History**: SQLite / Room persistence storing analysis snapshots with readiness progress trend charts over time.
- **Gemini AI Integration with Fallback**: Gemini 3.5 Flash powers conversational career recommendations and interview tips. If Gemini API is unreachable or key is unconfigured, deterministic local logic seamlessly handles 100% of features without crashing.

---

## 3. Technology Stack

- **Framework**: Android Native (Kotlin) with Jetpack Compose & Material 3 Design
- **Local Persistence**: Android Jetpack Room Database (SQLite) with reactive Kotlin Coroutines & `StateFlow`
- **Networking**: OkHttp 4.10 with 60-second timeouts & Retrofit
- **AI Engine**: Google Gemini API (`gemini-3.5-flash`) via secure REST with fallback logic
- **Charts & Visualization**: Compose Canvas Vector Charts (Donut Gauge, Multi-Segment Progress Bars, Trend Lines)
- **Navigation**: Jetpack Navigation Compose with Drawer, Bottom Bar, and Deep Linking

---

## 4. Database Schema (Room / PostgreSQL Compatible)

- `user_profile`: Candidate profile, academic standing, target role identifier, session flag.
- `user_skills`: Registered skills, category, proficiency level, months of experience.
- `target_roles`: Career benchmark roles with structured required skills and weights.
- `analysis_history`: Historical snapshots with coverage %, gap %, timestamp, and priority summaries.
- `roadmap_items`: Phased learning milestones, prerequisites, estimated effort, practice tasks, mini-projects, and status (`Not Started`, `Learning`, `Practicing`, `Completed`).

---

## 5. Environment Variables & Setup

Create or configure `.env` in the root directory:

```env
# Gemini API Key for AI career insights and interview tips
GEMINI_API_KEY=your_gemini_api_key_here
```

### Google AI Studio Secrets Panel
1. Open the **Secrets panel** in the AI Studio sidebar.
2. Add `GEMINI_API_KEY` with your Google AI Studio API key.
3. The Gradle Secrets plugin automatically injects this into `BuildConfig.GEMINI_API_KEY` at build time.

---

## 6. Building and Running

### Android Build
```bash
gradle assembleDebug
```

### Vercel / Web Deployment Configuration
This repository includes `vercel.json` with SPA wildcard rewrite rules (`/(.*) -> /index.html`) to ensure 404-safe routing when hosting documentation or web companion exports.
