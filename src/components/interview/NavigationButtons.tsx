// src/components/interview/NavigationButtons.tsx
"use client";
import React from "react";

type Props = {
  onPrev?: () => void;
  onNext?: () => void;
  onFinish?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
};

export default function NavigationButtons({ onPrev, onNext, onFinish, isFirst, isLast }: Props) {
  return (
    <div className="flex justify-between mt-4">
      <button onClick={onPrev} disabled={isFirst} className={`px-4 py-2 rounded ${isFirst ? "bg-gray-200" : "bg-gray-600 text-white"}`}>Back</button>
      {isLast ? (
        <button onClick={onFinish} className="px-4 py-2 rounded bg-green-600 text-white">Finish</button>
      ) : (
        <button onClick={onNext} className="px-4 py-2 rounded bg-blue-600 text-white">Next</button>
      )}
    </div>
  );
}
