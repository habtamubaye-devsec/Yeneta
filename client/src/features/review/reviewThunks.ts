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
      console.log(res.data.data);
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
// 📌 3. Student → Get *their* own review
//
export const fetchMyReview = createAsyncThunk(
  "reviews/fetchMyReview",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/review/me`, {
        withCredentials: true,
      });
      console.log(res.data.data);
      return res.data.data || null;
    } catch (err: any) {
      console.log(err);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateReview = createAsyncThunk(
  "reviews/updateReview",
  async ({ id, rating, comment }: any, thunkAPI) => {
    try {
      const res = axios.get(`${API_BASE_URL}/review/delete`, {
        rating,
        comment,
      });
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  }
);

export const deleteReview = createAsyncThunk(
  "reviews/deleteReview",
  async (id: number, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(`${API_BASE_URL}/review/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      return id;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  }
);

//
// 📌 4. Instructor → Get reviews for their courses
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
