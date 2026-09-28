package com.example.ai

import com.example.data.model.ProficiencyLevel
import com.example.data.model.SkillCategory
import com.example.data.model.UserSkill
import com.example.domain.SkillGapCalculator
import java.util.regex.Pattern

data class ExtractedResumeData(
    val detectedName: String?,
    val detectedEmail: String?,
    val detectedCollege: String?,
    val extractedSkills: List<UserSkill>,
    val rawMatchedTokens: List<String>
)

object ResumeSkillExtractor {

    // Comprehensive dictionary of tech keywords mapped to category & default proficiency
    private val keywordDictionary = mapOf(
        "python" to Pair("Python", SkillCategory.PROGRAMMING),
        "java" to Pair("Java", SkillCategory.PROGRAMMING),
        "javascript" to Pair("JavaScript", SkillCategory.PROGRAMMING),
        "typescript" to Pair("TypeScript", SkillCategory.PROGRAMMING),
        "kotlin" to Pair("Kotlin", SkillCategory.PROGRAMMING),
        "c++" to Pair("C++", SkillCategory.PROGRAMMING),
        "c#" to Pair("C#", SkillCategory.PROGRAMMING),
        "go" to Pair("Go", SkillCategory.PROGRAMMING),
        "golang" to Pair("Go", SkillCategory.PROGRAMMING),
        "rust" to Pair("Rust", SkillCategory.PROGRAMMING),
        "php" to Pair("PHP", SkillCategory.PROGRAMMING),
        "swift" to Pair("Swift", SkillCategory.PROGRAMMING),
        "r" to Pair("R", SkillCategory.DATA_AI),

        "react" to Pair("React", SkillCategory.FRONTEND),
        "reactjs" to Pair("React", SkillCategory.FRONTEND),
        "vue" to Pair("Vue.js", SkillCategory.FRONTEND),
        "angular" to Pair("Angular", SkillCategory.FRONTEND),
        "next.js" to Pair("Next.js", SkillCategory.FRONTEND),
        "nextjs" to Pair("Next.js", SkillCategory.FRONTEND),
        "html" to Pair("HTML", SkillCategory.FRONTEND),
        "html5" to Pair("HTML", SkillCategory.FRONTEND),
        "css" to Pair("CSS", SkillCategory.FRONTEND),
        "css3" to Pair("CSS", SkillCategory.FRONTEND),
        "tailwind" to Pair("Tailwind CSS", SkillCategory.FRONTEND),
        "bootstrap" to Pair("Bootstrap", SkillCategory.FRONTEND),
        "sass" to Pair("SASS/SCSS", SkillCategory.FRONTEND),

        "node.js" to Pair("Node.js", SkillCategory.BACKEND),
        "nodejs" to Pair("Node.js", SkillCategory.BACKEND),
        "express" to Pair("Express", SkillCategory.BACKEND),
        "django" to Pair("Django", SkillCategory.BACKEND),
        "fastapi" to Pair("FastAPI", SkillCategory.BACKEND),
        "flask" to Pair("Flask", SkillCategory.BACKEND),
        "spring boot" to Pair("Spring Boot", SkillCategory.BACKEND),
        "spring" to Pair("Spring Boot", SkillCategory.BACKEND),
        "rest api" to Pair("REST APIs", SkillCategory.BACKEND),
        "rest apis" to Pair("REST APIs", SkillCategory.BACKEND),
        "graphql" to Pair("GraphQL", SkillCategory.BACKEND),
        "microservices" to Pair("Microservices", SkillCategory.BACKEND),

        "sql" to Pair("SQL", SkillCategory.DATABASE),
        "mysql" to Pair("MySQL", SkillCategory.DATABASE),
        "postgresql" to Pair("PostgreSQL", SkillCategory.DATABASE),
        "postgres" to Pair("PostgreSQL", SkillCategory.DATABASE),
        "mongodb" to Pair("MongoDB", SkillCategory.DATABASE),
        "redis" to Pair("Redis", SkillCategory.DATABASE),
        "sqlite" to Pair("SQLite", SkillCategory.DATABASE),
        "oracle" to Pair("Oracle SQL", SkillCategory.DATABASE),

        "power bi" to Pair("Power BI", SkillCategory.DATA_AI),
        "powerbi" to Pair("Power BI", SkillCategory.DATA_AI),
        "tableau" to Pair("Tableau", SkillCategory.DATA_AI),
        "excel" to Pair("Excel", SkillCategory.TOOLS),
        "pandas" to Pair("Pandas", SkillCategory.DATA_AI),
        "numpy" to Pair("NumPy", SkillCategory.DATA_AI),
        "scikit-learn" to Pair("Scikit-Learn", SkillCategory.DATA_AI),
        "machine learning" to Pair("Machine Learning", SkillCategory.DATA_AI),
        "deep learning" to Pair("Deep Learning", SkillCategory.DATA_AI),
        "pytorch" to Pair("PyTorch", SkillCategory.DATA_AI),
        "tensorflow" to Pair("TensorFlow", SkillCategory.DATA_AI),
        "statistics" to Pair("Statistics", SkillCategory.DATA_AI),
        "data visualization" to Pair("Data Visualization", SkillCategory.DATA_AI),

        "aws" to Pair("AWS", SkillCategory.CLOUD_DEVOPS),
        "azure" to Pair("Azure", SkillCategory.CLOUD_DEVOPS),
        "gcp" to Pair("Google Cloud", SkillCategory.CLOUD_DEVOPS),
        "docker" to Pair("Docker", SkillCategory.CLOUD_DEVOPS),
        "kubernetes" to Pair("Kubernetes", SkillCategory.CLOUD_DEVOPS),
        "ci/cd" to Pair("CI/CD", SkillCategory.CLOUD_DEVOPS),
        "linux" to Pair("Linux", SkillCategory.TOOLS),
        "git" to Pair("Git", SkillCategory.TOOLS),
        "github" to Pair("Git", SkillCategory.TOOLS),

        "figma" to Pair("Figma", SkillCategory.DESIGN_UX),
        "wireframing" to Pair("Wireframing & Prototyping", SkillCategory.DESIGN_UX),
        "communication" to Pair("Communication", SkillCategory.SOFT_SKILLS),
        "problem solving" to Pair("Problem Solving", SkillCategory.SOFT_SKILLS),
        "leadership" to Pair("Leadership", SkillCategory.SOFT_SKILLS)
    )

    fun extractSkillsFromText(resumeText: String): ExtractedResumeData {
        val lowerText = " " + resumeText.lowercase() + " "
        val detectedSkills = mutableMapOf<String, UserSkill>()
        val matchedTokens = mutableListOf<String>()

        // 1. Keyword boundary search
        keywordDictionary.forEach { (keyword, skillInfo) ->
            val pattern = Pattern.compile("\\b" + Pattern.quote(keyword) + "\\b", Pattern.CASE_INSENSITIVE)
            val matcher = pattern.matcher(lowerText)
            if (matcher.find()) {
                val normalizedName = SkillGapCalculator.normalizeSkillName(skillInfo.first)
                matchedTokens.add(keyword)

                // Guess proficiency based on surrounding context like "advanced in", "experienced with", "years of"
                val prof = when {
                    lowerText.contains("expert in $keyword") || lowerText.contains("senior $keyword") -> ProficiencyLevel.EXPERT.displayName
                    lowerText.contains("advanced $keyword") || lowerText.contains("proficient in $keyword") -> ProficiencyLevel.ADVANCED.displayName
                    lowerText.contains("familiar with $keyword") || lowerText.contains("basic $keyword") -> ProficiencyLevel.BEGINNER.displayName
                    else -> ProficiencyLevel.INTERMEDIATE.displayName
                }

                if (!detectedSkills.containsKey(normalizedName)) {
                    detectedSkills[normalizedName] = UserSkill(
                        name = normalizedName,
                        category = skillInfo.second.displayName,
                        proficiency = prof,
                        experienceMonths = 12
                    )
                }
            }
        }

        // 2. Extract email regex
        val emailPattern = Pattern.compile("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}")
        val emailMatcher = emailPattern.matcher(resumeText)
        val email = if (emailMatcher.find()) emailMatcher.group() else null

        // 3. Extract Name heuristic (first capitalized line)
        val lines = resumeText.lines().map { it.trim() }.filter { it.isNotEmpty() }
        val nameCandidate = lines.firstOrNull { line ->
            line.length in 3..40 && !line.contains("@") && !line.contains("resume", ignoreCase = true)
        }

        return ExtractedResumeData(
            detectedName = nameCandidate,
            detectedEmail = email,
            detectedCollege = lines.find { it.contains("university", ignoreCase = true) || it.contains("institute", ignoreCase = true) || it.contains("college", ignoreCase = true) },
            extractedSkills = detectedSkills.values.toList(),
            rawMatchedTokens = matchedTokens
        )
    }

    val sampleResumeText = """
        ALEX CHEN
        alex.chen@university.edu | (555) 234-5678 | San Francisco, CA
        LinkedIn: linkedin.com/in/alexchen-dev | GitHub: github.com/alexchen

        EDUCATION
        B.Tech in Computer Science & Engineering
        National Institute of Technology, Graduating May 2025
        Relevant Coursework: Data Structures, Database Systems, Statistics, Machine Learning

        TECHNICAL SKILLS
        Programming: Python, JavaScript, Java, SQL, HTML, CSS
        Data & Analytics: Pandas, NumPy, Power BI, Excel, Data Visualization, Statistics
        Tools & Cloud: Git, GitHub, Docker, Linux, VS Code, Postman

        PROJECTS
        Retail Customer Analytics Platform
        - Analyzed over 50,000 retail sales transactions using SQL and Pandas to discover purchase patterns.
        - Built an interactive Power BI dashboard tracking monthly active users, revenue, and churn rate.
        - Cleaned dataset with missing values and outliers using statistical methods.

        Web Application for Student Mentorship
        - Developed full-stack prototype using React, Node.js, and PostgreSQL for relational user profiles.
        - Integrated REST APIs with JWT authentication.
    """.trimIndent()
}
