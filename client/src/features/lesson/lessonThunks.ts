// src/features/lesson/lessonThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/api";

const API_BASE = "/api/courses";

// ✅ Fetch all lessons by course
export const fetchLessons = createAsyncThunk(
  "lessons/fetchAll",
  async (courseId: string, { rejectWithValue }) => {
    try {
      const res = await api.get(`${API_BASE}/${courseId}/lessons`, {
        withCredentials: true, // if you're using session or cookies
      });
      return res.data.lessons || [];
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch lessons"
      );
    }
  }
);

// 🔹 Create a new lesson
export const createLesson = createAsyncThunk(
  "lessons/createLesson",
  async (
    { courseId, formData }: { courseId: string; formData: FormData },
    { rejectWithValue }
  ) => {
    try {
      if (!courseId) throw new Error("Missing course ID");
      console.log("📦 Creating lesson with FormData:", formData);
      const res = await api.post(`${API_BASE}/${courseId}/lessons`, formData, {
        withCredentials: true,
      });
      console.log("❇️ Create lesson response:", res.data);
      return res.data.lesson;
    } catch (err: any) {
      console.error("❌ Create lesson error:", err);
      return rejectWithValue(
        err.response?.data?.message || "Failed to create lesson"
      );
    }
  }
);

// ✅ Update existing lesson
export const updateLesson = createAsyncThunk(
  "lessons/update",
  async (
    { courseId, id, lessonData }: { courseId: string; id: string; lessonData: FormData },
    { rejectWithValue }
  ) => {
    try {
      if (!courseId) throw new Error("Missing course ID");
      const res = await api.put(`${API_BASE}/${courseId}/lessons/${id}`, lessonData, {
        withCredentials: true,
      });
      return res.data.lesson;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update lesson");
    }
  }
);

// ✅ Delete lesson
export const deleteLesson = createAsyncThunk(
  "lessons/delete",
  async (
    { courseId, id }: { courseId: string; id: string },
    { rejectWithValue }
  ) => {
    try {
      if (!courseId) throw new Error("Missing course ID");
      await api.delete(`${API_BASE}/${courseId}/lessons/${id}`, { withCredentials: true });
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete lesson");
    }
  }
);
