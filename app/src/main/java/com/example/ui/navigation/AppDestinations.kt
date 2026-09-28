package com.example.ui.navigation

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.List
import androidx.compose.material.icons.automirrored.filled.TrendingUp
import androidx.compose.material.icons.filled.Assessment
import androidx.compose.material.icons.filled.Assignment
import androidx.compose.material.icons.filled.Build
import androidx.compose.material.icons.filled.Dashboard
import androidx.compose.material.icons.filled.Description
import androidx.compose.material.icons.filled.History
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.QuestionAnswer
import androidx.compose.material.icons.filled.Science
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material.icons.filled.Work
import androidx.compose.ui.graphics.vector.ImageVector

sealed class Screen(
    val route: String,
    val title: String,
    val icon: ImageVector,
    val showInBottomNav: Boolean = false
) {
    data object Home : Screen("home", "Home", Icons.Default.Home, true)
    data object Dashboard : Screen("dashboard", "Dashboard", Icons.Default.Dashboard, true)
    data object Skills : Screen("skills", "My Skills", Icons.Default.Build, true)
    data object JobRoles : Screen("job_roles", "Target Roles", Icons.Default.Work, false)
    data object Resume : Screen("resume", "Resume Analyzer", Icons.Default.Description, false)
    data object Analyze : Screen("analyze", "Gap Analysis", Icons.Default.Assessment, true)
    data object WhatIf : Screen("what_if", "What-If Simulator", Icons.Default.Science, false)
    data object Roadmap : Screen("roadmap", "Roadmap", Icons.AutoMirrored.Filled.TrendingUp, true)
    data object Projects : Screen("projects", "Projects", Icons.Default.Assignment, false)
    data object Interview : Screen("interview", "Interview Prep", Icons.Default.QuestionAnswer, false)
    data object History : Screen("history", "History", Icons.Default.History, false)
    data object Profile : Screen("profile", "Profile", Icons.Default.Person, false)
    data object Settings : Screen("settings", "Settings", Icons.Default.Settings, false)
    data object About : Screen("about", "About", Icons.Default.Info, false)
    data object Auth : Screen("auth", "Sign In", Icons.Default.Person, false)

    companion object {
        val bottomNavScreens = listOf(Home, Dashboard, Skills, Analyze, Roadmap)
        val allDrawerScreens = listOf(
            Home,
            Dashboard,
            Skills,
            JobRoles,
            Resume,
            Analyze,
            WhatIf,
            Roadmap,
            Projects,
            Interview,
            History,
            Profile,
            Settings,
            About
        )

        fun fromRoute(route: String?): Screen {
            return when (route?.substringBefore("?")) {
                Home.route -> Home
                Dashboard.route -> Dashboard
                Skills.route -> Skills
                JobRoles.route -> JobRoles
                Resume.route -> Resume
                Analyze.route -> Analyze
                WhatIf.route -> WhatIf
                Roadmap.route -> Roadmap
                Projects.route -> Projects
                Interview.route -> Interview
                History.route -> History
                Profile.route -> Profile
                Settings.route -> Settings
                About.route -> About
                Auth.route -> Auth
                else -> Home
            }
        }
    }
}
