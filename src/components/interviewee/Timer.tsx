// components/interviewee/Timer.tsx
"use client";
import React, { useEffect, useState } from "react";

const TIME_MAP = { Easy: 20, Medium: 60, Hard: 120 };

export default function Timer({ difficulty, onExpire }: { difficulty: string; onExpire: (timeTaken?: number) => void }) {
  const total = TIME_MAP[difficulty] || 30;
  const [timeLeft, setTimeLeft] = useState(total);

  useEffect(() => {
    setTimeLeft(total);
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onExpire(total); // pass total as timeTaken
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [difficulty]);

  return (
    <div className="flex items-center gap-4">
      <div>Time left: {timeLeft}s</div>
      <div className="w-full h-2 bg-gray-200 rounded">
        <div style={{ width: `${(timeLeft / total) * 100}%`, height: "100%" }} className="bg-green-500 rounded" />
      </div>
    </div>
  );
}
