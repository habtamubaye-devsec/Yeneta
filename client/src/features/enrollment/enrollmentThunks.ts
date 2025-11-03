import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = "http://localhost:8000/api/enrollment";

// Create Stripe checkout session and return session URL
export const createCheckoutSession = createAsyncThunk(
  "enrollment/createCheckout",
  async (courseId: string, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_BASE}/checkout/${courseId}`, {}, { withCredentials: true });
      return res.data.url; // server returns { success: true, url }
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to create checkout session");
    }
  }
);

// Manual enrollment for free courses / admins
export const enrollInCourse = createAsyncThunk(
  "enrollment/enroll",
  async (courseId: string, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_BASE}/enroll/${courseId}`, {}, { withCredentials: true });
      return res.data.data; // enrollment object
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to enroll in course");
    }
  }
);

// Fetch current user's enrollments
export const fetchMyEnrollments = createAsyncThunk(
  "enrollment/fetchMy",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_BASE}/my`, { withCredentials: true });
      return res.data.data || [];
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch enrollments");
    }
  }
);
