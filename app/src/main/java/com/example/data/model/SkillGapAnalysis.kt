package com.example.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey

enum class MatchStatus(val label: String) {
    FULLY_MATCHED("Fully Matched"),
    PARTIALLY_MATCHED("Partially Matched"),
    MISSING("Missing"),
    ADDITIONAL("Additional")
}

enum class PriorityLevel(val label: String) {
    HIGH("High Priority"),
    MEDIUM("Medium Priority"),
    LOW("Low Priority")
}

data class SkillComparisonItem(
    val skillName: String,
    val category: String,
    val currentLevel: String?, // null if missing
    val requiredLevel: String,
    val status: MatchStatus,
    val earnedScore: Double, // 1.0, 0.5, or 0.0
    val maxScore: Double = 1.0,
    val priority: PriorityLevel,
    val recommendation: String,
    val prerequisites: List<String> = emptyList(),
    val whyItMatters: String = ""
)

data class AnalysisResult(
    val targetRoleTitle: String,
    val targetRoleId: String,
    val skillCoveragePercentage: Double,
    val skillGapPercentage: Double,
    val matchedCount: Int,
    val partialCount: Int,
    val missingCount: Int,
    val totalRequiredCount: Int,
    val topPrioritySkills: List<String>,
    val comparisonItems: List<SkillComparisonItem>,
    val additionalSkills: List<UserSkill> = emptyList(),
    val readinessVerdict: String,
    val formulaExplanation: String,
    val timestamp: Long = System.currentTimeMillis()
)

@Entity(tableName = "analysis_history")
data class AnalysisRecordEntity(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val targetRoleTitle: String,
    val targetRoleId: String,
    val coveragePercentage: Double,
    val gapPercentage: Double,
    val matchedCount: Int,
    val partialCount: Int,
    val missingCount: Int,
    val topPrioritySkillsSummary: String, // comma separated
    val timestamp: Long = System.currentTimeMillis()
)
