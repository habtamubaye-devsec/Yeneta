import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = "http://localhost:8000/api/dashboard";

export const fetchStudentDashboard = createAsyncThunk(
  "dashboard/fetchStudent",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_BASE}/students`, { withCredentials: true });
      // server replies sometimes put fields at top-level (res.data) or nested (res.data.data)
      return res.data.data ?? res.data ?? {};
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to load student dashboard");
    }
  }
);

export const fetchInstructorDashboard = createAsyncThunk(
  "dashboard/fetchInstructor",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_BASE}/instructors`, { withCredentials: true });
      return res.data.data ?? res.data ?? {};
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to load instructor dashboard");
    }
  }
);

// Admin / Superadmin endpoints are not currently implemented server-side in this project.
// We provide thunks so the UI can call them once the server supports those endpoints.
export const fetchAdminDashboard = createAsyncThunk(
  "dashboard/fetchAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_BASE}/admin`, { withCredentials: true });
      // admin endpoint returns { success, totalUsers, totalCourses, totalEnrollments, totalRevenue, instructorRequests, awaitingCourseApproval }
      return res.data.data ?? res.data ?? {};
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to load admin dashboard");
    }
  }
);

export const fetchSuperAdminDashboard = createAsyncThunk(
  "dashboard/fetchSuperAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_BASE}/superadmins`, { withCredentials: true });
      return res.data.data ?? res.data ?? {};
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to load superadmin dashboard");
    }
  }
);

export default {};
