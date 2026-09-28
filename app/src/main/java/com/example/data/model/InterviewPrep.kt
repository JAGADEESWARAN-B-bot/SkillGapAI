package com.example.data.model

data class InterviewQuestion(
    val question: String,
    val keyConcept: String,
    val modelAnswerSummary: String,
    val followUpPrompt: String = ""
)

data class InterviewTopicSection(
    val category: String, // Technical, Practical Coding, System Design, Behavioral
    val title: String,
    val iconName: String,
    val overview: String,
    val questions: List<InterviewQuestion>
)

data class InterviewPrepGuide(
    val roleTitle: String,
    val preparationStrategy: String,
    val sections: List<InterviewTopicSection>
)
