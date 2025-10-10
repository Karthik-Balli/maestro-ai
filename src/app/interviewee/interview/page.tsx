"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/index";
import {
  setQuestions,
  setAnswer,
  nextQuestion,
  prevQuestion,
  setDuration,
  completeInterview,
  setResult,
} from "@/store/slices/interviewSlice";
import QuestionCard from "@/components/interview/QuestionCard";
import NavigationButtons from "@/components/interview/NavigationButtons";
import { useRouter } from "next/navigation";

export default function InterviewSessionPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { questions, currentIndex, responses, durationPerQuestion, selectedStack } =
    useSelector((s: RootState) => s.interview);
    dispatch(setDuration(45)); // Example to set duration to 45 seconds

  // ⚡️ Load questions if not available
  useEffect(() => {
    if (!questions || questions.length === 0) {
      (async () => {
        try {
          const res = await fetch("/api/interview/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              stack: selectedStack || "react",
              count: 6,
            }),
          });

          const data = await res.json();
          if (data?.success) {
            dispatch(setQuestions(data.questions));
          } else {
            // If failed → redirect back to ready page
            router.push("/interviewee/ready");
          }
        } catch (err) {
          console.error("Failed to load questions:", err);
          router.push("/interviewee/ready");
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 🛡️ Guard clause for missing questions or bad index
  const isValidIndex =
    currentIndex >= 0 && currentIndex < (questions?.length || 0);
  const currentQuestion = isValidIndex ? questions[currentIndex] : null;

  // 🛡️ If no question loaded after fetch → redirect
  useEffect(() => {
    if (questions && questions.length === 0) {
      router.push("/interviewee/ready");
    }
  }, [questions, router]);

  useEffect(() => {
  console.log({
    questions,
    currentIndex,
    currentQuestion: questions?.[currentIndex],
    responses,
  });
}, [questions, currentIndex, responses]);


  const handleAnswerChange = (text: string) => {
    if (!currentQuestion) return;
    dispatch(
      setAnswer({ questionId: currentQuestion.id, answer: text })
    );
  };

  const handleTimeUp = () => {
    if (currentIndex < questions.length - 1) {
      dispatch(nextQuestion());
    } else {
      handleFinish();
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) dispatch(nextQuestion());
  };

  const handlePrev = () => {
    if (currentIndex > 0) dispatch(prevQuestion());
  };

  const handleFinish = async () => {
    if (!questions || questions.length === 0) return;
    try {
      const payload = { candidate: {}, questions, responses };
      const res = await fetch("/api/interview/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        dispatch(setResult(data.result));
        dispatch(completeInterview());
        router.push("/interviewee/completed");
      } else {
        alert("❌ Failed to submit interview. Try again.");
      }
    } catch (err) {
      console.error("Interview submission failed:", err);
      alert("❌ Something went wrong. Please try again.");
    }
  };

  // 🧭 Loading / invalid state fallback
  if (!currentQuestion) {
  return <div className="p-6 text-center text-gray-600">
    Preparing your interview session…
  </div>;
}

const defaultAnswer = currentQuestion
  ? responses?.[currentQuestion.id]?.answer || ""
  : "";


  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">
          Interview — Question {currentIndex + 1} / {questions.length}
        </h1>
        <div>Stack: {selectedStack}</div>
      </div>

      <QuestionCard
        question={currentQuestion}
        defaultAnswer={defaultAnswer}
        duration={durationPerQuestion}
        onAnswerChange={handleAnswerChange}
        onTimeUp={handleTimeUp}
      />

      <NavigationButtons
        onPrev={handlePrev}
        onNext={handleNext}
        onFinish={handleFinish}
        isFirst={currentIndex === 0}
        isLast={currentIndex === questions.length - 1}
      />
    </div>
  );
}
