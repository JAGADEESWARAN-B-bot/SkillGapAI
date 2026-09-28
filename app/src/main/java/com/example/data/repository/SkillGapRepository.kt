package com.example.data.repository

import android.content.Context
import com.example.data.local.SkillGapDatabase
import com.example.data.model.AnalysisRecordEntity
import com.example.data.model.JobRole
import com.example.data.model.PredefinedJobRoles
import com.example.data.model.RoadmapItemEntity
import com.example.data.model.UserProfile
import com.example.data.model.UserSkill
import com.example.domain.RoadmapGenerator
import com.example.domain.SkillGapCalculator
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.firstOrNull

class SkillGapRepository(context: Context) {
    private val db = SkillGapDatabase.getInstance(context)
    private val skillDao = db.userSkillDao()
    private val profileDao = db.userProfileDao()
    private val analysisDao = db.analysisDao()
    private val roadmapDao = db.roadmapDao()

    val allSkills: Flow<List<UserSkill>> = skillDao.getAllSkills()
    val userProfile: Flow<UserProfile?> = profileDao.getProfileFlow()
    val analysisHistory: Flow<List<AnalysisRecordEntity>> = analysisDao.getAllRecords()

    fun getRoadmapFlow(roleId: String): Flow<List<RoadmapItemEntity>> {
        return roadmapDao.getRoadmapForRole(roleId)
    }

    suspend fun insertSkill(skill: UserSkill): Long {
        return skillDao.insertSkill(skill)
    }

    suspend fun insertSkills(skills: List<UserSkill>) {
        skillDao.insertSkills(skills)
    }

    suspend fun updateSkill(skill: UserSkill) {
        skillDao.updateSkill(skill)
    }

    suspend fun deleteSkillById(id: Long) {
        skillDao.deleteSkillById(id)
    }

    suspend fun updateProfile(profile: UserProfile) {
        profileDao.updateProfile(profile)
    }

    suspend fun updateTargetRole(roleId: String) {
        profileDao.updateTargetRole(roleId)
    }

    suspend fun setLoggedIn(loggedIn: Boolean) {
        profileDao.setLoggedIn(loggedIn)
    }

    suspend fun saveAnalysisRecord(record: AnalysisRecordEntity): Long {
        return analysisDao.insertRecord(record)
    }

    suspend fun updateRoadmapItemStatus(id: Long, status: String, skillName: String? = null) {
        roadmapDao.updateItemStatus(id, status)
        // If marked Completed, ensure the skill is added or upgraded in user skills!
        if (status.equals("Completed", ignoreCase = true) && !skillName.isNullOrBlank()) {
            val existing = skillDao.getSkillByName(skillName)
            if (existing == null) {
                skillDao.insertSkill(
                    UserSkill(
                        name = skillName,
                        category = "Tools & Version Control",
                        proficiency = "Intermediate",
                        experienceMonths = 6
                    )
                )
            } else {
                skillDao.updateSkill(existing.copy(proficiency = "Advanced"))
            }
        }
    }

    suspend fun ensureRoadmapGenerated(role: JobRole, userSkills: List<UserSkill>) {
        val existing = roadmapDao.getRoadmapForRole(role.id).firstOrNull()
        if (existing.isNullOrEmpty()) {
            val analysis = SkillGapCalculator.analyze(userSkills, role)
            val items = RoadmapGenerator.generateRoadmapItems(role, analysis.comparisonItems)
            roadmapDao.insertRoadmapItems(items)
        }
    }

    suspend fun regenerateRoadmap(role: JobRole, userSkills: List<UserSkill>) {
        roadmapDao.deleteRoadmapForRole(role.id)
        val analysis = SkillGapCalculator.analyze(userSkills, role)
        val items = RoadmapGenerator.generateRoadmapItems(role, analysis.comparisonItems)
        roadmapDao.insertRoadmapItems(items)
    }

    suspend fun loadDemoStudentData() {
        // Default CS student skills targeting Data Analyst
        val demoSkills = listOf(
            UserSkill(name = "Python", category = "Programming", proficiency = "Intermediate", experienceMonths = 12),
            UserSkill(name = "SQL", category = "Database", proficiency = "Intermediate", experienceMonths = 8),
            UserSkill(name = "Excel", category = "Tools & Version Control", proficiency = "Advanced", experienceMonths = 18),
            UserSkill(name = "Git", category = "Tools & Version Control", proficiency = "Intermediate", experienceMonths = 12),
            UserSkill(name = "Communication", category = "Soft Skills", proficiency = "Intermediate", experienceMonths = 24),
            UserSkill(name = "Problem Solving", category = "Soft Skills", proficiency = "Intermediate", experienceMonths = 24),
            UserSkill(name = "HTML", category = "Frontend", proficiency = "Beginner", experienceMonths = 4)
        )
        skillDao.deleteAllSkills()
        skillDao.insertSkills(demoSkills)

        val demoProfile = UserProfile(
            id = "current_user",
            name = "Alex Chen",
            email = "alex.chen@university.edu",
            course = "B.Tech Computer Science",
            department = "Computer Science & Engineering",
            year = "Final Year (4th Year)",
            college = "Institute of Technology",
            careerGoal = "Data Analyst",
            experienceLevel = "Fresher / Student",
            linkedinUrl = "https://linkedin.com/in/alexchen-dev",
            githubUrl = "https://github.com/alexchen",
            targetRoleId = "data_analyst",
            isLoggedIn = true
        )
        profileDao.insertProfile(demoProfile)

        // Seed a sample initial analysis record in history
        val targetRole = PredefinedJobRoles.getRoleById("data_analyst")!!
        val analysis = SkillGapCalculator.analyze(demoSkills, targetRole)
        analysisDao.insertRecord(
            AnalysisRecordEntity(
                targetRoleTitle = targetRole.title,
                targetRoleId = targetRole.id,
                coveragePercentage = analysis.skillCoveragePercentage,
                gapPercentage = analysis.skillGapPercentage,
                matchedCount = analysis.matchedCount,
                partialCount = analysis.partialCount,
                missingCount = analysis.missingCount,
                topPrioritySkillsSummary = analysis.topPrioritySkills.joinToString(", ")
            )
        )

        regenerateRoadmap(targetRole, demoSkills)
    }

    suspend fun clearAllData() {
        skillDao.deleteAllSkills()
        analysisDao.clearHistory()
        roadmapDao.clearAllRoadmapItems()
        profileDao.insertProfile(
            UserProfile(
                id = "current_user",
                name = "",
                email = "",
                course = "",
                department = "",
                year = "",
                college = "",
                careerGoal = "",
                experienceLevel = "Student",
                linkedinUrl = "",
                githubUrl = "",
                targetRoleId = "data_analyst",
                isLoggedIn = false
            )
        )
    }

    suspend fun seedInitialDataIfNeeded() {
        val profile = profileDao.getProfile()
        if (profile == null) {
            loadDemoStudentData()
        }
    }
}
