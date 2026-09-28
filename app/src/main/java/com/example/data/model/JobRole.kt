package com.example.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey

data class RequiredSkill(
    val name: String,
    val category: String,
    val requiredLevel: String, // Beginner, Intermediate, Advanced, Expert
    val isCore: Boolean = true, // Core skills carry more weight
    val prerequisites: List<String> = emptyList(),
    val importanceWeight: Double = 1.0 // 1.0 to 1.5
)

@Entity(tableName = "target_roles")
data class JobRoleEntity(
    @PrimaryKey
    val id: String,
    val title: String,
    val category: String,
    val description: String,
    val averageSalaryRange: String,
    val demandLevel: String, // High, Very High, Moderate
    val skillsJson: String, // JSON serialized required skills
    val isCustom: Boolean = false
)

data class JobRole(
    val id: String,
    val title: String,
    val category: String,
    val description: String,
    val averageSalaryRange: String,
    val demandLevel: String,
    val requiredSkills: List<RequiredSkill>,
    val isCustom: Boolean = false
)

object PredefinedJobRoles {
    val roles: List<JobRole> = listOf(
        JobRole(
            id = "data_analyst",
            title = "Data Analyst",
            category = "Data & AI",
            description = "Analyzes raw data to uncover trends, build interactive business dashboards, and empower stakeholder decision-making.",
            averageSalaryRange = "$65,000 - $95,000",
            demandLevel = "Very High",
            requiredSkills = listOf(
                RequiredSkill("SQL", "Database", "Advanced", true, emptyList(), 1.3),
                RequiredSkill("Python", "Programming", "Intermediate", true, emptyList(), 1.2),
                RequiredSkill("Excel", "Tools & Version Control", "Advanced", true, emptyList(), 1.0),
                RequiredSkill("Power BI", "Data & AI", "Intermediate", true, listOf("Excel"), 1.2),
                RequiredSkill("Statistics", "Data & AI", "Intermediate", true, emptyList(), 1.1),
                RequiredSkill("Data Visualization", "Data & AI", "Intermediate", true, listOf("Python"), 1.0),
                RequiredSkill("Pandas", "Data & AI", "Intermediate", true, listOf("Python"), 1.1),
                RequiredSkill("NumPy", "Data & AI", "Intermediate", false, listOf("Python"), 0.9),
                RequiredSkill("Communication", "Soft Skills", "Intermediate", true, emptyList(), 1.0),
                RequiredSkill("Problem Solving", "Soft Skills", "Advanced", true, emptyList(), 1.0)
            )
        ),
        JobRole(
            id = "frontend_dev",
            title = "Frontend Developer",
            category = "Frontend",
            description = "Crafts responsive, performant, and accessible user interfaces for web and mobile platforms.",
            averageSalaryRange = "$70,000 - $110,000",
            demandLevel = "Very High",
            requiredSkills = listOf(
                RequiredSkill("JavaScript", "Programming", "Advanced", true, emptyList(), 1.3),
                RequiredSkill("React", "Frontend", "Advanced", true, listOf("JavaScript", "HTML", "CSS"), 1.4),
                RequiredSkill("TypeScript", "Programming", "Intermediate", true, listOf("JavaScript"), 1.2),
                RequiredSkill("HTML", "Frontend", "Advanced", true, emptyList(), 1.0),
                RequiredSkill("CSS", "Frontend", "Advanced", true, emptyList(), 1.0),
                RequiredSkill("Tailwind CSS", "Frontend", "Intermediate", false, listOf("CSS"), 0.9),
                RequiredSkill("Git", "Tools & Version Control", "Intermediate", true, emptyList(), 1.0),
                RequiredSkill("REST APIs", "Backend", "Intermediate", true, emptyList(), 1.1),
                RequiredSkill("Responsive Design", "Frontend", "Advanced", true, listOf("CSS"), 1.0),
                RequiredSkill("Problem Solving", "Soft Skills", "Intermediate", true, emptyList(), 1.0)
            )
        ),
        JobRole(
            id = "backend_dev",
            title = "Backend Developer",
            category = "Backend",
            description = "Architects robust microservices, database schemas, secure authentication, and high-performance server APIs.",
            averageSalaryRange = "$75,000 - $120,000",
            demandLevel = "Very High",
            requiredSkills = listOf(
                RequiredSkill("Node.js", "Backend", "Advanced", true, listOf("JavaScript"), 1.3),
                RequiredSkill("SQL", "Database", "Advanced", true, emptyList(), 1.3),
                RequiredSkill("PostgreSQL", "Database", "Intermediate", true, listOf("SQL"), 1.1),
                RequiredSkill("REST APIs", "Backend", "Advanced", true, emptyList(), 1.2),
                RequiredSkill("Docker", "Cloud & DevOps", "Intermediate", true, emptyList(), 1.1),
                RequiredSkill("Git", "Tools & Version Control", "Intermediate", true, emptyList(), 1.0),
                RequiredSkill("System Design", "Backend", "Intermediate", true, emptyList(), 1.2),
                RequiredSkill("Authentication & Security", "Backend", "Intermediate", true, emptyList(), 1.1),
                RequiredSkill("MongoDB", "Database", "Intermediate", false, emptyList(), 0.9),
                RequiredSkill("Problem Solving", "Soft Skills", "Advanced", true, emptyList(), 1.0)
            )
        ),
        JobRole(
            id = "fullstack_dev",
            title = "Full Stack Developer",
            category = "Frontend",
            description = "Bridges the gap between engaging user interfaces and scalable server-side systems and databases.",
            averageSalaryRange = "$80,000 - $130,000",
            demandLevel = "Very High",
            requiredSkills = listOf(
                RequiredSkill("JavaScript", "Programming", "Advanced", true, emptyList(), 1.3),
                RequiredSkill("React", "Frontend", "Advanced", true, listOf("JavaScript"), 1.3),
                RequiredSkill("Node.js", "Backend", "Advanced", true, listOf("JavaScript"), 1.3),
                RequiredSkill("SQL", "Database", "Intermediate", true, emptyList(), 1.2),
                RequiredSkill("PostgreSQL", "Database", "Intermediate", true, listOf("SQL"), 1.1),
                RequiredSkill("TypeScript", "Programming", "Intermediate", true, listOf("JavaScript"), 1.1),
                RequiredSkill("Git", "Tools & Version Control", "Intermediate", true, emptyList(), 1.0),
                RequiredSkill("Docker", "Cloud & DevOps", "Beginner", false, emptyList(), 0.9),
                RequiredSkill("HTML", "Frontend", "Advanced", true, emptyList(), 1.0),
                RequiredSkill("CSS", "Frontend", "Intermediate", true, emptyList(), 1.0)
            )
        ),
        JobRole(
            id = "data_scientist",
            title = "Data Scientist",
            category = "Data & AI",
            description = "Applies statistical modeling, machine learning, and data engineering to extract predictive insights from complex datasets.",
            averageSalaryRange = "$85,000 - $140,000",
            demandLevel = "High",
            requiredSkills = listOf(
                RequiredSkill("Python", "Programming", "Advanced", true, emptyList(), 1.3),
                RequiredSkill("Machine Learning", "Data & AI", "Advanced", true, listOf("Python", "Statistics"), 1.4),
                RequiredSkill("Statistics", "Data & AI", "Advanced", true, emptyList(), 1.3),
                RequiredSkill("SQL", "Database", "Intermediate", true, emptyList(), 1.1),
                RequiredSkill("Pandas", "Data & AI", "Advanced", true, listOf("Python"), 1.2),
                RequiredSkill("Scikit-Learn", "Data & AI", "Advanced", true, listOf("Python", "Machine Learning"), 1.2),
                RequiredSkill("Data Visualization", "Data & AI", "Intermediate", true, listOf("Python"), 1.0),
                RequiredSkill("Deep Learning", "Data & AI", "Intermediate", false, listOf("Machine Learning"), 1.1),
                RequiredSkill("Git", "Tools & Version Control", "Intermediate", true, emptyList(), 1.0)
            )
        ),
        JobRole(
            id = "ai_ml_engineer",
            title = "AI/ML Engineer",
            category = "Data & AI",
            description = "Designs, trains, fine-tunes, and deploys scalable artificial intelligence and deep learning models into production systems.",
            averageSalaryRange = "$90,000 - $150,000",
            demandLevel = "Very High",
            requiredSkills = listOf(
                RequiredSkill("Python", "Programming", "Advanced", true, emptyList(), 1.3),
                RequiredSkill("Machine Learning", "Data & AI", "Advanced", true, listOf("Python", "Statistics"), 1.4),
                RequiredSkill("Deep Learning", "Data & AI", "Advanced", true, listOf("Machine Learning"), 1.4),
                RequiredSkill("PyTorch", "Data & AI", "Advanced", true, listOf("Deep Learning"), 1.3),
                RequiredSkill("TensorFlow", "Data & AI", "Intermediate", false, listOf("Deep Learning"), 1.1),
                RequiredSkill("Docker", "Cloud & DevOps", "Intermediate", true, emptyList(), 1.1),
                RequiredSkill("MLOps", "Data & AI", "Intermediate", true, listOf("Docker"), 1.2),
                RequiredSkill("Statistics", "Data & AI", "Advanced", true, emptyList(), 1.2),
                RequiredSkill("Git", "Tools & Version Control", "Intermediate", true, emptyList(), 1.0)
            )
        ),
        JobRole(
            id = "python_developer",
            title = "Python Developer",
            category = "Backend",
            description = "Develops backend applications, automation workflows, microservices, and scripts using Python ecosystems.",
            averageSalaryRange = "$70,000 - $115,000",
            demandLevel = "High",
            requiredSkills = listOf(
                RequiredSkill("Python", "Programming", "Advanced", true, emptyList(), 1.5),
                RequiredSkill("Django", "Backend", "Intermediate", true, listOf("Python"), 1.2),
                RequiredSkill("FastAPI", "Backend", "Intermediate", true, listOf("Python"), 1.2),
                RequiredSkill("SQL", "Database", "Intermediate", true, emptyList(), 1.1),
                RequiredSkill("PostgreSQL", "Database", "Intermediate", true, listOf("SQL"), 1.0),
                RequiredSkill("Git", "Tools & Version Control", "Intermediate", true, emptyList(), 1.0),
                RequiredSkill("Docker", "Cloud & DevOps", "Intermediate", false, emptyList(), 1.0),
                RequiredSkill("REST APIs", "Backend", "Advanced", true, emptyList(), 1.1)
            )
        ),
        JobRole(
            id = "java_developer",
            title = "Java Developer",
            category = "Backend",
            description = "Builds enterprise-grade backend services, distributed systems, and Spring Boot applications.",
            averageSalaryRange = "$75,000 - $125,000",
            demandLevel = "High",
            requiredSkills = listOf(
                RequiredSkill("Java", "Programming", "Advanced", true, emptyList(), 1.5),
                RequiredSkill("Spring Boot", "Backend", "Advanced", true, listOf("Java"), 1.4),
                RequiredSkill("SQL", "Database", "Advanced", true, emptyList(), 1.2),
                RequiredSkill("PostgreSQL", "Database", "Intermediate", true, listOf("SQL"), 1.0),
                RequiredSkill("Microservices", "Backend", "Intermediate", true, listOf("Spring Boot"), 1.2),
                RequiredSkill("Git", "Tools & Version Control", "Intermediate", true, emptyList(), 1.0),
                RequiredSkill("Docker", "Cloud & DevOps", "Intermediate", true, emptyList(), 1.0),
                RequiredSkill("JUnit", "Testing & QA", "Intermediate", true, listOf("Java"), 1.0)
            )
        ),
        JobRole(
            id = "cloud_engineer",
            title = "Cloud Engineer",
            category = "Cloud & DevOps",
            description = "Provisions, secures, and automates resilient cloud infrastructure on AWS, GCP, or Azure.",
            averageSalaryRange = "$85,000 - $135,000",
            demandLevel = "Very High",
            requiredSkills = listOf(
                RequiredSkill("AWS", "Cloud & DevOps", "Advanced", true, emptyList(), 1.4),
                RequiredSkill("Docker", "Cloud & DevOps", "Advanced", true, emptyList(), 1.3),
                RequiredSkill("Kubernetes", "Cloud & DevOps", "Intermediate", true, listOf("Docker"), 1.3),
                RequiredSkill("Linux", "Tools & Version Control", "Advanced", true, emptyList(), 1.2),
                RequiredSkill("Terraform", "Cloud & DevOps", "Intermediate", true, emptyList(), 1.2),
                RequiredSkill("CI/CD", "Cloud & DevOps", "Intermediate", true, emptyList(), 1.1),
                RequiredSkill("Python", "Programming", "Intermediate", false, emptyList(), 1.0),
                RequiredSkill("Git", "Tools & Version Control", "Intermediate", true, emptyList(), 1.0)
            )
        ),
        JobRole(
            id = "cybersecurity_analyst",
            title = "Cybersecurity Analyst",
            category = "Security",
            description = "Monitors networks, identifies vulnerabilities, mitigates threats, and enforces organizational security hygiene.",
            averageSalaryRange = "$80,000 - $125,000",
            demandLevel = "Very High",
            requiredSkills = listOf(
                RequiredSkill("Network Security", "Security", "Advanced", true, emptyList(), 1.4),
                RequiredSkill("Linux", "Tools & Version Control", "Advanced", true, emptyList(), 1.2),
                RequiredSkill("Vulnerability Assessment", "Security", "Intermediate", true, emptyList(), 1.3),
                RequiredSkill("Incident Response", "Security", "Intermediate", true, emptyList(), 1.2),
                RequiredSkill("Python", "Programming", "Intermediate", false, emptyList(), 1.0),
                RequiredSkill("Cryptography", "Security", "Intermediate", true, emptyList(), 1.1),
                RequiredSkill("SIEM Tools", "Security", "Intermediate", true, emptyList(), 1.1),
                RequiredSkill("Problem Solving", "Soft Skills", "Advanced", true, emptyList(), 1.0)
            )
        ),
        JobRole(
            id = "database_admin",
            title = "Database Administrator",
            category = "Database",
            description = "Maintains database integrity, performance tuning, clustering, security backups, and replication.",
            averageSalaryRange = "$75,000 - $120,000",
            demandLevel = "High",
            requiredSkills = listOf(
                RequiredSkill("SQL", "Database", "Expert", true, emptyList(), 1.5),
                RequiredSkill("PostgreSQL", "Database", "Advanced", true, listOf("SQL"), 1.3),
                RequiredSkill("Database Tuning", "Database", "Advanced", true, listOf("SQL"), 1.3),
                RequiredSkill("Backup & Disaster Recovery", "Database", "Advanced", true, emptyList(), 1.2),
                RequiredSkill("Linux", "Tools & Version Control", "Intermediate", true, emptyList(), 1.1),
                RequiredSkill("MongoDB", "Database", "Intermediate", false, emptyList(), 1.0),
                RequiredSkill("Data Modeling", "Database", "Advanced", true, emptyList(), 1.2)
            )
        ),
        JobRole(
            id = "ui_ux_designer",
            title = "UI/UX Designer",
            category = "Design & UX",
            description = "Creates user journey maps, wireframes, high-fidelity prototypes, design systems, and conducts usability research.",
            averageSalaryRange = "$65,000 - $105,000",
            demandLevel = "High",
            requiredSkills = listOf(
                RequiredSkill("Figma", "Design & UX", "Expert", true, emptyList(), 1.5),
                RequiredSkill("Wireframing & Prototyping", "Design & UX", "Advanced", true, listOf("Figma"), 1.3),
                RequiredSkill("User Research", "Design & UX", "Intermediate", true, emptyList(), 1.2),
                RequiredSkill("Design Systems", "Design & UX", "Advanced", true, listOf("Figma"), 1.3),
                RequiredSkill("Information Architecture", "Design & UX", "Intermediate", true, emptyList(), 1.1),
                RequiredSkill("HTML", "Frontend", "Beginner", false, emptyList(), 0.8),
                RequiredSkill("CSS", "Frontend", "Beginner", false, emptyList(), 0.8),
                RequiredSkill("Communication", "Soft Skills", "Advanced", true, emptyList(), 1.0)
            )
        ),
        JobRole(
            id = "business_analyst",
            title = "Business Analyst",
            category = "Data & AI",
            description = "Translates complex business workflows into functional requirements, process diagrams, and analytical insights.",
            averageSalaryRange = "$70,000 - $105,000",
            demandLevel = "High",
            requiredSkills = listOf(
                RequiredSkill("Excel", "Tools & Version Control", "Advanced", true, emptyList(), 1.3),
                RequiredSkill("SQL", "Database", "Intermediate", true, emptyList(), 1.2),
                RequiredSkill("Power BI", "Data & AI", "Intermediate", true, listOf("Excel"), 1.2),
                RequiredSkill("Requirement Analysis", "Soft Skills", "Advanced", true, emptyList(), 1.3),
                RequiredSkill("Process Modeling", "Soft Skills", "Intermediate", true, emptyList(), 1.1),
                RequiredSkill("Communication", "Soft Skills", "Expert", true, emptyList(), 1.3),
                RequiredSkill("Problem Solving", "Soft Skills", "Advanced", true, emptyList(), 1.1)
            )
        ),
        JobRole(
            id = "android_developer",
            title = "Android Developer",
            category = "Mobile",
            description = "Develops native Android applications using modern Kotlin, Jetpack Compose, Coroutines, and MVVM architecture.",
            averageSalaryRange = "$75,000 - $120,000",
            demandLevel = "High",
            requiredSkills = listOf(
                RequiredSkill("Kotlin", "Programming", "Advanced", true, emptyList(), 1.5),
                RequiredSkill("Jetpack Compose", "Frontend", "Advanced", true, listOf("Kotlin"), 1.4),
                RequiredSkill("Android SDK", "Mobile", "Advanced", true, listOf("Kotlin"), 1.3),
                RequiredSkill("Coroutines", "Programming", "Intermediate", true, listOf("Kotlin"), 1.2),
                RequiredSkill("Room", "Database", "Intermediate", true, listOf("SQL"), 1.1),
                RequiredSkill("Git", "Tools & Version Control", "Intermediate", true, emptyList(), 1.0),
                RequiredSkill("REST APIs", "Backend", "Intermediate", true, emptyList(), 1.1),
                RequiredSkill("MVVM Architecture", "Mobile", "Intermediate", true, emptyList(), 1.1)
            )
        )
    )

    fun getRoleById(id: String): JobRole? {
        return roles.find { it.id == id }
    }
}
