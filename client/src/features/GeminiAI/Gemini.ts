import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/api";

// ========================
// THUNK: Ask AI Assistant
// ========================
export const askAssistantThunk = createAsyncThunk(
  "assistant/ask",
  async (message: string, { rejectWithValue }) => {
    try {
      const res = await api.post(
        "/api/gemini/ask",
        { prompt: message },
        { withCredentials: true }
      );
      return res.data; // { success, data }
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Something went wrong");
    }
  }
);

// ========================
// SLICE
// ========================
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface AssistantState {
  messages: Message[];
  loading: boolean;
  error: string | null;
}

const initialState: AssistantState = {
  messages: [], // store both user and AI messages here
  loading: false,
  error: null,
};

const assistantSlice = createSlice({
  name: "assistant",
  initialState,
  reducers: {
    addUserMessage(state, action: { payload: Message }) {
      state.messages.push(action.payload);
    },
    clearMessages(state) {
      state.messages = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(askAssistantThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(askAssistantThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push({
          id: Date.now().toString(),
          role: "assistant",
          content: action.payload.answer,
          timestamp: new Date().toISOString(),
        });
      })
      .addCase(askAssistantThunk.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { addUserMessage, clearMessages } = assistantSlice.actions;

export default assistantSlice.reducer;
