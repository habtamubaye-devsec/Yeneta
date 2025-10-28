// src/features/lesson/lessonThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = "http://localhost:8000/api/courses";

// ✅ Fetch all lessons by course
export const fetchLessons = createAsyncThunk(
  "lessons/fetchAll",
  async (courseId: string, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_BASE}/${courseId}/lessons`, {
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
  async (formData: FormData, { rejectWithValue, getState }: any) => {
    try {
      const { courses } = getState();
      const courseId = courses?.selectedCourse?._id || formData.get("courseId");

      if (!courseId) throw new Error("Missing course ID");

      const res = await axios.post(
        `${API_BASE}/${courseId}/lessons`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      return res.data.lesson;
    } catch (err: any) {
      console.error("❌ Create lesson error:", err);
      return rejectWithValue(err.response?.data?.message || "Failed to create lesson");
    }
  }
);

// ✅ Update existing lesson
export const updateLesson = createAsyncThunk(
  "lessons/update",
  async ({ id, lessonData }: { id: string; lessonData: FormData }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${LESSON_URL}/${id}`, lessonData, {
        headers: { "Content-Type": "multipart/form-data" },
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
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`${LESSON_URL}/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete lesson");
    }
  }
);
