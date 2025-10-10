// src/store/slices/interviewSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Question = {
  id: string;
  question: string;
  type?: "text" | "mcq";
  options?: string[];
};

type InterviewState = {
  // Onboarding
  candidateInfo: {
    name?: string | null;
    email?: string | null;
    phone?: string | null;
  };
  selectedStack?: string | null;
  // Interview
  questions: Question[];
  responses: Record<string, { answer: string; timeTaken?: number }>;
  currentIndex: number;
  durationPerQuestion: number; // seconds
  test: string;
  status: "idle" | "in_progress" | "completed";
  // result placeholder
  result?: {
    score?: number;
    summary?: string;
    perQuestion?: Record<string, any>;
  } | null;
};

const initialState: InterviewState = {
  candidateInfo: { name: null, email: null, phone: null },
  selectedStack: null,
  questions: [],
  responses: {},
  currentIndex: 0,
  durationPerQuestion: 60,
  test: "Hello Test",
  status: "idle",
  result: null,
};

const slice = createSlice({
  name: "interview",
  initialState,
  reducers: {
    setCandidateInfo(
      state,
      action: PayloadAction<InterviewState["candidateInfo"]>
    ) {
      state.candidateInfo = {
        ...(state.candidateInfo || {}),
        ...action.payload,
      };
    },
    setSelectedStack(state, action: PayloadAction<string>) {
      state.selectedStack = action.payload;
    },
    setQuestions(state, action: PayloadAction<Question[]>) {
      state.questions = action.payload;
      state.currentIndex = 0;
      state.responses = {};
      state.status = action.payload.length ? "in_progress" : "idle";
    },
    // setAnswer(state, action: PayloadAction<{ questionId: string; answer: string; timeTaken?: number }>) {
    //   state.responses[action.payload.questionId] = { answer: action.payload.answer, timeTaken: action.payload.timeTaken };
    // },
    setAnswer: (state, action: PayloadAction<{ questionId: string; answer: string }>) => {
      const { questionId, answer } = action.payload;
      if (!state.responses) {
        state.responses = {};
      }
      if (!state.responses[questionId]) {
        state.responses[questionId] = { answer: "" };
      }
      state.responses[questionId].answer = answer;
    },
    setCurrentIndex(state, action: PayloadAction<number>) {
      state.currentIndex = action.payload;
    },
    nextQuestion(state) {
      if (state.currentIndex < state.questions.length - 1) state.currentIndex++;
    },
    prevQuestion(state) {
      if (state.currentIndex > 0) state.currentIndex--;
    },
    setDuration(state, action: PayloadAction<number>) {
      state.durationPerQuestion = action.payload;
    },
    completeInterview(state) {
      state.status = "completed";
    },
    setResult(state, action: PayloadAction<InterviewState["result"]>) {
      state.result = action.payload;
    },
    resetInterview(state) {
      state.questions = [];
      state.responses = {};
      state.currentIndex = 0;
      state.status = "idle";
      state.result = null;
    },
  },
});

export const {
  setCandidateInfo,
  setSelectedStack,
  setQuestions,
  setAnswer,
  setCurrentIndex,
  nextQuestion,
  prevQuestion,
  setDuration,
  completeInterview,
  setResult,
  resetInterview,
} = slice.actions;
export default slice.reducer;
