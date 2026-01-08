import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import userReducer from "../features/user/userSlice";
import courseReducer from "../features/courses/courseSlice";
import categoryReducer from "../features/categories/categorySlice";
import lessonReducer from "../features/lesson/lessonSlice";
import enrollmentReducer from "../features/enrollment/enrollmentSlice";
import certificateReducer from "../features/certificate/certificateSlice";
import reviewReducer from "../features/review/reviewSlice";
import assistantReducer from "../features/GeminiAI/Gemini";
import dashboardReducer from "../features/dashboard/dashboardSlice";
import notificationsReducer from "../features/notifications/notificationSlice";
import { initNotificationSocket } from "../sockets/notificationSocket";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    courses: courseReducer,
    lessons: lessonReducer,
    categories: categoryReducer,
    enrollment: enrollmentReducer,
    certificates: certificateReducer,
    reviews: reviewReducer,
    assistant: assistantReducer,
    dashboard: dashboardReducer,
    notifications: notificationsReducer,
  },
});

// Bootstrap socket listeners outside React components.
initNotificationSocket(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
