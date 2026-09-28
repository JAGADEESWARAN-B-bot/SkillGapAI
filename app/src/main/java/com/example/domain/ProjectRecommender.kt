package com.example.domain

import com.example.data.model.JobRole
import com.example.data.model.ProjectRecommendation

object ProjectRecommender {

    fun getRecommendedProjects(
        role: JobRole,
        missingSkills: List<String>
    ): List<ProjectRecommendation> {
        val missingLower = missingSkills.map { it.lowercase() }

        val allRoleProjects = getProjectsForRole(role)

        // Prioritize projects that practice the user's missing skills
        return allRoleProjects.sortedByDescending { project ->
            project.skillsCovered.count { skill ->
                missingLower.any { it.contains(skill.lowercase()) || skill.lowercase().contains(it) }
            }
        }
    }

    private fun getProjectsForRole(role: JobRole): List<ProjectRecommendation> {
        return when (role.id) {
            "data_analyst" -> listOf(
                ProjectRecommendation(
                    id = "da_1",
                    title = "E-Commerce Executive Sales Dashboard",
                    targetRole = "Data Analyst",
                    difficulty = "Intermediate",
                    skillsCovered = listOf("SQL", "Power BI", "Excel", "Data Visualization"),
                    description = "Aggregate omnichannel transaction data using complex SQL queries and visualize key performance indicators (KPIs) like customer lifetime value, churn rate, and monthly recurring revenue.",
                    expectedOutcome = "Interactive, multi-page Power BI dashboard with drill-through parameters and automated DAX calculations.",
                    suggestedFeatures = listOf(
                        "SQL stored procedures for monthly rolling summaries",
                        "DAX measures for Year-over-Year (YoY) revenue growth",
                        "Cohort retention heatmaps and geographic sales distribution"
                    ),
                    architectureTip = "Structure a star schema with 1 central fact table (Sales) and 4 dimension tables (Date, Customer, Product, Region)."
                ),
                ProjectRecommendation(
                    id = "da_2",
                    title = "Customer Churn Prediction & Exploratory Analysis",
                    targetRole = "Data Analyst",
                    difficulty = "Advanced",
                    skillsCovered = listOf("Python", "Pandas", "Statistics", "Data Visualization"),
                    description = "Perform deep exploratory data analysis on 10,000+ telecom subscription records to identify statistical behavioral drivers behind account cancellations.",
                    expectedOutcome = "Jupyter Notebook report featuring correlation matrices, distribution plots, hypothesis testing, and actionable retention recommendations.",
                    suggestedFeatures = listOf(
                        "Data cleaning and missing value imputation pipeline with Pandas",
                        "Two-sample t-tests and Chi-Square tests of independence",
                        "Interactive Seaborn and Plotly visualizations"
                    ),
                    architectureTip = "Modularize feature transformation steps into reusable Python functions."
                ),
                ProjectRecommendation(
                    id = "da_3",
                    title = "Financial Portfolio Performance Tracker",
                    targetRole = "Data Analyst",
                    difficulty = "Beginner",
                    skillsCovered = listOf("Excel", "Statistics", "SQL"),
                    description = "Model historical stock price volatility, Sharpe ratio, and weighted returns across diversified multi-asset portfolios.",
                    expectedOutcome = "Automated Excel financial model with dynamic lookup formulas, sensitivity tables, and macro-driven summaries.",
                    suggestedFeatures = listOf(
                        "Advanced INDEX/MATCH and XLOOKUP data pipelines",
                        "Monte Carlo return distribution simulations",
                        "Conditional formatted KPI risk gauges"
                    )
                )
            )
            "frontend_dev" -> listOf(
                ProjectRecommendation(
                    id = "fe_1",
                    title = "SkillGap Career Management SaaS Web App",
                    targetRole = "Frontend Developer",
                    difficulty = "Advanced",
                    skillsCovered = listOf("React", "TypeScript", "Tailwind CSS", "REST APIs", "Responsive Design"),
                    description = "A responsive web application allowing developers to benchmark skills against live job market descriptions with interactive charts and theme switching.",
                    expectedOutcome = "Production deployed React 18+ application with 100% Lighthouse accessibility score and zero layout shift.",
                    suggestedFeatures = listOf(
                        "Type-safe API client with TanStack Query caching",
                        "Custom SVG / Canvas charts for skill distribution",
                        "Dark/Light dynamic theme switching with Tailwind"
                    ),
                    architectureTip = "Separate presenter UI components from custom container hooks for clean state isolation."
                ),
                ProjectRecommendation(
                    id = "fe_2",
                    title = "Interactive Kanban Project Planner",
                    targetRole = "Frontend Developer",
                    difficulty = "Intermediate",
                    skillsCovered = listOf("JavaScript", "React", "CSS", "Git"),
                    description = "A drag-and-drop workflow management tool featuring sprint columns, task tags, keyboard shortcuts, and local storage state persistence.",
                    expectedOutcome = "Snappy Trello clone supporting nested subtasks, optimistic updates, and undo/redo history.",
                    suggestedFeatures = listOf(
                        "HTML5 Drag & Drop API implementation",
                        "Framer Motion layout transitions",
                        "Accessible keyboard focus management"
                    )
                )
            )
            "backend_dev" -> listOf(
                ProjectRecommendation(
                    id = "be_1",
                    title = "Scalable Microservices E-Commerce API",
                    targetRole = "Backend Developer",
                    difficulty = "Advanced",
                    skillsCovered = listOf("Node.js", "PostgreSQL", "SQL", "Docker", "Authentication & Security"),
                    description = "Build a robust backend engine with JWT authentication, role-based access control (RBAC), database transaction isolation, and Redis rate limiting.",
                    expectedOutcome = "Containerized Docker service passing automated integration test suites and documented with OpenAPI/Swagger.",
                    suggestedFeatures = listOf(
                        "PostgreSQL ACID transactions for checkout order processing",
                        "JWT auth tokens with secure HTTP-only refresh cookies",
                        "Docker Compose orchestration for API, Postgres, and Redis"
                    ),
                    architectureTip = "Implement clean architecture with Domain Entities, Repositories, and Controller layers."
                ),
                ProjectRecommendation(
                    id = "be_2",
                    title = "Real-Time Collaborative Document Backend",
                    targetRole = "Backend Developer",
                    difficulty = "Intermediate",
                    skillsCovered = listOf("Node.js", "REST APIs", "System Design", "MongoDB"),
                    description = "A WebSocket-powered synchronization server enabling simultaneous multi-user document edits with conflict resolution.",
                    expectedOutcome = "WebSocket server handling concurrent connections with minimal latency and automatic reconnection fallback.",
                    suggestedFeatures = listOf(
                        "Operational Transformation or CRDT conflict resolution",
                        "Document version history checkpoints",
                        "Health check metrics endpoint for Prometheus"
                    )
                )
            )
            "fullstack_dev" -> listOf(
                ProjectRecommendation(
                    id = "fs_1",
                    title = "EdTech Learning Platform with Video Streaming",
                    targetRole = "Full Stack Developer",
                    difficulty = "Advanced",
                    skillsCovered = listOf("React", "Node.js", "PostgreSQL", "TypeScript", "Docker"),
                    description = "End-to-end learning management system featuring video uploads, interactive quizzes, progress tracking, and payment gateways.",
                    expectedOutcome = "Full-stack web application with responsive UI, authenticated REST backend, and PostgreSQL relational database.",
                    suggestedFeatures = listOf(
                        "Course catalog with multi-facet filters",
                        "Quiz engine with instant automated grading",
                        "Stripe / Razorpay payment integration"
                    )
                )
            )
            "data_scientist" -> listOf(
                ProjectRecommendation(
                    id = "ds_1",
                    title = "Customer Lifetime Value Predictive Engine",
                    targetRole = "Data Scientist",
                    difficulty = "Advanced",
                    skillsCovered = listOf("Python", "Machine Learning", "Scikit-Learn", "Statistics", "Pandas"),
                    description = "Train and validate gradient boosted regression trees to forecast future transactional spend for retail customers.",
                    expectedOutcome = "End-to-end ML pipeline with cross-validation, hyperparameter tuning via Optuna, and SHAP explainability plots.",
                    suggestedFeatures = listOf(
                        "Automated feature engineering with lag variables",
                        "Model evaluation using RMSE, MAE, and R-squared metrics",
                        "SHAP tree explainer for feature importance visualization"
                    )
                )
            )
            else -> listOf(
                ProjectRecommendation(
                    id = "gen_1",
                    title = "Production Case Study: ${role.title} Capstone",
                    targetRole = role.title,
                    difficulty = "Intermediate",
                    skillsCovered = role.requiredSkills.take(4).map { it.name },
                    description = "Solve an authentic industry problem tailored to ${role.title} using the highest-priority required technologies.",
                    expectedOutcome = "Fully documented project repository with unit tests, CI/CD pipeline, and public demo.",
                    suggestedFeatures = listOf(
                        "Architectural diagram and trade-off documentation",
                        "Automated test coverage for core business rules",
                        "Clean code adhering to industry style standards"
                    )
                )
            )
        }
    }
}
