import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import userReducer from "../features/user/userSlice";
import courseReducer from "../features/courses/courseSlice";
import categoryReducer from "../features/categories/categorySlice";
import lessonReducer  from "../features/lesson/lessonSlice";
import enrollmentReducer from "../features/enrollment/enrollmentSlice"; 

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    courses: courseReducer,
    lessons: lessonReducer,
    categories: categoryReducer,
    enrollment: enrollmentReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
