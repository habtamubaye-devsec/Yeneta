import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = "http://localhost:8000/api/enrollment";

// Create Stripe checkout session
export const createCheckoutSession = createAsyncThunk<
  string, // returns session URL
  string, // courseId
  { rejectValue: string }
>(
  "enrollment/createCheckout",
  async (courseId, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${API_BASE}/checkout/${courseId}`,
        {},
        { withCredentials: true }
      );
      return res.data.url;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create checkout session"
      );
    }
  }
);

// Manual enrollment for free courses / admins
export const enrollInCourse = createAsyncThunk<
  any, // returns Enrollment object
  string, // courseId
  { rejectValue: string }
>(
  "enrollment/enroll",
  async (courseId, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${API_BASE}/enroll/${courseId}`,
        {},
        { withCredentials: true }
      );
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to enroll in course"
      );
    }
  }
);

// Fetch current user's enrollments
export const fetchMyEnrollments = createAsyncThunk<
  any[], // returns Enrollment[]
  void,
  { rejectValue: string }
>(
  "enrollment/fetchMy",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_BASE}/my`, { withCredentials: true });
      return res.data.data || [];
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch enrollments"
      );
    }
  }
);

// Fetch enrollments by course (all users)
export const fetchEnrollmentByCourse = createAsyncThunk<
  any, // returns a single enrollment
  string,
  { rejectValue: string }
>(
  "enrollment/fetchEnrollmentByCourse",
  async (courseId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_BASE}/course/${courseId}`, {
        withCredentials: true,
      });
      const data = res.data.data;
      console.log("Enrollment for this course:", data);
      return data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch enrollment by course"
      );
    }
  }
);

// Get enrollment count by course
export const getEnrollmentsLengthByCourse = createAsyncThunk<
  number, // return type
  string, // courseId
  { rejectValue: string }
>(
  "enrollment/getEnrollmentsLengthByCourse",
  async (courseId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token"); // optional
      const { data } = await axios.get(`${API_BASE}/length/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      return data.data.count;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch enrollments count"
      );
    }
  }
);

// Update lesson progress
export const updateLessonProgress = createAsyncThunk<
  { courseId: string; completedLessons: any[] },
  { courseId: string; lessonId: string },
  { rejectValue: string }
>(
  "enrollment/updateProgress",
  async ({ courseId, lessonId }, { rejectWithValue }) => {
    try {
      const res = await axios.patch(
        `${API_BASE}/${courseId}/progress`,
        { lessonId },
        { withCredentials: true }
      );
      return { courseId, completedLessons: res.data.data };
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update lesson progress"
      );
    }
  }
);
