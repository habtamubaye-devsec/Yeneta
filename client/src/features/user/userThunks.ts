import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/api";
import { message } from "antd";

const API_URL = "/api/user"

// ✅ Fetch all users
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (
    role: "student" | "instructor" | "admin" | undefined,
    { rejectWithValue }
  ) => {
    try {
      const response = await api.get(API_URL, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }, withCredentials: true,
        params: role ? { role } : undefined,
      });

      // ✅ Make sure to return the actual array
        return response.data.users || [];
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch users"
      );
    }
  }
);

// ✅ Superadmin: update a user's role (admin/student/instructor)
export const updateUserRole = createAsyncThunk(
  "users/updateUserRole",
  async (
    { userId, role }: { userId: string; role: "student" | "instructor" | "admin" },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.patch(
        `${API_URL}/${userId}/role`,
        { role },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          withCredentials: true,
        }
      );
      return res.data.data;
    } catch (err: any) {
      message.error(err.response?.data?.message || "Failed to update user role");
      return rejectWithValue(err.response?.data?.message || "Error updating user role");
    }
  }
);

// ✅ Ban and unban a user
export const banAndUnbanUser = createAsyncThunk(
  "users/banAndUnbanUser",
  async ({ userId, status }: { userId: string; status: "banned" | "active" }, { rejectWithValue }) => {
    try {
      const res = await api.patch(
        `${API_URL}/${userId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }, withCredentials: true }
      );
      return res.data.data;
    } catch (err: any) {
      message.error(err.response?.data?.message || "Failed to update user status");
      return rejectWithValue(err.response?.data?.message || "Error updating user status");
    }
  }
);

export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (userId: string, { rejectWithValue }) => { 
    try {
      await api.delete(`${API_URL}/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        withCredentials: true,
      });
      return userId;
    } catch (err: any) {
      message.error(err.response?.data?.message || "Failed to delete user");
      return rejectWithValue(err.response?.data?.message || "Error deleting user");
    }
  }
);  

// Update password
export const updateUserPassword = createAsyncThunk(
  "user/updateUserPassword",
  async (passwordData: { currentPassword: string; newPassword: string; confirmPassword: string }, { rejectWithValue }) => {
    try {
      const res = await api.patch(`${API_URL}/current/password`, passwordData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        withCredentials: true,
      });
      message.success("Password updated successfully!");
      return res.data.data;
    } catch (err: any) {
      message.error(err.response?.data?.message || "Failed to update password");
      return rejectWithValue(err.response?.data?.message || "Error updating password");
    }
  }
);

// ✅ Update profile info (name, bio, image)
export const updateUserProfile = createAsyncThunk(
  "user/updateUserProfile",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`${API_URL}/current/updateProfile`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      return data.user;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to update profile");
    }
  }
);

// 🧠 Toggle Instructor Request Thunk
export const requestInstructor = createAsyncThunk(
  "user/requestInstructor",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.patch(
        `${API_URL}/request-instructor`,
        {}, // no body needed
        { withCredentials: true } // send cookies (auth)
      );
      return response.data.data; // backend returns { success, data: user }
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to send instructor request"
      );
    }
  }
);

// ✅ Fetch users who requested to be instructors
export const fetchInstructorRequests = createAsyncThunk(
  "user/fetchInstructorRequests",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/instructor-requests`, {
        withCredentials: true,
      });
      return response.data.data; // ✅ matches your backend shape
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch instructor requests"
      );
    }
  }
);

// ✅ Approve instructor request
export const approveInstructor = createAsyncThunk(
  "user/approveInstructor",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await api.patch(
        `${API_URL}/${userId}/approve-instructor`,
        {},
        { withCredentials: true }
      );
      return response.data.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to approve instructor"
      );
    }
  }
);

// ❌ Reject instructor
export const rejectInstructorRequest = createAsyncThunk(
  "user/rejectInstructorRequest",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await api.patch(
        `${API_URL}/${userId}/reject-instructor`,
        {},
        { withCredentials: true }
      );
      return response.data.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to reject instructor request"
      );
    }
  }
);