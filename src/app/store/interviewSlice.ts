import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type QA = {
    id?: string;
    difficulty?: string;
    question?: string;
    score?: number;
    feedback?: string;
    answer?: string;
};

type InterviewState = {
  questions: QA[];
  currentIndex: number;
  candidateInfo?: { name?: string; email?: string; phone?: string } | null;
  status: "idle" | "in_progress" | "paused" | "completed";
};

const initialState: InterviewState = {
    questions: [],
    currentIndex: 0,
    candidateInfo: null,
    status: "idle",
};

const slice = createSlice({
  name: "interview",
  initialState,
  reducers: {
    setQuestions(state, action: PayloadAction<QA[]>) {
      state.questions = action.payload;
      state.currentIndex = 0;
      state.status = action.payload.length ? "in_progress" : "idle";
    },
    answerQuestion(state, action: PayloadAction<{ id: string; answer: string }>) {
      const q = state.questions.find(x => x.id === action.payload.id);
      if (q) q.answer = action.payload.answer;
    },
    setCurrentIndex(state, action: PayloadAction<number>) {
      state.currentIndex = action.payload;
    },
    setCandidateInfo(state, action: PayloadAction<{ name?: string; email?: string; phone?: string }>) {
      state.candidateInfo = { ...(state.candidateInfo || {}), ...action.payload };
    },
    completeInterview(state) {
      state.status = "completed";
    },
    resetInterview(state) {
      state.questions = [];
      state.currentIndex = 0;
      state.status = "idle";
      state.candidateInfo = undefined;
    }
  }
});

export const { setQuestions, answerQuestion, setCurrentIndex, setCandidateInfo, completeInterview, resetInterview } = slice.actions;
export default slice.reducer;