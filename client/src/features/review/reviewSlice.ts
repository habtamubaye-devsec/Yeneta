import { createSlice } from "@reduxjs/toolkit";
import {
  fetchCourseReviews,
  addReview,
  fetchMyReviews,
  fetchInstructorReviews,
  fetchReviewSummaryForCourses,
  updateReview,
  deleteReview,
  fetchReviewSummaryForSingleCourse,
  fetchReviewForAdmin,
  deleteReviewAdmin, // admin review delete
} from "./reviewThunks";

interface ReviewState {
  courseReviews: any[];
  myReviews: any[];
  instructorReviews: any[];
  adminReviews: any[];
  summary: any[];
  singleCourseSummary: any | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: ReviewState = {
  courseReviews: [],
  myReviews: [],
  instructorReviews: [],
  adminReviews: [],
  summary: [],
  singleCourseSummary: null,
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
      // ============================================================
      // GET COURSE REVIEWS
      // ============================================================
      .addCase(fetchCourseReviews.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCourseReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.courseReviews = Array.isArray(action.payload)
          ? action.payload
          : [];
      })
      .addCase(fetchCourseReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.courseReviews = [];
      })

      // ============================================================
      // ADD REVIEW
      // ============================================================
      .addCase(addReview.pending, (state) => {
        state.loading = true;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        state.courseReviews.push(action.payload);
        state.myReviews.push(action.payload);
      })
      .addCase(addReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ============================================================
      // GET MY REVIEWS
      // ============================================================
      .addCase(fetchMyReviews.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.myReviews = Array.isArray(action.payload)
          ? action.payload
          : [];
      })
      .addCase(fetchMyReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.myReviews = [];
      })

      // ============================================================
      // UPDATE REVIEW
      // ============================================================
      .addCase(updateReview.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        const updated = action.payload.data;

        state.myReviews = state.myReviews.map((r) =>
          r._id === updated._id ? updated : r
        );

        state.courseReviews = state.courseReviews.map((r) =>
          r._id === updated._id ? updated : r
        );
      })

      // ============================================================
      // DELETE REVIEW (User)
      // ============================================================
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        state.courseReviews = state.courseReviews.filter(
          (r) => r._id !== action.payload
        );

        state.myReviews = state.myReviews.filter(
          (r) => r._id !== action.payload
        );
      })

      // ============================================================
      // REVIEW SUMMARY FOR ALL COURSES
      // ============================================================
      .addCase(fetchReviewSummaryForCourses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchReviewSummaryForCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = Array.isArray(action.payload)
          ? action.payload
          : [];
      })
      .addCase(fetchReviewSummaryForCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.summary = [];
      })

      // ============================================================
      // REVIEW SUMMARY FOR SINGLE COURSE
      // ============================================================
      .addCase(fetchReviewSummaryForSingleCourse.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchReviewSummaryForSingleCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.singleCourseSummary = action.payload;
      })
      .addCase(fetchReviewSummaryForSingleCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.singleCourseSummary = null;
      })

      // ============================================================
      // INSTRUCTOR REVIEWS
      // ============================================================
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
      })

      // ============================================================
      // ADMIN REVIEW MODERATION → Fetch reviews
      // ============================================================
      .addCase(fetchReviewForAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchReviewForAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.adminReviews = Array.isArray(action.payload)
          ? action.payload
          : [];
      })
      .addCase(fetchReviewForAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.adminReviews = [];
      })

      // ============================================================
      // ADMIN → DELETE REVIEW
      // ============================================================
      .addCase(deleteReviewAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteReviewAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        // Remove deleted item
        state.adminReviews = state.adminReviews.filter(
          (review) => review._id !== action.payload
        );
      })
      .addCase(deleteReviewAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetReviewState } = reviewSlice.actions;
export default reviewSlice.reducer;
