// src/app/interviewee/onboarding/page.tsx
"use client";

import ResumeUploader from "@/components/interviewee/ResumeUploader"; // your existing component
import { useDispatch, useSelector } from "react-redux";
import { setCandidateInfo, setSelectedStack } from "@/store/slices/interviewSlice";
import { RootState } from "@/store/index";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function OnboardingPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const candidate = useSelector((s: RootState) => s.interview.candidateInfo);
  const selectedStack = useSelector((s: RootState) => s.interview.selectedStack);
  const [stack, setStack] = useState<string>(selectedStack || "react");

  function handleParsed(info: any) {
    // parse returns { name, email, phone, rawText }
    dispatch(setCandidateInfo({ name: info.name || "", email: info.email || "", phone: info.phone || "" }));
  }

  function handleContinue() {
    if (!candidate?.name || !candidate?.email) {
      alert("Please fill name and email before continue.");
      return;
    }
    dispatch(setSelectedStack(stack));
    router.push("/interviewee/ready");
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Get ready — Onboarding</h1>

      <div>
        <h2 className="text-lg font-medium mb-2">Upload Resume</h2>
        <ResumeUploader onParsed={handleParsed} />
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-lg font-medium mb-2">Select Tech Stack</h2>
        <select value={stack} onChange={(e) => setStack(e.target.value)} className="p-2 border rounded">
          <option value="react">React / Frontend</option>
          <option value="node">Node / Backend</option>
          <option value="python">Python / Data</option>
        </select>
      </div>

      <div className="flex justify-end">
        <button onClick={handleContinue} className="px-5 py-2 bg-green-600 text-white rounded">
          Continue to Ready
        </button>
      </div>
    </div>
  );
}
