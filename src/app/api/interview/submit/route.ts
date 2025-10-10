// src/app/api/interview/submit/route.ts
import { NextResponse } from "next/server";

/**
 * Mock evaluation: accepts { candidate, questions, responses } and returns simple score + feedback
 * Replace this with a real AI evaluation in Phase 5.
 */
export async function POST(req: Request) {
  try {
    const payload = await req.json();
    // minimal validation
    const questions = payload.questions || [];
    const responses = payload.responses || {};

    // naive scoring: number of non-empty answers
    const answered = questions.filter((q:any) => responses[q.id]?.answer?.trim()).length;
    const score = Math.round((answered / Math.max(1, questions.length)) * 100);

    const summary = `Answered ${answered} of ${questions.length} questions. Keep practicing.`;
    const perQuestion = questions.reduce((acc:any, q:any) => {
      acc[q.id] = { feedback: responses[q.id]?.answer ? "Good attempt" : "No answer", score: responses[q.id]?.answer ? 1 : 0 };
      return acc;
    }, {});

    const result = { score, summary, perQuestion };

    // In production: save result to DB (Interview document), return ID
    return NextResponse.json({ success: true, result }, { status: 200 });
  } catch (err:any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
