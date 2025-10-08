// app/api/ai/questions/route.ts
import { NextResponse } from "next/server";
import { generateQuestions } from "@/src/lib/ai";

export async function GET() {
  try {
    const questions = await generateQuestions();
    return NextResponse.json({ ok: true, questions });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
