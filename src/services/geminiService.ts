interface GeminiInsightOptions {
  roleTitle: string;
  coveragePercent: number;
  missingSkills: string[];
  userSkills: string[];
}

export async function getGeminiCareerInsights(
  options: GeminiInsightOptions,
  customApiKey?: string
): Promise<string> {
  const apiKey =
    customApiKey ||
    import.meta.env.VITE_GEMINI_API_KEY ||
    localStorage.getItem('skillgap_gemini_api_key') ||
    '';

  if (!apiKey) {
    return generateDeterministicAdvice(options);
  }

  try {
    const prompt = `You are a senior tech career coach. Provide concise, high-impact career advice for a candidate targeting the ${
      options.roleTitle
    } role.
Current Skill Readiness: ${options.coveragePercent}%
Missing Critical Skills: ${options.missingSkills.join(', ')}
Current Strong Skills: ${options.userSkills.join(', ')}

Provide 3 specific bullet points:
1. High-priority focus area for the next 30 days
2. Portfolio project suggestion bridging their biggest gap
3. Key interview strategy to highlight existing competencies while addressing gaps.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    if (!response.ok) {
      console.warn('Gemini API call failed with status:', response.status);
      return generateDeterministicAdvice(options);
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (text) {
      return text;
    }
    return generateDeterministicAdvice(options);
  } catch (err) {
    console.warn('Gemini network call error, falling back to local advice:', err);
    return generateDeterministicAdvice(options);
  }
}

function generateDeterministicAdvice(options: GeminiInsightOptions): string {
  const missing = options.missingSkills.slice(0, 3).join(', ') || 'specialized domain tooling';
  return `### Strategic Action Plan for ${options.roleTitle}

1. **Immediate Skill Bridge (Next 30 Days)**: Focus intensely on **${missing}**. Allocate 60% of your study hours to coding exercises and 40% to reading core architectural documentation.

2. **Targeted Portfolio Project**: Build a production-grade application that integrates your strongest competencies with **${options.missingSkills[0] || 'core technologies'}**. Ensure you commit clean, testable code to GitHub with an architectural diagram and live demo.

3. **Interview Positioning**: Frame your current readiness (${options.coveragePercent}%) as a rapid growth trajectory. Emphasize your foundational problem-solving strengths and be prepared to explain your self-study roadmap for remaining competencies.`;
}
