// src/features/review/reviewSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import {
  fetchCourseReviews,
  addReview,
  fetchMyReview,
  fetchInstructorReviews,
  updateReview,
  deleteReview,
} from "./reviewThunks";

interface ReviewState {
  courseReviews: any[];
  myReview: any | null;
  instructorReviews: any[];

  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: ReviewState = {
  courseReviews: [],
  myReview: null,
  instructorReviews: [],

  loading: false,
  error: null,
  success: false,
};

const reviewSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {
    resetReviewState: (state) => {
      state.error = null;
      state.success = false;
    },
  },

  extraReducers: (builder) => {
    builder

      // ===========================
      // GET COURSE REVIEWS
      // ===========================
      .addCase(fetchCourseReviews.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCourseReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.courseReviews = Array.isArray(action.payload)
          ? action.payload
          : []; // SAFE
      })
      .addCase(fetchCourseReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.courseReviews = []; // PREVENT UNDEFINED
      })

      // ===========================
      // ADD REVIEW
      // ===========================
      .addCase(addReview.pending, (state) => {
        state.loading = true;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        if (!Array.isArray(state.courseReviews)) {
          state.courseReviews = [];
        }

        state.courseReviews.push(action.payload);
      })
      .addCase(addReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ===========================
      // GET MY REVIEW
      // ===========================
      .addCase(fetchMyReview.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyReview.fulfilled, (state, action) => {
        state.loading = false;
        state.myReview = action.payload ?? null;
      })
      .addCase(fetchMyReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.myReview = null;
      })

      // ===========================
      // UPDATE REVIEW
      // ===========================
      .addCase(updateReview.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        state.courseReviews = state.courseReviews.map((r) =>
          r.id === action.payload.id ? action.payload : r
        );
      })

      // ===========================
      // DELETE REVIEW
      // ===========================
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        // Use _id instead of id
        state.courseReviews = state.courseReviews.filter(
          (r) => r._id !== action.payload
        );

        // If myReview exists and matches, remove it too
        if (state.myReview && state.myReview._id === action.payload) {
          state.myReview = null;
        }
      })

      // ===========================
      // INSTRUCTOR REVIEWS
      // ===========================
      .addCase(fetchInstructorReviews.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchInstructorReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.instructorReviews = Array.isArray(action.payload)
          ? action.payload
          : [];
      })
      .addCase(fetchInstructorReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.instructorReviews = [];
      });
  },
});

export const { resetReviewState } = reviewSlice.actions;
export default reviewSlice.reducer;
