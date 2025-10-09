// app/api/ai/summary/route.ts
import { NextRequest, NextResponse } from "next/server";
import { generateSummary } from "@/src/lib/ai";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, responses } = body;
  if (!name || !Array.isArray(responses)) return NextResponse.json({ ok: false, error: "invalid body" }, { status: 400 });
  try {
    const result = await generateSummary(name, responses);
    return NextResponse.json({ ok: true, result });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
