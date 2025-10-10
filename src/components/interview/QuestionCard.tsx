// src/components/interview/QuestionCard.tsx
"use client";
import React, { useEffect, useState, useRef } from "react";

type Props = {
  question: { id: string; question: string; type?: string };
  defaultAnswer?: string;
  duration: number;
  onAnswerChange: (answer: string) => void;
  onTimeUp: () => void;
};

export default function QuestionCard({ question, defaultAnswer = "", duration = 30, onAnswerChange, onTimeUp }: Props) {
  const [timeLeft, setTimeLeft] = useState<number>(duration);
  const [answer, setAnswer] = useState(defaultAnswer);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    setAnswer(defaultAnswer);
  }, [defaultAnswer, question.id]);

  useEffect(() => {
    setTimeLeft(duration);
    timerRef.current = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
          onTimeUp();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [question.id, duration, onTimeUp]);

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setAnswer(e.target.value);
    onAnswerChange(e.target.value);
  }

  return (
    <div className="bg-white p-6 rounded shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-semibold">Q: {question.question}</h3>
        <div className="text-sm px-2 py-1 bg-gray-100 rounded">{timeLeft}s</div>
      </div>

      <textarea value={answer} onChange={handleChange} placeholder="Type your answer..." className="w-full min-h-[160px] border rounded p-3" />
    </div>
  );
}
