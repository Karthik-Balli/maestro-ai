// src/app/interviewee/completed/page.tsx
"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store/index";
import { useRouter } from "next/navigation";

export default function CompletedPage() {
  const router = useRouter();
  const { result } = useSelector((s: RootState) => s.interview);

  if (!result) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold">Interview completed</h2>
        <p className="text-gray-600">Processing results…</p>
        <button onClick={() => router.push("/interviewee/interview")} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">Go to Interview</button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white p-6 rounded shadow text-center">
        <h1 className="text-2xl font-bold">Congratulations 🎉</h1>
        <p className="mt-2">Score: <strong>{result.score}</strong></p>
        <p className="mt-3 text-gray-700">{result.summary}</p>
        <div className="mt-6 flex justify-center gap-3">
          <button onClick={() => router.push("/interviewee/report/123")} className="px-4 py-2 bg-indigo-600 text-white rounded">View Detailed Report</button>
          <button onClick={() => router.push("/interviewee/onboarding")} className="px-4 py-2 border rounded">Try Again</button>
        </div>
      </div>
    </div>
  );
}
