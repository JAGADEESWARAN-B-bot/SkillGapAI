package com.example.ui.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.ai.ExtractedResumeData
import com.example.ai.GeminiService
import com.example.ai.ResumeSkillExtractor
import com.example.data.model.AnalysisRecordEntity
import com.example.data.model.AnalysisResult
import com.example.data.model.JobRole
import com.example.data.model.PredefinedJobRoles
import com.example.data.model.RoadmapItemEntity
import com.example.data.model.UserProfile
import com.example.data.model.UserSkill
import com.example.data.repository.SkillGapRepository
import com.example.domain.InterviewGenerator
import com.example.domain.ProjectRecommender
import com.example.domain.RoadmapGenerator
import com.example.domain.SimulationResult
import com.example.domain.SkillGapCalculator
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

class MainViewModel(application: Application) : AndroidViewModel(application) {
    private val repository = SkillGapRepository(application)

    // User skills from Room
    val userSkills: StateFlow<List<UserSkill>> = repository.allSkills
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    // User profile from Room
    val userProfile: StateFlow<UserProfile?> = repository.userProfile
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), null)

    // Analysis history from Room
    val analysisHistory: StateFlow<List<AnalysisRecordEntity>> = repository.analysisHistory
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    // Selected Target Role
    private val _selectedRole = MutableStateFlow<JobRole>(PredefinedJobRoles.roles.first())
    val selectedRole: StateFlow<JobRole> = _selectedRole.asStateFlow()

    // Available Job Roles
    private val _availableRoles = MutableStateFlow<List<JobRole>>(PredefinedJobRoles.roles)
    val availableRoles: StateFlow<List<JobRole>> = _availableRoles.asStateFlow()

    // Deterministic Analysis Result StateFlow
    val currentAnalysis: StateFlow<AnalysisResult?> = combine(userSkills, selectedRole) { skills, role ->
        if (skills.isNotEmpty()) {
            SkillGapCalculator.analyze(skills, role)
        } else {
            null
        }
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), null)

    // What-If Simulator Selection
    private val _simulatedSkillSet = MutableStateFlow<Set<String>>(emptySet())
    val simulatedSkillSet: StateFlow<Set<String>> = _simulatedSkillSet.asStateFlow()

    val simulationResult: StateFlow<SimulationResult?> = combine(
        currentAnalysis,
        selectedRole,
        userSkills,
        _simulatedSkillSet
    ) { analysis, role, skills, simSkills ->
        if (analysis != null) {
            SkillGapCalculator.simulateWhatIf(analysis, role, skills, simSkills)
        } else null
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), null)

    // Dynamic Roadmap Items for current target role
    val roadmapItems: StateFlow<List<RoadmapItemEntity>> = MutableStateFlow<List<RoadmapItemEntity>>(emptyList())
    private val _currentRoadmapItems = MutableStateFlow<List<RoadmapItemEntity>>(emptyList())
    val currentRoadmapItems: StateFlow<List<RoadmapItemEntity>> = _currentRoadmapItems.asStateFlow()

    // Resume Extractor State
    private val _resumeText = MutableStateFlow(ResumeSkillExtractor.sampleResumeText)
    val resumeText: StateFlow<String> = _resumeText.asStateFlow()

    private val _extractedResumeData = MutableStateFlow<ExtractedResumeData?>(null)
    val extractedResumeData: StateFlow<ExtractedResumeData?> = _extractedResumeData.asStateFlow()

    // UI Loading & Feedback States
    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()

    private val _statusMessage = MutableStateFlow<String?>(null)
    val statusMessage: StateFlow<String?> = _statusMessage.asStateFlow()

    // Gemini AI generated advice
    private val _aiCareerAdvice = MutableStateFlow<String?>(null)
    val aiCareerAdvice: StateFlow<String?> = _aiCareerAdvice.asStateFlow()

    private val _isAiLoading = MutableStateFlow(false)
    val isAiLoading: StateFlow<Boolean> = _isAiLoading.asStateFlow()

    init {
        viewModelScope.launch {
            repository.seedInitialDataIfNeeded()
            // Observe profile to align selected target role
            userProfile.collect { profile ->
                if (profile != null) {
                    val matchingRole = PredefinedJobRoles.getRoleById(profile.targetRoleId)
                    if (matchingRole != null && matchingRole.id != _selectedRole.value.id) {
                        _selectedRole.value = matchingRole
                    }
                }
            }
        }

        // Keep roadmap in sync
        viewModelScope.launch {
            selectedRole.collect { role ->
                repository.getRoadmapFlow(role.id).collect { items ->
                    if (items.isEmpty() && userSkills.value.isNotEmpty()) {
                        repository.ensureRoadmapGenerated(role, userSkills.value)
                    } else {
                        _currentRoadmapItems.value = items
                    }
                }
            }
        }
    }

    fun selectTargetRole(role: JobRole) {
        _selectedRole.value = role
        _simulatedSkillSet.value = emptySet()
        viewModelScope.launch {
            repository.updateTargetRole(role.id)
            repository.ensureRoadmapGenerated(role, userSkills.value)
            _statusMessage.value = "Target role updated to ${role.title}"
        }
    }

    fun addCustomTargetRole(newRole: JobRole) {
        _availableRoles.value = _availableRoles.value + newRole
        selectTargetRole(newRole)
    }

    fun addSkill(name: String, category: String, proficiency: String, months: Int = 12) {
        if (name.isBlank()) return
        viewModelScope.launch {
            val normalized = SkillGapCalculator.normalizeSkillName(name)
            repository.insertSkill(
                UserSkill(
                    name = normalized,
                    category = category,
                    proficiency = proficiency,
                    experienceMonths = months
                )
            )
            _statusMessage.value = "Added $normalized to your skills"
        }
    }

    fun updateSkill(skill: UserSkill) {
        viewModelScope.launch {
            repository.updateSkill(skill)
            _statusMessage.value = "Updated ${skill.name}"
        }
    }

    fun deleteSkill(id: Long) {
        viewModelScope.launch {
            repository.deleteSkillById(id)
            _statusMessage.value = "Skill removed"
        }
    }

    fun updateProfile(profile: UserProfile) {
        viewModelScope.launch {
            repository.updateProfile(profile)
            _statusMessage.value = "Profile saved successfully"
        }
    }

    fun toggleWhatIfSkill(skillName: String) {
        val current = _simulatedSkillSet.value.toMutableSet()
        if (current.contains(skillName)) {
            current.remove(skillName)
        } else {
            current.add(skillName)
        }
        _simulatedSkillSet.value = current
    }

    fun clearWhatIf() {
        _simulatedSkillSet.value = emptySet()
    }

    fun setResumeText(text: String) {
        _resumeText.value = text
    }

    fun analyzeResume() {
        _isLoading.value = true
        val result = ResumeSkillExtractor.extractSkillsFromText(_resumeText.value)
        _extractedResumeData.value = result
        _isLoading.value = false
        _statusMessage.value = "Extracted ${result.extractedSkills.size} skills from resume"
    }

    fun importExtractedSkills() {
        val data = _extractedResumeData.value ?: return
        viewModelScope.launch {
            repository.insertSkills(data.extractedSkills)
            _statusMessage.value = "Imported ${data.extractedSkills.size} skills to your profile!"
        }
    }

    fun saveCurrentAnalysisToHistory() {
        val analysis = currentAnalysis.value ?: return
        viewModelScope.launch {
            repository.saveAnalysisRecord(
                AnalysisRecordEntity(
                    targetRoleTitle = analysis.targetRoleTitle,
                    targetRoleId = analysis.targetRoleId,
                    coveragePercentage = analysis.skillCoveragePercentage,
                    gapPercentage = analysis.skillGapPercentage,
                    matchedCount = analysis.matchedCount,
                    partialCount = analysis.partialCount,
                    missingCount = analysis.missingCount,
                    topPrioritySkillsSummary = analysis.topPrioritySkills.joinToString(", ")
                )
            )
            _statusMessage.value = "Analysis snapshot saved to history"
        }
    }

    fun updateRoadmapItemStatus(id: Long, status: String, skillName: String) {
        viewModelScope.launch {
            repository.updateRoadmapItemStatus(id, status, skillName)
        }
    }

    fun regenerateRoadmap() {
        viewModelScope.launch {
            _isLoading.value = true
            repository.regenerateRoadmap(_selectedRole.value, userSkills.value)
            _isLoading.value = false
            _statusMessage.value = "Roadmap refreshed for ${_selectedRole.value.title}"
        }
    }

    fun loadDemoData() {
        viewModelScope.launch {
            _isLoading.value = true
            repository.loadDemoStudentData()
            _selectedRole.value = PredefinedJobRoles.getRoleById("data_analyst")!!
            _isLoading.value = false
            _statusMessage.value = "Loaded demo student profile (Alex Chen, Data Analyst)"
        }
    }

    fun clearAllData() {
        viewModelScope.launch {
            repository.clearAllData()
            _statusMessage.value = "All skills and history reset"
        }
    }

    fun requestAiAdvice() {
        val analysis = currentAnalysis.value ?: return
        viewModelScope.launch {
            _isAiLoading.value = true
            val missing = analysis.comparisonItems
                .filter { it.status == com.example.data.model.MatchStatus.MISSING }
                .map { it.skillName }
            val current = userSkills.value.map { it.name }

            val advice = GeminiService.generateCareerAdvice(
                targetRole = _selectedRole.value.title,
                missingSkills = missing,
                currentSkills = current
            )

            _aiCareerAdvice.value = advice ?: "• Prioritize high-weight core skills first: ${analysis.topPrioritySkills.take(2).joinToString(", ")}.\n• Build 1 portfolio project demonstrating real data pipelines.\n• Practice STAR method responses for behavioral rounds."
            _isAiLoading.value = false
        }
    }

    fun clearStatusMessage() {
        _statusMessage.value = null
    }
}
