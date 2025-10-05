import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type User = {
  id?: string;
  name?: string;
  role?: "candidate" | "interviewer";
};

type Authstate = {
  accessToken?: string | null;
  user?: User | null;
  status?: "idle" | "loading" | "authenticated" | "failed";
};

const initialState: Authstate = {
  accessToken: null,
  user: null,
  status: "idle",
};

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth(state, action: PayloadAction<{ token: string; user: User }>) {
      state.accessToken = action.payload.token;
      state.user = action.payload.user;
      state.status = "authenticated";
    },
    clearAuth(state) {
      state.accessToken = null;
      state.user = null;
      state.status = "idle";
    },
  },
});


export const { setAuth, clearAuth } = slice.actions;
export default slice.reducer;