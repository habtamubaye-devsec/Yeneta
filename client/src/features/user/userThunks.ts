import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { message } from "antd";

const API_URL = "http://localhost:8000/api/user"

// ✅ Fetch all users
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }, withCredentials: true,
      });
      console.log("Fetched users:", response.data);

      // ✅ Make sure to return the actual array
        return response.data.users || [];
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch users"
      );
    }
  }
);

// ✅ Ban and unban a user
export const banAndUnbanUser = createAsyncThunk(
  "users/banAndUnbanUser",
  async ({ userId, status }: { userId: string; status: "banned" | "active" }, { rejectWithValue }) => {
    try {
      const res = await axios.patch(
        `${API_URL}/${userId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }, withCredentials: true }
      );
      console.log("Updated user response:", res.data);
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
      const res = await axios.delete(`${API_URL}/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        withCredentials: true,
      });
      console.log("Deleted user response:", res.data);
      return userId;
    } catch (err: any) {
      message.error(err.response?.data?.message || "Failed to delete user");
      return rejectWithValue(err.response?.data?.message || "Error deleting user");
    }
  }
);  
