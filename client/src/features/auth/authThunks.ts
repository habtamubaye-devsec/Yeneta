import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// REGISTER STUDENT
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (
    { name, email, password }: { name: string; email: string; password: string },
    thunkAPI
  ) => {
    try {
      const res = await axios.post("http://localhost:8000/api/auth/register", {
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
  async ({ userId, otp }: { userId: string; otp: string }, thunkAPI) => {
    try {
      const res = await axios.post("http://localhost:8000/api/auth/verify-otp", {
        userId,
        otp,
      });
      return res.data; // expects { message }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "OTP verification failed");
    }
  }
);

// RESEND OTP
export const resendOtp = createAsyncThunk(
  "auth/resendOtp",
  async ({ email }: { email: string }, thunkAPI) => {
    try {
      const res = await axios.post("http://localhost:8000/api/auth/resend-otp", { email });
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
      const res = await axios.post(
        "http://localhost:8000/api/auth/login",
        { email, password },
        { withCredentials: true } // 👈 send/receive cookie
      );
      return res.data; // { message, user }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);


//CURRENT_USER
export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get("http://localhost:8000/api/auth/me", {
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
  await axios.post("http://localhost:8000/api/auth/logout", {}, { withCredentials: true });
});
