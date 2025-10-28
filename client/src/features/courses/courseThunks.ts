// src/redux/course/courseThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:8000/api/courses"; // update to your backend URL

// ✅ Create Course (with image upload)
export const createCourse = createAsyncThunk(
  "courses/createCourse",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${API_URL}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true, // ✅ must be OUTSIDE headers
      });

      return data; // { success, message, data: course }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create course"
      );
    }
  }
);

// ✅ Unified Get / Search / Filter
export const fetchCourses = createAsyncThunk(
  "courses/fetchCourses",
  async (
    filters?: {
      search?: string;
      category?: string;
      level?: string;
      minPrice?: number;
      maxPrice?: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const params = new URLSearchParams();
      if (filters?.search) params.append("search", filters.search);
      if (filters?.category) params.append("category", filters.category);
      if (filters?.level) params.append("level", filters.level);
      if (filters?.minPrice) params.append("minPrice", filters.minPrice.toString());
      if (filters?.maxPrice) params.append("maxPrice", filters.maxPrice.toString());

      const { data } = await axios.get(`${API_URL}?${params.toString()}`);
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch courses");
    }
  }
);

// ✅ Get Course by ID
export const getCourseById = createAsyncThunk(
  "courses/getCourseById",
  async (id: string, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/${id}`);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Course not found");
    }
  }
);

// ✅ Update Course
export const updateCourse = createAsyncThunk(
  "courses/updateCourse",
  async (
    { id, formData }: { id: string; formData: FormData },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await axios.put(`${API_URL}/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true, // ✅ must be inside the same config object
      });
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Failed to update course"
      );
    }
  }
);

// 🔹 Toggle Publish Course
export const togglePublishCourse = createAsyncThunk(
  "courses/togglePublish",
  async (courseId: string, thunkAPI) => {
    try {
      const token = localStorage.getItem("token"); // or from Redux state if stored there

      const res = await axios.patch(
        `${API_URL}/${courseId}/publish`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      return res.data.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Error toggling publish"
      );
    }
  }
);


// ✅ Delete Course
export const deleteCourse = createAsyncThunk(
  "courses/deleteCourse",
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${id}`, { withCredentials: true });
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to delete course");
    }
  }
);
