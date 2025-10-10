// src/app/api/interview/generate/route.ts
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const { stack = "react", count = 6 } = await req.json().catch(()=>({}));

    // Simple mock generator (replace with AI)
    const base = {
      react: [
        "Explain the virtual DOM and difference from real DOM.",
        "How would you optimize a slow React app?",
        "Explain hooks and custom hooks you wrote."
      ],
      node: [
        "Explain event loop in Node.js.",
        "How would you design a scalable REST API?",
        "Describe a memory leak you fixed."
      ]
    } as Record<string, string[]>;

    const pool = base[stack] || base.react;
    const questions = Array.from({ length: count }).map((_, i) => ({
      id: uuidv4(),
      question: pool[i % pool.length],
      type: "text"
    }));

    return NextResponse.json({ success: true, questions }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
