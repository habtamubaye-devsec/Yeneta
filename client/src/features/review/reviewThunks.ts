// src/features/review/reviewThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api/courses";

//
// 📌 1. Get all reviews for a course
//
export const fetchCourseReviews = createAsyncThunk(
  "reviews/fetchCourseReviews",
  async (courseId: string, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/${courseId}/reviews`, {
        withCredentials: true,
      });
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

//
// 📌 2. Add a new review
//
export const addReview = createAsyncThunk(
  "reviews/addReview",
  async (
    {
      courseId,
      rating,
      comment,
    }: { courseId: string; rating: number; comment: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/${courseId}/review`,
        { rating, comment },
        { withCredentials: true }
      );
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

//
// 📌 3. Student → Get *their* own reviews
//
export const fetchMyReviews = createAsyncThunk(
  "reviews/fetchMyReviews",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/review/me`, {
        withCredentials: true,
      });
      return res.data.data; 
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

//
// 📌 4. Update review (student)
//
export const updateReview = createAsyncThunk(
  "reviews/updateReview",
  async ({ id, rating, comment }: any, thunkAPI) => {
    try {
      const res = await axios.patch(
        `${API_BASE_URL}/review/${id}`,
        { rating, comment },
        { withCredentials: true }
      );
      return res.data.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  }
);

//
// 📌 5. Delete review (student)
//
export const deleteReview = createAsyncThunk(
  "reviews/deleteReview",
  async (id: string, thunkAPI) => {
    try {
      const res = await axios.delete(`${API_BASE_URL}/review/${id}`, {
        withCredentials: true,
      });

      return id; // returning deleted review id
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  }
);

//
// 📌 6. Get Review Summary for All Courses
//
export const fetchReviewSummaryForCourses = createAsyncThunk(
  "reviews/fetchReviewSummaryForCourses",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/review/summary`, {
        withCredentials: true,
      });
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

//
// 📌 7. Get Review Summary for a Single Course
//
export const fetchReviewSummaryForSingleCourse = createAsyncThunk(
  "reviews/fetchReviewSummaryForSingleCourse",
  async (courseId: string, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/review/summary/${courseId}`,
        { withCredentials: true }
      );
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

//
// 📌 8. Instructor → Get Reviews for Their Courses
//
export const fetchInstructorReviews = createAsyncThunk(
  "reviews/fetchInstructorReviews",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/review/instructor`, {
        withCredentials: true,
      });
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

//
// 📌 9. Admin → Get ALL reviews
//
export const fetchReviewForAdmin = createAsyncThunk(
  "reviews/fetchReviewForAdmin",
  async (_, { rejectWithValue }) => { 
    try { 
      const res = await axios.get(
        `${API_BASE_URL}/admin/review`,
        { withCredentials: true }
      );
      console.log("Admin reviews fetched:", res.data.data);
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

//
// 📌 10. Admin → Delete ANY review
// ⭐ FIXED: unique action type
//
export const deleteReviewAdmin = createAsyncThunk(
  "reviews/deleteReviewAdmin",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await axios.delete(
        `${API_BASE_URL}/admin/review/${id}`,
        { withCredentials: true }
      );

      return id; // return deleted review ID
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete review"
      );
    }
  }
);
