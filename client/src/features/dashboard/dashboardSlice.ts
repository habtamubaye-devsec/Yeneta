import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  fetchStudentDashboard,
  fetchInstructorDashboard,
  fetchAdminDashboard,
  fetchSuperAdminDashboard,
} from "./dashboardThunks";

type DashboardState = {
  student: any | null;
  instructor: any | null;
  admin: any | null;
  superAdmin: any | null;
  loading: boolean;
  error: string | null;
};

const initialState: DashboardState = {
  student: null,
  instructor: null,
  admin: null,
  superAdmin: null,
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    clearDashboardError(state) {
      state.error = null;
    },
    clearDashboardState(state) {
      state.student = null;
      state.instructor = null;
      state.admin = null;
      state.superAdmin = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudentDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentDashboard.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.student = action.payload || null;
      })
      .addCase(fetchStudentDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to load student dashboard";
      })

      .addCase(fetchInstructorDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInstructorDashboard.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.instructor = action.payload || null;
      })
      .addCase(fetchInstructorDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to load instructor dashboard";
      })

      .addCase(fetchAdminDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminDashboard.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.admin = action.payload || null;
      })
      .addCase(fetchAdminDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to load admin dashboard";
      })

      .addCase(fetchSuperAdminDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSuperAdminDashboard.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.superAdmin = action.payload || null;
      })
      .addCase(fetchSuperAdminDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to load superadmin dashboard";
      });
  },
});

export const { clearDashboardError, clearDashboardState } = dashboardSlice.actions;
export default dashboardSlice.reducer;
