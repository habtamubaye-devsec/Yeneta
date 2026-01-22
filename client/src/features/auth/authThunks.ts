import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/api";

// REGISTER STUDENT
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (
    { name, email, password }: { name: string; email: string; password: string },
    thunkAPI
  ) => {
    try {
      const res = await api.post("/api/auth/register", {
        name,
        email,
        password,
      });
      
      return res.data; // expects { message, userId }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Registration failed");
    }
  }
);

// VERIFY OTP
export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async (
    { userId, email, otp }: { userId?: string; email?: string; otp: string },
    thunkAPI
  ) => {
    try {
      const res = await api.post("/api/auth/verify-otp", {
        userId,
        email,
        otp,
      });
      return res.data; // expects { message }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "OTP verification failed" }
      );
    }
  }
);

// RESEND OTP
export const resendOtp = createAsyncThunk(
  "auth/resendOtp",
  async ({ email }: { email: string }, thunkAPI) => {
    try {
      const res = await api.post("/api/auth/resend-otp", { email });
      return res.data; // expects { message }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to resend OTP"
      );
    }
  }
);

//LOGIN
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }: { email: string; password: string }, thunkAPI) => {
    try {
      const res = await api.post(
        "/api/auth/login",
        { email, password },
        { withCredentials: true } // ok (api already uses withCredentials)
      );
      return res.data; // { message, user }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Login failed" }
      );
    }
  }
);


//CURRENT_USER
export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/api/auth/me", {
        withCredentials: true, // 👈 include cookie
      });
      return res.data.user;
    } catch {
      return thunkAPI.rejectWithValue(null);
    }
  }
);

//LOGOUT
export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  await api.post("/api/auth/logout", {}, { withCredentials: true });
});
