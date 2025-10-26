import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  registerUser,
  verifyOtp,
  resendOtp,
  loginUser,
  fetchCurrentUser,
} from "./authThunks";

interface User {
  id: string;
  email: string;
  role: "student" | "instructor" | "admin" | "superAdmin";
  isVerified?: boolean;
  isApproved?: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  userId: string | null;
  loading: boolean;
  error: string | null;
  message: string | null;
  isAuthenticated: boolean; // ✅ Add this field
}

// ✅ Load saved user/token from localStorage on refresh
const storedToken = localStorage.getItem("token");
const storedUser = localStorage.getItem("user");

const initialState: AuthState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  token: storedToken || null,
  userId: null,
  loading: false,
  error: null,
  message: null,
  isAuthenticated: !!storedToken, // ✅ Initialize based on token
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // ✅ Save credentials manually (useful after refresh)
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    // REGISTER
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.userId = action.payload.userId;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // OTP
    builder
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(resendOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      });

    // LOGIN
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true; // ✅ Set true after login
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.user = null;
      });
  },
});

export const { logout, setCredentials } = authSlice.actions;
export default authSlice.reducer;
