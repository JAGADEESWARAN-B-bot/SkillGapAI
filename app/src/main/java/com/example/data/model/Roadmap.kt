package com.example.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey

enum class RoadmapStatus(val label: String) {
    NOT_STARTED("Not Started"),
    LEARNING("Learning"),
    PRACTICING("Practicing"),
    COMPLETED("Completed");

    companion object {
        fun fromString(value: String): RoadmapStatus {
            return entries.find { it.name.equals(value, ignoreCase = true) || it.label.equals(value, ignoreCase = true) }
                ?: NOT_STARTED
        }
    }
}

@Entity(tableName = "roadmap_items")
data class RoadmapItemEntity(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val roleId: String,
    val phaseNumber: Int,
    val phaseTitle: String,
    val skillName: String,
    val whyItMatters: String,
    val prerequisites: String, // comma separated
    val estimatedEffort: String,
    val practiceTask: String,
    val miniProject: String,
    val status: String = "Not Started", // Not Started, Learning, Practicing, Completed
    val orderIndex: Int = 0
)

data class RoadmapPhase(
    val phaseNumber: Int,
    val title: String,
    val description: String,
    val items: List<RoadmapItemEntity>
)
