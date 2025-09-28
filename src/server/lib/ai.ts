import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `
You are an AI-powered Interview Assistant expert for Full Stack Developer roles focusing on React + Node.js.
Tone: Professional, concise, encouraging.
Respond strictly in JSON when asked for structured output.
`;

export const generateQuestions = async () => {
  const prompt = `${SYSTEM_PROMPT}
Generate 2 Easy, 2 Medium and 2 Hard interview questions for a Full Stack Developer (React + Node.js).
Return JSON array: [{"difficulty":"Easy","question":"..."}, ...]
`;
  const res = await client.chat.completions.create({
    model: "gpt-4o-mini", // replace with an available AI model
    messages: [{ role: "system", content: SYSTEM_PROMPT }, { role: "user", content: prompt }],
    temperature: 0.2,
    max_tokens: 600
  });

  const text = res.choices?.[0]?.message?.content || "";
  try {
    const parsed = JSON.parse(text);
    return parsed;
  } catch (e) {
    // fallback: try to extract JSON block
    const jsonMatch = text.match(/\[.*\]/s);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    throw new Error("Failed to parse question JSON from AI: " + text);
  }
}

/**
 * Evaluate a single answer and return score (0-10) + feedback
 */
export async function evaluateAnswer(question: string, candidateAnswer: string) {
  const prompt = `
You are an expert interviewer. Evaluate the candidate answer for:
- correctness
- depth
- clarity

Question: ${question}
Answer: ${candidateAnswer}

Return JSON: {"score": number (0-10), "feedback": "short constructive feedback"}
`;
  const res = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "system", content: SYSTEM_PROMPT }, { role: "user", content: prompt }],
    temperature: 0.0,
    max_tokens: 300
  });
  const text = res.choices?.[0]?.message?.content || "";
  try {
    return JSON.parse(text);
  } catch (e) {
    const jsonMatch = text.match(/\{[\s\S]*\}/s);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    // safe fallback
    return { score: 5, feedback: "Could not parse AI response; default score" };
  }
}

/**
 * Generate final summary and final_score (0-100)
 */
export async function generateSummary(candidateName: string, responses: {question: string, answer: string, score: number}[]) {
  const prompt = `
Based on the following responses, create a final evaluation and score (0-100).
Candidate: ${candidateName}
Responses: ${JSON.stringify(responses)}
Return JSON: {"final_score": number, "summary": "2-3 sentence summary, strengths and weaknesses"}
`;
  const res = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "system", content: SYSTEM_PROMPT }, { role: "user", content: prompt }],
    temperature: 0.2,
    max_tokens: 300
  });
  const text = res.choices?.[0]?.message?.content || "";
  try {
    return JSON.parse(text);
  } catch (e) {
    const jsonMatch = text.match(/\{[\s\S]*\}/s);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    return { final_score: Math.round(responses.reduce((s, r) => s + r.score, 0) / responses.length * 10), summary: "Summary could not be generated." };
  }
}
