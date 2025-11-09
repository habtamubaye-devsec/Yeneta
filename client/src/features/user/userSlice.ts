import { createSlice } from "@reduxjs/toolkit";
import { fetchUsers, approveUser, banAndUnbanUser, deleteUser } from "./userThunks";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  joinedDate?: string;
}

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch users
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

    // // Approve user
    // builder.addCase(approveUser.fulfilled, (state, action) => {
    //   const updatedUser = action.payload;
    //   state.users = state.users.map((user) =>
    //     user._id === updatedUser._id ? updatedUser : user
    //   );
    // });

    // Ban or Unban user
    builder.addCase(banAndUnbanUser.fulfilled, (state, action) => {
      const updatedUser = action.payload;
      state.users = state.users.map((user) =>
        user._id === updatedUser._id ? updatedUser : user
      );
    });

    // Delete user
    builder.addCase(deleteUser.fulfilled, (state, action) => {
      const userId = action.payload;
      state.users = state.users.filter((user) => user._id !== userId);
    });
  },
});

export default userSlice.reducer;
