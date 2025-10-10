// src/app/interviewee/report/[id]/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // ensure export
import { redirect } from "next/navigation";
import { Metadata } from "next";

type Props = { params: { id: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: `Report ${params.id}` };
}

export default async function ReportPage({ params }: Props) {
  const session = await getServerSession(authOptions as any);
  if (!session) redirect("/login");

  // Fetch interview report from DB using params.id; mocked here
  const report = {
    id: params.id,
    score: 78,
    summary: "Good basic answers; improve depth on architecture.",
    questions: [
      { id: "q1", question: "Explain virtual DOM", answer: "My answer", feedback: "Expand on reconciliation." }
    ],
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold">Interview Report — {report.id}</h1>
      <p className="text-gray-700 mt-2">Score: {report.score}</p>
      <p className="mt-4">{report.summary}</p>

      <div className="mt-6 space-y-4">
        {report.questions.map((q) => (
          <div key={q.id} className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold">{q.question}</h3>
            <p className="mt-2"><strong>Answer:</strong> {q.answer}</p>
            <p className="mt-1 text-sm text-gray-600"><strong>Feedback:</strong> {q.feedback}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
