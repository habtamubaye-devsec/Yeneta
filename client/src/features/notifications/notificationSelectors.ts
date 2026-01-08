import type { RootState } from "@/app/store";

export const selectNotifications = (state: RootState) => state.notifications.items;
export const selectUnreadCount = (state: RootState) => state.notifications.unreadCount;
export const selectNotificationLoading = (state: RootState) => state.notifications.loading;
export const selectNotificationError = (state: RootState) => state.notifications.error;
export const selectNotificationPage = (state: RootState) => state.notifications.page;
