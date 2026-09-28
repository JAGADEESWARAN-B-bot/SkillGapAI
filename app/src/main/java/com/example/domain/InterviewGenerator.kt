package com.example.domain

import com.example.data.model.InterviewPrepGuide
import com.example.data.model.InterviewQuestion
import com.example.data.model.InterviewTopicSection
import com.example.data.model.JobRole

object InterviewGenerator {

    fun getInterviewGuideForRole(role: JobRole): InterviewPrepGuide {
        val sections = mutableListOf<InterviewTopicSection>()

        when (role.id) {
            "data_analyst" -> {
                sections.add(
                    InterviewTopicSection(
                        category = "Technical SQL & Database",
                        title = "SQL Joins, Aggregations & Window Functions",
                        iconName = "sql",
                        overview = "SQL is tested in nearly 100% of Data Analyst screening rounds. Focus on window ranking functions, subqueries, and null handling.",
                        questions = listOf(
                            InterviewQuestion(
                                question = "What is the difference between RANK(), DENSE_RANK(), and ROW_NUMBER()?",
                                keyConcept = "SQL Window Functions",
                                modelAnswerSummary = "ROW_NUMBER() assigns a unique sequential integer to each row. RANK() assigns the same rank to identical values, leaving gaps in rank numbers for subsequent rows. DENSE_RANK() also assigns the same rank to identical values but produces continuous numbers without gaps.",
                                followUpPrompt = "When would you prefer DENSE_RANK() over RANK() when finding the top 3 department earners?"
                            ),
                            InterviewQuestion(
                                question = "Explain the difference between WHERE and HAVING clauses.",
                                keyConcept = "Query Execution Order & Filtering",
                                modelAnswerSummary = "WHERE filters individual row records before any aggregation (GROUP BY) takes place. HAVING filters aggregated group metrics (like COUNT, SUM, AVG) after grouping has occurred.",
                                followUpPrompt = "Can you use HAVING without GROUP BY?"
                            ),
                            InterviewQuestion(
                                question = "How do you handle NULL values in aggregate functions like AVG() and COUNT()?",
                                keyConcept = "Three-Valued SQL Logic",
                                modelAnswerSummary = "COUNT(column) ignores NULLs, while COUNT(*) counts all rows including NULLs. AVG(column) ignores NULL rows in both numerator and denominator. Use COALESCE(column, 0) if NULLs represent valid zeros.",
                                followUpPrompt = "What does 'SELECT NULL = NULL' evaluate to in standard ANSI SQL?"
                            )
                        )
                    )
                )

                sections.add(
                    InterviewTopicSection(
                        category = "Analytical Thinking & Python",
                        title = "Exploratory Data Analysis & Metrics Definition",
                        iconName = "analytics",
                        overview = "Interviewers evaluate your ability to formulate hypotheses, clean dirty datasets with Pandas, and construct business KPIs.",
                        questions = listOf(
                            InterviewQuestion(
                                question = "How do you detect and handle outliers in skewed distributions?",
                                keyConcept = "Robust Statistics & Data Cleaning",
                                modelAnswerSummary = "For normal distributions, z-scores (+/- 3 standard deviations) work well. For skewed data, use the Interquartile Range (IQR) rule (Q1 - 1.5*IQR to Q3 + 1.5*IQR) or percentile capping (winsorization). Never drop outliers without business justification.",
                                followUpPrompt = "Why can the mean be misleading compared to median in salary distributions?"
                            ),
                            InterviewQuestion(
                                question = "Walk me through how you would define Churn Rate for a subscription product.",
                                keyConcept = "Product Analytics & KPI Formulation",
                                modelAnswerSummary = "Churn = (Subscribers lost during period T) / (Subscribers at start of period T). Distinguish between voluntary churn (user cancelled) and involuntary churn (payment failed), and cohort users by signup month.",
                                followUpPrompt = "How do high net-dollar-retention rates compensate for logo churn?"
                            )
                        )
                    )
                )
            }
            "frontend_dev", "fullstack_dev" -> {
                sections.add(
                    InterviewTopicSection(
                        category = "Core JavaScript / TypeScript",
                        title = "Async Execution, Closures & Event Loop",
                        iconName = "code",
                        overview = "Expect deep dives on JavaScript runtime mechanics, prototypes, closures, and asynchronous scheduling microtasks vs macrotasks.",
                        questions = listOf(
                            InterviewQuestion(
                                question = "Explain the JavaScript Event Loop, Call Stack, and Task Queues.",
                                keyConcept = "Single-threaded Concurrency Model",
                                modelAnswerSummary = "The Call Stack executes synchronous code. Asynchronous operations delegate to web APIs. Promises and queueMicrotask enqueue callbacks in the Microtask Queue, which executes completely before the Macrotask Queue (setTimeout, I/O) processes the next tick.",
                                followUpPrompt = "What is the output of 'console.log(1); setTimeout(() => console.log(2), 0); Promise.resolve().then(() => console.log(3));'?"
                            ),
                            InterviewQuestion(
                                question = "What is a Closure and what is a practical everyday use case?",
                                keyConcept = "Lexical Scoping",
                                modelAnswerSummary = "A closure is the combination of a function bundled together with references to its surrounding lexical state. Common use cases include data privacy (private variables in factories), event handler currying, and memoization caches.",
                                followUpPrompt = "Can excessive closures cause memory leaks in long-running single-page applications?"
                            )
                        )
                    )
                )

                sections.add(
                    InterviewTopicSection(
                        category = "React & Architecture",
                        title = "Virtual DOM, Reconciliation & Hook Mechanics",
                        iconName = "layers",
                        overview = "Senior interviewers test component lifecycle mental models, re-render optimization, and clean state sharing.",
                        questions = listOf(
                            InterviewQuestion(
                                question = "How does React's Reconciliation and Fiber architecture work?",
                                keyConcept = "Fiber Tree & Diffing Algorithm",
                                modelAnswerSummary = "React renders a virtual DOM tree and diffs it against the prior tree with an O(n) heuristic (key equality and component type checks). Fiber allows incremental, interruptible rendering with priority levels so user inputs remain responsive during heavy rendering.",
                                followUpPrompt = "Why should array indices generally not be used as unique React keys?"
                            ),
                            InterviewQuestion(
                                question = "When should you use useMemo and useCallback versus premature optimization?",
                                keyConcept = "Performance Optimization",
                                modelAnswerSummary = "useCallback memoizes function references passed to React.memo child components to prevent unnecessary re-renders. useMemo caches computationally expensive calculations. Overusing them adds memory overhead and dependency tracking boilerplate without measurable benefit.",
                                followUpPrompt = "How does React 19's compiler alter the need for manual useMemo calls?"
                            )
                        )
                    )
                )
            }
            else -> {
                sections.add(
                    InterviewTopicSection(
                        category = "Core Domain Competencies",
                        title = "${role.title} Technical Fundamentals",
                        iconName = "school",
                        overview = "Reviewing the foundational principles, design patterns, and engineering trade-offs expected for ${role.title}.",
                        questions = listOf(
                            InterviewQuestion(
                                question = "What are the core technical trade-offs you evaluate when choosing tools for ${role.title}?",
                                keyConcept = "Engineering Decision Making",
                                modelAnswerSummary = "Evaluate development velocity, operational overhead, community ecosystem, vertical vs horizontal scaling constraints, and team familiarity.",
                                followUpPrompt = "Describe an architectural decision you would re-evaluate in hindsight."
                            ),
                            InterviewQuestion(
                                question = "How do you guarantee test coverage and quality in production workflows?",
                                keyConcept = "Automated Testing & CI/CD",
                                modelAnswerSummary = "Follow the testing pyramid: comprehensive fast unit tests for business rules, targeted integration tests for databases and APIs, and critical path end-to-end smoke tests in staging.",
                                followUpPrompt = "What is your approach to testing flaky asynchronous dependencies?"
                            )
                        )
                    )
                )
            }
        }

        // Add universally important Behavioral & Project Discussion Section
        sections.add(
            InterviewTopicSection(
                category = "Behavioral & STAR Method",
                title = "Leadership, Conflict & Project Narrative",
                iconName = "people",
                overview = "Behavioral interviews assess teamwork, adaptability, dealing with ambiguous requirements, and learning from technical mistakes.",
                questions = listOf(
                    InterviewQuestion(
                        question = "Tell me about a time you encountered a critical bug or skill roadblock near a deadline.",
                        keyConcept = "STAR Technique (Situation, Task, Action, Result)",
                        modelAnswerSummary = "Structure your answer: Situation (context and tight timeframe), Task (responsibility), Action (debugging methodology, transparent team communication, root cause fix), Result (delivered outcome, preventive monitoring introduced).",
                        followUpPrompt = "What would you do differently if the same scenario occurred today?"
                    ),
                    InterviewQuestion(
                        question = "How do you prioritize technical debt against rapid feature delivery?",
                        keyConcept = "Product Pragmatism & Communication",
                        modelAnswerSummary = "Quantify technical debt in terms of business impact: degraded developer velocity, higher bug defect rates, or server latency. Schedule recurring percentage (e.g. 15-20% per sprint) for refactoring rather than waiting for catastrophic failure.",
                        followUpPrompt = "How do you explain the necessity of database indexing or refactoring to a non-technical stakeholder?"
                    )
                )
            )
        )

        return InterviewPrepGuide(
            roleTitle = role.title,
            preparationStrategy = "Prepare 3-5 minute high-level explanations for all core topics. Always follow technical claims with real project examples where you applied the concept.",
            sections = sections
        )
    }
}
