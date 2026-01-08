import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { RootState } from "@/app/store";
import type { AdminSendPayload, Notification } from "./types";

const API_BASE = "http://localhost:8000/api/notifications";
const ADMIN_API_BASE = "http://localhost:8000/api/admin/notifications";

const getErrorMessage = (error: unknown, fallback: string) => {
  const err = error as any;
  return err?.response?.data?.message || err?.message || fallback;
};

export const fetchNotifications = createAsyncThunk<
  { page: number; items: Notification[] },
  number,
  { rejectValue: string }
>(
  "notifications/fetch",
  async (page, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_BASE}?page=${page}`, {
        withCredentials: true,
      });
      return { page, items: (res.data ?? []) as Notification[] };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to fetch notifications"));
    }
  }
);

export const markNotificationAsRead = createAsyncThunk<
  Notification,
  string,
  { rejectValue: string }
>(
  "notifications/markAsRead",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.patch(`${API_BASE}/${id}/read`, {}, { withCredentials: true });
      return res.data as Notification;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to mark notification as read"));
    }
  }
);

export const markAllAsRead = createAsyncThunk<
  string[],
  void,
  { state: RootState; rejectValue: string }
>(
  "notifications/markAllAsRead",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { items } = getState().notifications;
      const unread = items.filter((n) => !n.isRead);

      if (!unread.length) return [];

      await Promise.all(
        unread.map((n) =>
          axios.patch(`${API_BASE}/${n._id}/read`, {}, { withCredentials: true })
        )
      );

      return unread.map((n) => n._id);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to mark all as read"));
    }
  }
);

export const sendRoleNotification = createAsyncThunk<
  { sentToUsers?: number },
  AdminSendPayload,
  { rejectValue: string }
>(
  "notifications/sendRoleNotification",
  async (payload, { rejectWithValue }) => {
    // Per spec: POST /api/admin/notifications/role
    // Current backend in this workspace: POST /api/notifications/role
    // We try the spec endpoint first, then fall back for compatibility.
    try {
      const res = await axios.post(`${ADMIN_API_BASE}/role`, payload, {
        withCredentials: true,
      });
      return res.data ?? {};
    } catch (error: any) {
      const status = error?.response?.status;
      if (status === 404) {
        try {
          const res = await axios.post(`${API_BASE}/role`, payload, {
            withCredentials: true,
          });
          return res.data ?? {};
        } catch (fallbackError) {
          return rejectWithValue(getErrorMessage(fallbackError, "Failed to send role notification"));
        }
      }
      return rejectWithValue(getErrorMessage(error, "Failed to send role notification"));
    }
  }
);
