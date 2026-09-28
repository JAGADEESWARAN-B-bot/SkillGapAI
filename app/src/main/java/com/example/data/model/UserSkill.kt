package com.example.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey

enum class ProficiencyLevel(val score: Double, val displayName: String) {
    BEGINNER(1.0, "Beginner"),
    INTERMEDIATE(2.0, "Intermediate"),
    ADVANCED(3.0, "Advanced"),
    EXPERT(4.0, "Expert");

    companion object {
        fun fromString(value: String): ProficiencyLevel {
            return entries.find { it.name.equals(value, ignoreCase = true) || it.displayName.equals(value, ignoreCase = true) }
                ?: BEGINNER
        }
    }
}

enum class SkillCategory(val displayName: String) {
    PROGRAMMING("Programming"),
    FRONTEND("Frontend"),
    BACKEND("Backend"),
    DATABASE("Database"),
    DATA_AI("Data & AI"),
    CLOUD_DEVOPS("Cloud & DevOps"),
    TESTING_QA("Testing & QA"),
    DESIGN_UX("Design & UX"),
    SOFT_SKILLS("Soft Skills"),
    TOOLS("Tools & Version Control");

    companion object {
        fun fromString(value: String): SkillCategory {
            return entries.find { it.name.equals(value, ignoreCase = true) || it.displayName.equals(value, ignoreCase = true) }
                ?: TOOLS
        }
    }
}

@Entity(tableName = "user_skills")
data class UserSkill(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val name: String,
    val category: String,
    val proficiency: String, // Beginner, Intermediate, Advanced, Expert
    val experienceMonths: Int = 6,
    val isCustom: Boolean = false,
    val addedAt: Long = System.currentTimeMillis()
)
