import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  registerUser,
  verifyOtp,
  resendOtp,
  loginUser,
  fetchCurrentUser,
  logoutUser,
} from "./authThunks";

interface User {
  id: string;
  name?: string;
  email: string;
  role: "student" | "instructor" | "admin" | "superadmin" | "superAdmin";
  status?: "active" | "banned";
  isVerified?: boolean;
  isApproved?: boolean;
}

interface PendingVerification {
  userId?: string | null;
  email?: string | null;
}

interface AuthState {
  user: User | null;
  token: string | null;
  userId: string | null;
  loading: boolean;
  error: string | null;
  message: string | null;
  isAuthenticated: boolean; // ✅ Add this field
  pendingVerification: PendingVerification | null;
}

// ✅ Load saved user/token from localStorage on refresh
const storedToken = localStorage.getItem("token");
const storedUser = localStorage.getItem("user");
const storedPendingVerification = localStorage.getItem("pendingVerification");

const initialState: AuthState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  token: storedToken || null,
  userId: null,
  loading: false,
  error: null,
  message: null,
  isAuthenticated: !!storedToken, // ✅ Initialize based on token
  pendingVerification: storedPendingVerification
    ? JSON.parse(storedPendingVerification)
    : null,
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
      state.pendingVerification = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("pendingVerification");
    },

    setPendingVerification: (
      state,
      action: PayloadAction<PendingVerification | null>
    ) => {
      state.pendingVerification = action.payload;
      if (action.payload) {
        localStorage.setItem(
          "pendingVerification",
          JSON.stringify(action.payload)
        );
      } else {
        localStorage.removeItem("pendingVerification");
      }
    },
  },
  extraReducers: (builder) => {
    // REGISTER
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.userId = action.payload.userId;
        state.pendingVerification = {
          userId: action.payload.userId,
          email: action.payload.email,
        };
        localStorage.setItem(
          "pendingVerification",
          JSON.stringify(state.pendingVerification)
        );
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // OTP
    builder
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.pendingVerification = null;
        state.userId = null;
        localStorage.removeItem("pendingVerification");
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        if (action.payload && typeof action.payload === "object") {
          const payload = action.payload as { message?: string };
          state.error = payload.message || "OTP verification failed";
        } else {
          state.error = (action.payload as string) || "OTP verification failed";
        }
      })
      .addCase(resendOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.error = null;
      });

    // LOGIN
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true; // ✅ Set true after login
        state.pendingVerification = null;
        localStorage.removeItem("pendingVerification");
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        if (action.payload && typeof action.payload === "object") {
          const payload = action.payload as {
            message?: string;
            needsVerification?: boolean;
            userId?: string;
            email?: string;
          };

          if (payload.needsVerification) {
            state.pendingVerification = {
              userId: payload.userId,
              email: payload.email,
            };
            state.userId = payload.userId ?? null;
            localStorage.setItem(
              "pendingVerification",
              JSON.stringify(state.pendingVerification)
            );
            state.error = payload.message || "Please verify your email";
            return;
          }

          state.error = payload.message || "Login failed";
        } else {
          state.error = (action.payload as string) || "Login failed";
        }
      });

    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true; // ✅ Wait before redirect
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      });

    // LOGOUT (server cookie + local state)
    builder
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.userId = null;
        state.pendingVerification = null;
        state.isAuthenticated = false;
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("pendingVerification");
      })
      .addCase(logoutUser.rejected, (state) => {
        // Even if server logout fails, clear local state to prevent accessing protected pages
        state.loading = false;
        state.user = null;
        state.token = null;
        state.userId = null;
        state.pendingVerification = null;
        state.isAuthenticated = false;
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("pendingVerification");
      });
  },
});

export const { logout, setCredentials, setPendingVerification } = authSlice.actions;
export default authSlice.reducer;
