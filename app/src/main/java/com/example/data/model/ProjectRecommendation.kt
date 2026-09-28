package com.example.data.model

data class ProjectRecommendation(
    val id: String,
    val title: String,
    val targetRole: String,
    val difficulty: String, // Beginner, Intermediate, Advanced
    val skillsCovered: List<String>,
    val description: String,
    val expectedOutcome: String,
    val suggestedFeatures: List<String>,
    val architectureTip: String = ""
)
