import { createSlice } from "@reduxjs/toolkit";
import {
  fetchUsers,
  updateUserPassword,
  banAndUnbanUser,
  deleteUser,
  updateUserProfile,
  requestInstructor,
  approveInstructor,
  fetchInstructorRequests,
  rejectInstructorRequest,
  updateUserRole,
} from "./userThunks";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  joinedDate?: string;
  requestedToBeInstructor?: "none" | "requested" | "approved";
}

interface UserState {
  users: User[];
  requests: User[]; // 👈 holds users who requested to be instructors
  currentUser?: User | null;
  loading: boolean;
  error: string | null;
  updating: boolean;
  successMessage?: string;
}

const initialState: UserState = {
  users: [],
  requests: [],
  currentUser: null,
  loading: false,
  error: null,
  updating: false,
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // 🟢 Fetch all users
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // 🚫 Ban or Unban user
    builder.addCase(banAndUnbanUser.fulfilled, (state, action) => {
      const updatedUser = action.payload;
      state.users = state.users.map((user) =>
        user._id === updatedUser._id ? updatedUser : user
      );
    });

    // ❌ Delete user
    builder.addCase(deleteUser.fulfilled, (state, action) => {
      const userId = action.payload;
      state.users = state.users.filter((user) => user._id !== userId);
    });

    // 🧑‍⚖️ Superadmin: update user role
    builder.addCase(updateUserRole.fulfilled, (state, action) => {
      const updatedUser = action.payload;
      state.users = state.users.map((u) => (u._id === updatedUser._id ? updatedUser : u));
      state.successMessage = "User role updated";
    });

    // 🔑 Update user password (no direct state update)
    builder.addCase(updateUserPassword.fulfilled, (state) => {
      state.successMessage = "Password updated successfully";
    });

    // 🧩 Update user profile
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.updating = false;
        state.successMessage = "Profile updated successfully!";
        if (state.currentUser && action.payload) {
          state.currentUser = { ...state.currentUser, ...action.payload };
        }
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload as string;
      });

    // 🧠 Request to become instructor (student action)
    builder
      .addCase(requestInstructor.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(requestInstructor.fulfilled, (state, action) => {
        state.updating = false;
        state.successMessage = "Instructor request toggled successfully!";
        state.currentUser = action.payload; // 👈 backend returns updated user
      })
      .addCase(requestInstructor.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload as string;
      });

    // 📋 Fetch instructor requests (admin)
    builder
      .addCase(fetchInstructorRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInstructorRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = action.payload; // 👈 store in requests list
      })
      .addCase(fetchInstructorRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ✅ Approve instructor (admin)
    builder.addCase(approveInstructor.fulfilled, (state, action) => {
      const approvedId = action.payload._id;
      state.requests = state.requests.filter((u) => u._id !== approvedId);
      state.successMessage = "Instructor approved successfully!";
    });
    // ❌ Reject instructor
    builder.addCase(rejectInstructorRequest.fulfilled, (state, action) => {
      const rejectedId = action.payload._id;
      state.requests = state.requests.filter((u) => u._id !== rejectedId);
      state.successMessage = "Instructor request rejected.";
    });
  },
});

export default userSlice.reducer;
