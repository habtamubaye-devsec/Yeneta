import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  fetchMyEnrollments,
  enrollInCourse,
  createCheckoutSession,
  updateLessonProgress,
  getEnrollmentsLengthByCourse,
  fetchEnrollmentByCourse, // ✅ single enrollment thunk
} from "./enrollmentThunks";

// =========================
// Interfaces
// =========================
interface Enrollment {
  _id: string;
  user?: any;
  course: any;
  completedLessons?: any[];
  lessons?: any[];
  progress?: number;
  [key: string]: any;
}

interface EnrollmentState {
  enrollments: Enrollment[];           // All enrollments for the current user
  currentEnrollment: Enrollment | null; // Enrollment for a specific course
  enrollmentsCount: number;             // Enrollment count by course
  loading: boolean;
  error: string | null;
}

// =========================
// Initial State
// =========================
const initialState: EnrollmentState = {
  enrollments: [],
  currentEnrollment: null,
  enrollmentsCount: 0,
  loading: false,
  error: null,
};

console.log(initialState.enrollments); // Debugging line

// =========================
// Slice
// =========================
const enrollmentSlice = createSlice({
  name: "enrollment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // ======================
    // Fetch my enrollments
    // ======================
    builder
      .addCase(fetchMyEnrollments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchMyEnrollments.fulfilled,
        (state, action: PayloadAction<Enrollment[]>) => {
          state.loading = false;
          state.enrollments = action.payload.map((e) => {
            const course = e.course || e.courseId || {};
            const lessons = Array.isArray(course.lessons) ? course.lessons : [];
            const completed = Array.isArray(e.completedLessons)
              ? e.completedLessons.length
              : 0;
            const progress = lessons.length
              ? Math.round((completed / lessons.length) * 100)
              : 0;
            return { ...e, course, lessons, progress };
          });
        }
      )
      .addCase(fetchMyEnrollments.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Failed to fetch enrollments";
      });

    // ======================
    // Enroll in a course
    // ======================
    builder
      .addCase(enrollInCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        enrollInCourse.fulfilled,
        (state, action: PayloadAction<Enrollment>) => {
          state.loading = false;
          const e = action.payload;
          const course = e.course || e.courseId || {};
          const lessons = Array.isArray(course.lessons) ? course.lessons : [];
          const completed = Array.isArray(e.completedLessons)
            ? e.completedLessons.length
            : 0;
          const progress = lessons.length
            ? Math.round((completed / lessons.length) * 100)
            : 0;
          state.enrollments.push({ ...e, course, lessons, progress });
        }
      )
      .addCase(enrollInCourse.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Failed to enroll in course";
      });

    // ======================
    // Create checkout session
    // ======================
    builder
      .addCase(createCheckoutSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCheckoutSession.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createCheckoutSession.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Failed to create checkout session";
      });

    // ======================
    // Update lesson progress
    // ======================
    builder
      .addCase(updateLessonProgress.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateLessonProgress.fulfilled, (state, action) => {
        state.loading = false;
        const { courseId, completedLessons } = action.payload;

        // Update progress in enrollments array
        const enrollment = state.enrollments.find(
          (e) => e.course._id === courseId
        );

        if (enrollment) {
          enrollment.completedLessons = completedLessons;
          const totalLessons = enrollment.course.lessons?.length || 0;
          const completed = completedLessons.length;
          enrollment.progress = totalLessons
            ? Math.round((completed / totalLessons) * 100)
            : 0;
        }

        // Also update currentEnrollment if it's the same course
        if (
          state.currentEnrollment &&
          state.currentEnrollment.course._id === courseId
        ) {
          const totalLessons =
            state.currentEnrollment.course.lessons?.length || 0;
          const completed = completedLessons.length;
          state.currentEnrollment = {
            ...state.currentEnrollment,
            completedLessons,
            progress: totalLessons
              ? Math.round((completed / totalLessons) * 100)
              : 0,
          };
        }
      })
      .addCase(updateLessonProgress.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Failed to update progress";
      });

    // ======================
    // Get enrollments length by course
    // ======================
    builder
      .addCase(getEnrollmentsLengthByCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getEnrollmentsLengthByCourse.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.loading = false;
          state.enrollmentsCount = action.payload;
        }
      )
      .addCase(getEnrollmentsLengthByCourse.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ||
          "Failed to get enrollments count";
      });

    // ======================
    // ✅ Fetch single enrollment by course (for current user)
    // ======================
    builder
      .addCase(fetchEnrollmentByCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchEnrollmentByCourse.fulfilled,
        (state, action: PayloadAction<Enrollment | null>) => {
          state.loading = false;
          const e = action.payload;

          if (!e) {
            state.currentEnrollment = null;
            return;
          }

          const course = e.course || e.courseId || {};
          const lessons = Array.isArray(course.lessons) ? course.lessons : [];
          const completed = Array.isArray(e.completedLessons)
            ? e.completedLessons.length
            : 0;
          const progress = lessons.length
            ? Math.round((completed / lessons.length) * 100)
            : 0;

          state.currentEnrollment = { ...e, course, lessons, progress };
        }
      )
      .addCase(fetchEnrollmentByCourse.rejected, (state, action) => {
        state.loading = false;
        state.currentEnrollment = null;
        state.error =
          (action.payload as string) ||
          "Failed to fetch enrollment by course";
      });
  },
});

export default enrollmentSlice.reducer;
