package com.example.domain

import com.example.data.model.JobRole
import com.example.data.model.RoadmapItemEntity
import com.example.data.model.RoadmapPhase
import com.example.data.model.RoadmapStatus
import com.example.data.model.SkillComparisonItem

object RoadmapGenerator {

    fun generateRoadmapItems(
        role: JobRole,
        comparisonItems: List<SkillComparisonItem>
    ): List<RoadmapItemEntity> {
        val missingOrPartial = comparisonItems.filter {
            it.status == com.example.data.model.MatchStatus.MISSING ||
                    it.status == com.example.data.model.MatchStatus.PARTIALLY_MATCHED
        }

        // If user already matches everything, generate advanced mastery items
        val skillsToCover = if (missingOrPartial.isNotEmpty()) {
            missingOrPartial
        } else {
            comparisonItems.take(4)
        }

        val items = mutableListOf<RoadmapItemEntity>()

        // Organize skills into 4 logical phases based on prerequisites & categories
        val phase1Skills = mutableListOf<SkillComparisonItem>()
        val phase2Skills = mutableListOf<SkillComparisonItem>()
        val phase3Skills = mutableListOf<SkillComparisonItem>()
        val phase4Skills = mutableListOf<SkillComparisonItem>()

        skillsToCover.forEach { item ->
            when {
                item.category.contains("Programming") || item.category.contains("Soft") -> {
                    phase1Skills.add(item)
                }
                item.category.contains("Database") || item.category.contains("Frontend") -> {
                    phase2Skills.add(item)
                }
                item.category.contains("Data") || item.category.contains("Backend") -> {
                    phase3Skills.add(item)
                }
                else -> {
                    phase4Skills.add(item)
                }
            }
        }

        // Balance phases if any are empty
        if (phase1Skills.isEmpty() && skillsToCover.isNotEmpty()) {
            phase1Skills.add(skillsToCover.first())
        }

        var orderIndex = 0

        // Helper to populate items
        fun addItemsForPhase(phaseSkills: List<SkillComparisonItem>, phaseNum: Int, phaseTitle: String) {
            phaseSkills.forEach { skillItem ->
                val prereqStr = if (skillItem.prerequisites.isNotEmpty()) skillItem.prerequisites.joinToString(", ") else "None"
                val effort = when (skillItem.requiredLevel) {
                    "Beginner" -> "1 - 2 Weeks"
                    "Intermediate" -> "2 - 3 Weeks"
                    "Advanced" -> "3 - 5 Weeks"
                    else -> "4 - 6 Weeks"
                }

                items.add(
                    RoadmapItemEntity(
                        roleId = role.id,
                        phaseNumber = phaseNum,
                        phaseTitle = phaseTitle,
                        skillName = skillItem.skillName,
                        whyItMatters = "Essential pillar for ${role.title}. Frequently evaluated in technical screening.",
                        prerequisites = prereqStr,
                        estimatedEffort = effort,
                        practiceTask = "Complete 15 hands-on algorithmic or syntax exercises covering ${skillItem.skillName} core patterns.",
                        miniProject = "Build a modular mini-application demonstrating ${skillItem.skillName} with clear documentation.",
                        status = RoadmapStatus.NOT_STARTED.label,
                        orderIndex = orderIndex++
                    )
                )
            }
        }

        if (phase1Skills.isNotEmpty()) addItemsForPhase(phase1Skills, 1, "Phase 1: Foundations & Prerequisites")
        if (phase2Skills.isNotEmpty()) addItemsForPhase(phase2Skills, 2, "Phase 2: Core Engineering & Data Storage")
        if (phase3Skills.isNotEmpty()) addItemsForPhase(phase3Skills, 3, "Phase 3: Applied Systems & Frameworks")
        if (phase4Skills.isNotEmpty()) addItemsForPhase(phase4Skills, 4, "Phase 4: Production Deployment & Polish")

        // Add a final capstone project phase item
        items.add(
            RoadmapItemEntity(
                roleId = role.id,
                phaseNumber = 5,
                phaseTitle = "Phase 5: Capstone Portfolio Integration",
                skillName = "Portfolio Capstone for ${role.title}",
                whyItMatters = "Proves end-to-end competence to hiring managers through a production-ready application.",
                prerequisites = "All prior phase milestones",
                estimatedEffort = "3 - 4 Weeks",
                practiceTask = "Architect, test, and write a comprehensive technical case study with architecture diagram.",
                miniProject = "Full-lifecycle deployable project hosted online with clean GitHub repository.",
                status = RoadmapStatus.NOT_STARTED.label,
                orderIndex = orderIndex
            )
        )

        return items
    }

    fun groupIntoPhases(items: List<RoadmapItemEntity>): List<RoadmapPhase> {
        val grouped = items.groupBy { it.phaseNumber }
        return grouped.map { (phaseNum, phaseItems) ->
            val title = phaseItems.firstOrNull()?.phaseTitle ?: "Phase $phaseNum"
            val desc = when (phaseNum) {
                1 -> "Master core grammar, standard libraries, and essential logic."
                2 -> "Structure persistent storage, schemas, queries, and APIs."
                3 -> "Implement production-grade frameworks, analytics, and business logic."
                4 -> "Ensure testability, performance, security, and cloud scalability."
                else -> "Deliver an impressive portfolio capstone for recruiters."
            }
            RoadmapPhase(
                phaseNumber = phaseNum,
                title = title,
                description = desc,
                items = phaseItems.sortedBy { it.orderIndex }
            )
        }.sortedBy { it.phaseNumber }
    }
}
