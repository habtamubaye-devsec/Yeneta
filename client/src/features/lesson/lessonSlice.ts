// src/features/lesson/lessonSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { fetchLessons, createLesson, updateLesson, deleteLesson } from "./lessonThunks";

interface Resource {
  type: string;
  url: string;
}

interface Lesson {
  _id?: string;
  title: string;
  description?: string;
  resources?: Resource[];
}

interface LessonState {
  lessons: Lesson[];
  loading: boolean;
  error: string | null;
}

const initialState: LessonState = {
  lessons: [],
  loading: false,
  error: null,
};

const lessonSlice = createSlice({
  name: "lessons",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchLessons.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLessons.fulfilled, (state, action: PayloadAction<Lesson[]>) => {
        state.loading = false;
        state.lessons = action.payload;
      })
      .addCase(fetchLessons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create
      .addCase(createLesson.pending, (state) => {
        state.loading = true;
      })
      .addCase(createLesson.fulfilled, (state, action: PayloadAction<Lesson>) => {
        state.loading = false;
        state.lessons.push(action.payload);
      })
      .addCase(createLesson.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update
      .addCase(updateLesson.fulfilled, (state, action: PayloadAction<Lesson>) => {
        const index = state.lessons.findIndex((l) => l._id === action.payload._id);
        if (index !== -1) state.lessons[index] = action.payload;
      })

      // Delete
      .addCase(deleteLesson.fulfilled, (state, action: PayloadAction<string>) => {
        state.lessons = state.lessons.filter((l) => l._id !== action.payload);
      });
  },
});

export default lessonSlice.reducer;
