import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Notification, NotificationState } from "./types";
import {
  fetchNotifications,
  markAllAsRead,
  markNotificationAsRead,
  sendRoleNotification,
} from "./notificationThunks";

const computeUnreadCount = (items: Notification[]) =>
  items.reduce((count, n) => count + (n.isRead ? 0 : 1), 0);

const initialState: NotificationState = {
  items: [],
  unreadCount: 0,
  page: 1,
  loading: false,
  error: null,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
      const incoming = action.payload;
      const exists = state.items.some((n) => n._id === incoming._id);
      if (exists) return;

      state.items.unshift(incoming);
      if (!incoming.isRead) state.unreadCount += 1;
    },

    updateReadStatus: (
      state,
      action: PayloadAction<{ id: string; isRead: boolean }>
    ) => {
      const { id, isRead } = action.payload;
      const idx = state.items.findIndex((n) => n._id === id);
      if (idx === -1) return;

      const prev = state.items[idx];
      if (prev.isRead === isRead) return;

      state.items[idx] = { ...prev, isRead };
      if (isRead) state.unreadCount = Math.max(0, state.unreadCount - 1);
      else state.unreadCount += 1;
    },

    incrementUnread: (state) => {
      state.unreadCount += 1;
    },

    decrementUnread: (state) => {
      state.unreadCount = Math.max(0, state.unreadCount - 1);
    },

    resetNotifications: (state) => {
      state.items = [];
      state.unreadCount = 0;
      state.page = 1;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        const { page, items } = action.payload;
        state.page = page;

        if (page === 1) {
          state.items = items;
        } else {
          const existingIds = new Set(state.items.map((n) => n._id));
          const merged = [...state.items];
          for (const n of items) {
            if (!existingIds.has(n._id)) merged.push(n);
          }
          state.items = merged;
        }

        state.unreadCount = computeUnreadCount(state.items);
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to fetch notifications";
      })

      // Mark one
      .addCase(markNotificationAsRead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        const idx = state.items.findIndex((n) => n._id === updated._id);
        if (idx !== -1) {
          state.items[idx] = { ...state.items[idx], ...updated };
        }
        state.unreadCount = computeUnreadCount(state.items);
      })
      .addCase(markNotificationAsRead.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to update notification";
      })

      // Mark all
      .addCase(markAllAsRead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markAllAsRead.fulfilled, (state, action) => {
        state.loading = false;
        const ids = new Set(action.payload);
        state.items = state.items.map((n) =>
          ids.has(n._id) ? { ...n, isRead: true } : n
        );
        state.unreadCount = computeUnreadCount(state.items);
      })
      .addCase(markAllAsRead.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to mark all as read";
      })

      // Send role notification
      .addCase(sendRoleNotification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendRoleNotification.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(sendRoleNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to send notification";
      });
  },
});

export const {
  addNotification,
  updateReadStatus,
  incrementUnread,
  decrementUnread,
  resetNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;
