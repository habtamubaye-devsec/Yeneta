import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import courseReducer from "../features/courses/courseSlice";
import categoryReducer from "../features/categories/categorySlice";
import lessonReducer  from "../features/lesson/lessonSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    courses: courseReducer,
    lessons: lessonReducer,
    categories: categoryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
