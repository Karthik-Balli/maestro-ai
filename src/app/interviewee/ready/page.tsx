// src/app/interviewee/ready/page.tsx
"use client";
import { useSelector } from "react-redux";
import { RootState } from "@/store/index";
import { useRouter } from "next/navigation";

export default function ReadyPage() {
  const router = useRouter();
  const candidate = useSelector((s: RootState) => s.interview.candidateInfo);
  const stack = useSelector((s: RootState) => s.interview.selectedStack);

  if (!candidate?.name) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600">Please complete onboarding first.</p>
        <button onClick={() => router.push("/interviewee/onboarding")} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">Go to Onboarding</button>
      </div>
    );
  }

  function handleStart() {
    router.push("/interviewee/interview");
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Almost ready — {candidate.name}</h1>
      <p className="text-gray-600">Stack: <strong>{stack}</strong></p>
      <div className="bg-white p-6 rounded shadow space-y-4">
        <p>The interview will have 6 questions. Each question will have a 60s timer. You can navigate back and forth. Progress is saved automatically.</p>
        <div className="flex gap-2">
          <button onClick={handleStart} className="px-6 py-3 bg-green-600 text-white rounded">Start Interview</button>
          <button onClick={() => window.location.reload()} className="px-6 py-3 border rounded">Restart</button>
        </div>
      </div>
    </div>
  );
}
