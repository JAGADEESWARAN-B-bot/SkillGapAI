package com.example.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "user_profile")
data class UserProfile(
    @PrimaryKey
    val id: String = "current_user",
    val name: String = "Alex Chen",
    val email: String = "alex.chen@university.edu",
    val course: String = "B.Tech Computer Science",
    val department: String = "Computer Science & Engineering",
    val year: String = "Final Year (4th Year)",
    val college: String = "Institute of Technology",
    val careerGoal: String = "Data Analyst",
    val experienceLevel: String = "Fresher / Student",
    val linkedinUrl: String = "https://linkedin.com/in/alexchen-dev",
    val githubUrl: String = "https://github.com/alexchen",
    val targetRoleId: String = "data_analyst",
    val isLoggedIn: Boolean = true,
    val updatedAt: Long = System.currentTimeMillis()
)
