package com.example.domain

import com.example.data.model.AnalysisResult
import com.example.data.model.JobRole
import com.example.data.model.MatchStatus
import com.example.data.model.PriorityLevel
import com.example.data.model.ProficiencyLevel
import com.example.data.model.RequiredSkill
import com.example.data.model.SkillComparisonItem
import com.example.data.model.UserSkill
import java.util.Locale

object SkillGapCalculator {

    // Common abbreviations and aliases normalized to standard names
    private val skillAliases = mapOf(
        "js" to "JavaScript",
        "javascript" to "JavaScript",
        "ts" to "TypeScript",
        "typescript" to "TypeScript",
        "py" to "Python",
        "python" to "Python",
        "react" to "React",
        "reactjs" to "React",
        "react.js" to "React",
        "node" to "Node.js",
        "nodejs" to "Node.js",
        "node.js" to "Node.js",
        "postgres" to "PostgreSQL",
        "postgresql" to "PostgreSQL",
        "postgresql db" to "PostgreSQL",
        "mongo" to "MongoDB",
        "mongodb" to "MongoDB",
        "sql" to "SQL",
        "mysql" to "SQL",
        "ms sql" to "SQL",
        "power bi" to "Power BI",
        "powerbi" to "Power BI",
        "pbi" to "Power BI",
        "excel" to "Excel",
        "ms excel" to "Excel",
        "spreadsheets" to "Excel",
        "ml" to "Machine Learning",
        "machine learning" to "Machine Learning",
        "dl" to "Deep Learning",
        "deep learning" to "Deep Learning",
        "pytorch" to "PyTorch",
        "torch" to "PyTorch",
        "tensorflow" to "TensorFlow",
        "tf" to "TensorFlow",
        "aws" to "AWS",
        "amazon web services" to "AWS",
        "aws cloud" to "AWS",
        "k8s" to "Kubernetes",
        "kubernetes" to "Kubernetes",
        "docker" to "Docker",
        "git" to "Git",
        "github" to "Git",
        "html" to "HTML",
        "html5" to "HTML",
        "css" to "CSS",
        "css3" to "CSS",
        "tailwind" to "Tailwind CSS",
        "tailwind css" to "Tailwind CSS",
        "rest" to "REST APIs",
        "rest apis" to "REST APIs",
        "restful api" to "REST APIs",
        "rest api" to "REST APIs",
        "stats" to "Statistics",
        "statistics" to "Statistics",
        "data viz" to "Data Visualization",
        "data visualization" to "Data Visualization",
        "tableau" to "Data Visualization",
        "pandas" to "Pandas",
        "numpy" to "NumPy",
        "scikit-learn" to "Scikit-Learn",
        "sklearn" to "Scikit-Learn",
        "figma" to "Figma",
        "kotlin" to "Kotlin",
        "compose" to "Jetpack Compose",
        "jetpack compose" to "Jetpack Compose",
        "spring" to "Spring Boot",
        "spring boot" to "Spring Boot",
        "django" to "Django",
        "fastapi" to "FastAPI",
        "linux" to "Linux",
        "bash" to "Linux",
        "communication" to "Communication",
        "problem solving" to "Problem Solving"
    )

    fun normalizeSkillName(rawName: String): String {
        val trimmed = rawName.trim().lowercase(Locale.ROOT)
        return skillAliases[trimmed] ?: rawName.trim().split(" ")
            .joinToString(" ") { it.replaceFirstChar { char -> char.uppercase() } }
    }

    /**
     * Deterministic, transparent calculation of skill coverage and gap.
     */
    fun analyze(
        userSkills: List<UserSkill>,
        targetRole: JobRole
    ): AnalysisResult {
        // Map user skills by normalized lowercase key for swift lookup
        val userSkillMap = mutableMapOf<String, UserSkill>()
        userSkills.forEach { skill ->
            val normalized = normalizeSkillName(skill.name).lowercase(Locale.ROOT)
            userSkillMap[normalized] = skill
        }

        var totalWeight = 0.0
        var earnedWeight = 0.0

        var matchedCount = 0
        var partialCount = 0
        var missingCount = 0

        val comparisonItems = mutableListOf<SkillComparisonItem>()
        val matchedUserSkillKeys = mutableSetOf<String>()

        targetRole.requiredSkills.forEach { required ->
            val normReqName = normalizeSkillName(required.name)
            val key = normReqName.lowercase(Locale.ROOT)
            val userSkill = userSkillMap[key]

            val weight = required.importanceWeight
            totalWeight += weight

            val reqLevel = ProficiencyLevel.fromString(required.requiredLevel)
            val userLevel = userSkill?.let { ProficiencyLevel.fromString(it.proficiency) }

            val status: MatchStatus
            val earnedScore: Double
            val priority: PriorityLevel
            val recommendation: String

            if (userSkill == null) {
                // Missing skill
                status = MatchStatus.MISSING
                earnedScore = 0.0
                missingCount++

                // Determine priority
                priority = when {
                    required.isCore && required.importanceWeight >= 1.2 -> PriorityLevel.HIGH
                    required.isCore || required.prerequisites.isEmpty() -> PriorityLevel.MEDIUM
                    else -> PriorityLevel.LOW
                }

                recommendation = "Begin with fundamental concepts. Suggested target: ${required.requiredLevel} level."
            } else {
                matchedUserSkillKeys.add(key)
                if (userLevel!!.score >= reqLevel.score) {
                    // Fully Matched
                    status = MatchStatus.FULLY_MATCHED
                    earnedScore = 1.0
                    earnedWeight += weight
                    matchedCount++
                    priority = PriorityLevel.LOW
                    recommendation = "Solid match! Continue building hands-on portfolio projects with $normReqName."
                } else {
                    // Partially Matched
                    status = MatchStatus.PARTIALLY_MATCHED
                    earnedScore = 0.5
                    earnedWeight += (weight * 0.5)
                    partialCount++

                    priority = if (required.isCore) PriorityLevel.HIGH else PriorityLevel.MEDIUM
                    recommendation = "Level up from ${userSkill.proficiency} to ${required.requiredLevel} by mastering real-world patterns."
                }
            }

            comparisonItems.add(
                SkillComparisonItem(
                    skillName = normReqName,
                    category = required.category,
                    currentLevel = userSkill?.proficiency,
                    requiredLevel = required.requiredLevel,
                    status = status,
                    earnedScore = earnedScore,
                    maxScore = 1.0,
                    priority = priority,
                    recommendation = recommendation,
                    prerequisites = required.prerequisites,
                    whyItMatters = "Critical for ${targetRole.title} workflow and standard technical interviews."
                )
            )
        }

        // Additional skills user possesses that are not strictly required for this role
        val additionalSkills = userSkills.filter {
            val key = normalizeSkillName(it.name).lowercase(Locale.ROOT)
            !matchedUserSkillKeys.contains(key)
        }

        // Calculate deterministic percentages
        val coveragePercentage = if (totalWeight > 0) {
            Math.round((earnedWeight / totalWeight) * 1000.0) / 10.0
        } else 0.0

        val gapPercentage = Math.round((100.0 - coveragePercentage) * 10.0) / 10.0

        // Top priority skills
        val topPrioritySkills = comparisonItems
            .filter { it.status == MatchStatus.MISSING || it.status == MatchStatus.PARTIALLY_MATCHED }
            .sortedWith(compareBy<SkillComparisonItem> {
                when (it.priority) {
                    PriorityLevel.HIGH -> 0
                    PriorityLevel.MEDIUM -> 1
                    PriorityLevel.LOW -> 2
                }
            }.thenByDescending { it.earnedScore == 0.0 })
            .map { it.skillName }
            .take(5)

        val verdict = when {
            coveragePercentage >= 85.0 -> "Ready for Junior/Associate Interviews"
            coveragePercentage >= 65.0 -> "Strong Potential – Bridge Core Gaps"
            coveragePercentage >= 40.0 -> "Moderate Alignment – Follow Roadmap"
            else -> "Early Stage – Focus on High Priority Fundamentals"
        }

        val formulaText = "Coverage: (${String.format(Locale.US, "%.1f", earnedWeight)} earned / ${String.format(Locale.US, "%.1f", totalWeight)} total weighted) × 100 = $coveragePercentage%"

        return AnalysisResult(
            targetRoleTitle = targetRole.title,
            targetRoleId = targetRole.id,
            skillCoveragePercentage = coveragePercentage,
            skillGapPercentage = gapPercentage,
            matchedCount = matchedCount,
            partialCount = partialCount,
            missingCount = missingCount,
            totalRequiredCount = targetRole.requiredSkills.size,
            topPrioritySkills = topPrioritySkills,
            comparisonItems = comparisonItems,
            additionalSkills = additionalSkills,
            readinessVerdict = verdict,
            formulaExplanation = formulaText
        )
    }

    /**
     * What-If Simulator:
     * Calculates the new projected coverage percentage if the user masters the chosen set of skills.
     */
    fun simulateWhatIf(
        baseAnalysis: AnalysisResult,
        targetRole: JobRole,
        userSkills: List<UserSkill>,
        simulatedSkillsToAcquire: Set<String>
    ): SimulationResult {
        if (simulatedSkillsToAcquire.isEmpty()) {
            return SimulationResult(
                originalCoverage = baseAnalysis.skillCoveragePercentage,
                simulatedCoverage = baseAnalysis.skillCoveragePercentage,
                gapReduction = 0.0,
                newGap = baseAnalysis.skillGapPercentage
            )
        }

        val augmentedSkills = userSkills.toMutableList()
        simulatedSkillsToAcquire.forEach { skillName ->
            val required = targetRole.requiredSkills.find { it.name.equals(skillName, ignoreCase = true) }
            val level = required?.requiredLevel ?: "Advanced"
            val category = required?.category ?: "Tools"

            // Check if already in user skills
            val existingIndex = augmentedSkills.indexOfFirst { it.name.equals(skillName, ignoreCase = true) }
            if (existingIndex >= 0) {
                augmentedSkills[existingIndex] = augmentedSkills[existingIndex].copy(proficiency = level)
            } else {
                augmentedSkills.add(
                    UserSkill(
                        name = skillName,
                        category = category,
                        proficiency = level,
                        experienceMonths = 12
                    )
                )
            }
        }

        val newAnalysis = analyze(augmentedSkills, targetRole)
        val gapReduction = Math.round((newAnalysis.skillCoveragePercentage - baseAnalysis.skillCoveragePercentage) * 10.0) / 10.0

        return SimulationResult(
            originalCoverage = baseAnalysis.skillCoveragePercentage,
            simulatedCoverage = newAnalysis.skillCoveragePercentage,
            gapReduction = gapReduction,
            newGap = newAnalysis.skillGapPercentage
        )
    }
}

data class SimulationResult(
    val originalCoverage: Double,
    val simulatedCoverage: Double,
    val gapReduction: Double,
    val newGap: Double
)
