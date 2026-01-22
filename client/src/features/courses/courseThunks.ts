// src/redux/course/courseThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/api";

const API_URL = "/api/courses";

type CourseFilters = {
  search?: string;
  category?: string;
  level?: string;
  minPrice?: number;
  maxPrice?: number;
};

// ✅ Create Course (with image upload)
export const createCourse = createAsyncThunk(
  "courses/createCourse",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`${API_URL}/`, formData, {
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
  async (filters: CourseFilters | void, { rejectWithValue }) => {
    try {
      const f: CourseFilters = filters || {};
      const params = new URLSearchParams();
      if (f.search) params.append("search", f.search);
      if (f.category) params.append("category", f.category);
      if (f.level) params.append("level", f.level);
      if (f.minPrice) params.append("minPrice", f.minPrice.toString());
      if (f.maxPrice) params.append("maxPrice", f.maxPrice.toString());

      const { data } = await api.get(`${API_URL}?${params.toString()}`);
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch courses");
    }
  }
);

// ✅ Get Course by ID
export const getCourseById = createAsyncThunk(
  "courses/getCourseById",
  async (courseId: string, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`${API_URL}/${courseId}`);
      // Normalize backend variations: some endpoints return { data: course } or { course } or course directly
      console.log("🎯 getCourseById response:", data)
      return data.data ?? data.course ?? data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Course not found");
    }
  }
);
// ✅ Fetch Courses by Instructor
export const fetchCoursesByInstructor = createAsyncThunk(
  "courses/fetchByInstructor",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = (getState() as any).auth.user?.token;
      const config = {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      };

      const { data } = await api.get(`${API_URL}/instructor-courses`, config);

      console.log("🎯 Instructor courses response:", data);

      // ✅ Use 'data.data' since backend returns that key
      return data.data || [];
    } catch (error: any) {
      console.error("❌ Fetch instructor courses error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch instructor courses"
      );
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
      const { data } = await api.put(`${API_URL}/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true, // ✅ must be inside the same config object
      });
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to update course");
    }
  }
);

// 🔹 Toggle Publish Course
// 🔹 Toggle Publish / Unpublish / Request / Cancel
export const requestTogglePublish = createAsyncThunk(
  "courses/requestTogglePublish",
  async (courseId: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.patch(
        `${API_URL}/${courseId}/publish`,
        {}, // no body needed
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      console.log("🎯 Toggle publish request sent");
      console.log("🎯 Toggle publish response:", res.data);

      // Return both message and updated course
      return res.data;
    } catch (err: any) {
      const message =
        err.response?.data?.message || "❌ Failed to update publish status";
      return rejectWithValue(message);
    }
  }
);


// ✅ Delete Course
export const deleteCourse = createAsyncThunk(
  "courses/deleteCourse",
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`${API_URL}/${id}`, { withCredentials: true });
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to delete course");
    }
  }
);

// Fetch all courses
export const getAllCoursesForAdmin = createAsyncThunk(
  "courses/getAllCoursesForAdmin",
  async (_, { rejectWithValue, getState }) => {
    try {
      // ✅ Get token from auth state or localStorage
      const token =
        (getState() as any)?.auth?.user?.token || localStorage.getItem("token");

      if (!token) {
        throw new Error("Unauthorized: No token found");
      }

      const res = await api.get(`${API_URL}/admin/all-courses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      return res.data.data;
    } catch (error: any) {
      console.error("❌ getAllCoursesForAdmin error:", error);
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch courses"
      );
    }
  }
);

// Approve course
export const approveCourse = createAsyncThunk(
  "courses/approveCourse",
  async (courseId: string, { rejectWithValue, getState }) => {
    try {
      const token =
        (getState() as any)?.auth?.user?.token || localStorage.getItem("token");

      if (!token) {
        throw new Error("Unauthorized: No token found");
      }

      // ✅ Corrected placement of headers/config
      const res = await api.patch(
        `${API_URL}/${courseId}/approve`,
        {}, // empty body
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      return res.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to approve course"
      );
    }
  }
);

// Reject course
export const rejectCourse = createAsyncThunk(
  "courses/rejectCourse",
  async (courseId: string, { rejectWithValue, getState }) => {
    try {
      const token =
        (getState() as any)?.auth?.user?.token || localStorage.getItem("token");

      if (!token) {
        throw new Error("Unauthorized: No token found");
      }

      // ✅ Corrected placement of headers/config
      const res = await api.patch(`${API_URL}/${courseId}/reject`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      console.log("🎯 Reject course response:", res.data) ;
      return res.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to reject course");
    }
  }
);