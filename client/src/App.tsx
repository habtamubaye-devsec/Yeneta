// src/App.tsx
import { ConfigProvider, App as AntApp } from "antd";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux"; // ✅ Added Redux provider
import { store } from "@/app/store"; // ✅ Import Redux store
import { antdTheme } from "./config/antdTheme";
import ProtectedRoute from "./components/ProtectedRoute";

// ✅ Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";

// // ✅ Student Pages
// import StudentDashboard from "./pages/student/StudentDashboard";
// import MyCourses from "./pages/student/MyCourses";
// import LessonPlayer from "./pages/student/LessonPlayer";
// import Certificates from "./pages/student/Certificates";
// import Reviews from "./pages/student/Reviews";
// import Profile from "./pages/student/Profile";

// ✅ Instructor Pages
import InstructorDashboard from "./pages/instructor/InstructorDashboard";
import InstructorCourses from "./pages/instructor/MyCourses";
import CreateCourse from "./pages/instructor/CreateCourse";
import ManageCourse from "./pages/instructor/ManageCourse";
// import Feedback from "./pages/instructor/Feedback";
// import Analytics from "./pages/instructor/Analytics";

// // ✅ Admin Pages
// import AdminDashboard from "./pages/admin/AdminDashboard";
// import UserManagement from "./pages/admin/UserManagement";
// import CourseManagement from "./pages/admin/CourseManagement";
// import ReviewModeration from "./pages/admin/ReviewModeration";
// import CategoryManagement from "./pages/admin/CategoryManagement";
// import Notifications from "./pages/admin/Notifications";

// // ✅ SuperAdmin Pages
// import SuperAdminDashboard from "./pages/superadmin/SuperAdminDashboard";
// import RoleManagement from "./pages/superadmin/RoleManagement";
// import SystemSettings from "./pages/superadmin/SystemSettings";

// // ✅ Course Pages
// import BrowseCourses from "./pages/courses/BrowseCourses";
// import CourseDetail from "./pages/courses/CourseDetail";

// import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <Provider store={store}> {/* ✅ Redux replaces AuthProvider */}
    <QueryClientProvider client={queryClient}>
      <ConfigProvider theme={antdTheme}>
        <AntApp>
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Courses */}
              {/* <Route
                path="/courses"
                element={
                  <ProtectedRoute>
                    <BrowseCourses />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/courses/:id"
                element={
                  <ProtectedRoute>
                    <CourseDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/courses/:courseId/lesson/:lessonId"
                element={
                  <ProtectedRoute>
                    <LessonPlayer />
                  </ProtectedRoute>
                }
              /> */}

              {/* Student */}
              {/* <Route
                path="/student"
                element={
                  <ProtectedRoute allowedRoles={["student"]}>
                    <StudentDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/my-courses"
                element={
                  <ProtectedRoute allowedRoles={["student"]}>
                    <MyCourses />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/certificates"
                element={
                  <ProtectedRoute allowedRoles={["student"]}>
                    <Certificates />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/reviews"
                element={
                  <ProtectedRoute allowedRoles={["student"]}>
                    <Reviews />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/profile"
                element={
                  <ProtectedRoute allowedRoles={["student"]}>
                    <Profile />
                  </ProtectedRoute>
                }
              /> */}

              {/* Instructor */}
              <Route
                path="/instructor"
                element={
                  <ProtectedRoute allowedRoles={["instructor"]}>
                    <InstructorDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/instructor/courses"
                element={
                  <ProtectedRoute allowedRoles={["instructor"]}>
                    <InstructorCourses />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/instructor/create-course"
                element={
                  <ProtectedRoute allowedRoles={["instructor"]}>
                    <CreateCourse />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/instructor/courses/:courseId"
                element={
                  <ProtectedRoute allowedRoles={["instructor"]}>
                    <ManageCourse />
                  </ProtectedRoute>
                }
              />
              {/* <Route
                path="/instructor/feedback"
                element={
                  <ProtectedRoute allowedRoles={["instructor"]}>
                    <Feedback />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/instructor/analytics"
                element={
                  <ProtectedRoute allowedRoles={["instructor"]}>
                    <Analytics />
                  </ProtectedRoute>
                }
              /> */}

              {/* Admin */}
              {/* <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                    <UserManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/courses"
                element={
                  <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                    <CourseManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/reviews"
                element={
                  <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                    <ReviewModeration />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/categories"
                element={
                  <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                    <CategoryManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/notifications"
                element={
                  <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                    <Notifications />
                  </ProtectedRoute>
                }
              /> */}

              {/* SuperAdmin */}
              {/* <Route
                path="/superadmin"
                element={
                  <ProtectedRoute allowedRoles={["superadmin"]}>
                    <SuperAdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/superadmin/roles"
                element={
                  <ProtectedRoute allowedRoles={["superadmin"]}>
                    <RoleManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/superadmin/settings"
                element={
                  <ProtectedRoute allowedRoles={["superadmin"]}>
                    <SystemSettings />
                  </ProtectedRoute>
                }
              /> */}

              {/* Catch-all */}
              {/* <Route path="*" element={<NotFound />} /> */}
            </Routes>
          </BrowserRouter>
        </AntApp>
      </ConfigProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;