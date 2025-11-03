// src/redux/course/courseSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import {
  createCourse,
  fetchCourses,
  getCourseById,
  updateCourse,
  togglePublishCourse,
  deleteCourse,
  fetchCoursesByInstructor,
} from "./courseThunks";

interface Course {
  _id?: string;
  title: string;
  description: string;
  category: string;
  level: string;
  price: number;
  thumbnail?: string;
}

interface CourseState {
  courses: Course[];
  instructorCourses: Course[]; // ✅ added
  selectedCourse?: Course | null;
  loading: boolean;
  error?: string | null;
}

const initialState: CourseState = {
  courses: [],
  instructorCourses: [],
  selectedCourse: null,
  loading: false,
  error: null,
};

const courseSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    clearSelectedCourse: (state) => {
      state.selectedCourse = null;
    },
  },
  extraReducers: (builder) => {
    // 🔹 Create Course
    builder
      .addCase(createCourse.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.courses.push(action.payload);
      })
      .addCase(createCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // 🔹 Fetch Courses (All / Search / Filter)
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // 🔹 Get Course by ID
    builder
      .addCase(getCourseById.fulfilled, (state, action) => {
        state.selectedCourse = action.payload;
      })
      .addCase(getCourseById.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    builder
      .addCase(fetchCoursesByInstructor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCoursesByInstructor.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload;
      })
      .addCase(fetchCoursesByInstructor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // 🔹 Update Course
    builder
      .addCase(updateCourse.fulfilled, (state, action) => {
        const index = state.courses.findIndex((c) => c._id === action.payload._id);
        if (index !== -1) state.courses[index] = action.payload;
      })
      .addCase(updateCourse.rejected, (state, action) => {
        state.error = action.payload as string;
      });
    
     // Toggle publish
    builder
      .addCase(togglePublishCourse.pending, (state) => {
        state.loading = true;
      })
      .addCase(togglePublishCourse.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        const index = state.courses.findIndex((c) => c._id === updated._id);
        if (index !== -1) {
          state.courses[index] = updated;
        }
      })
      .addCase(togglePublishCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // 🔹 Delete Course
    builder
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.courses = state.courses.filter((c) => c._id !== action.payload);
      })
      .addCase(deleteCourse.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedCourse } = courseSlice.actions;
export default courseSlice.reducer;
