// app/api/ai/evaluate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { evaluateAnswer } from "@/server/lib/ai";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { question, answer } = body;
  if (!question || typeof answer !== "string") {
    return NextResponse.json({ ok: false, error: "question and answer required" }, { status: 400 });
  }
  try {
    const result = await evaluateAnswer(question, answer);
    return NextResponse.json({ ok: true, result });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
