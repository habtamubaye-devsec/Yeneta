import type { Store } from "@reduxjs/toolkit";
import { socket } from "./socket";
import { addNotification, updateReadStatus } from "@/features/notifications/notificationSlice";
import type { RootState } from "@/app/store";
import type { Notification } from "@/features/notifications/types";

type NotificationEventPayload =
  | Notification
  | { event: "READ_UPDATE"; notificationId: string };

let initialized = false;
let unsubscribe: (() => void) | null = null;
let currentUserId: string | null = null;

const getUserIdFromState = (state: RootState) => {
  const user = state.auth?.user as any;
  return (user?._id as string | undefined) ?? (user?.id as string | undefined) ?? null;
};

export const initNotificationSocket = (store: Store<RootState>) => {
  if (initialized) return;
  initialized = true;

  const joinRoomIfPossible = () => {
    const nextUserId = getUserIdFromState(store.getState());
    if (!nextUserId) return;
    if (nextUserId === currentUserId) return;

    currentUserId = nextUserId;
    socket.emit("join", nextUserId);
  };

  socket.on("connect", () => {
    joinRoomIfPossible();
  });

  socket.on("notification", (payload: NotificationEventPayload) => {
    if ((payload as any)?.event === "READ_UPDATE") {
      const { notificationId } = payload as any;
      store.dispatch(updateReadStatus({ id: String(notificationId), isRead: true }));
      return;
    }

    const n = payload as Notification;
    if (!n?._id) return;

    store.dispatch(addNotification(n));
  });

  // React to auth changes and (re)join rooms.
  unsubscribe = store.subscribe(() => {
    joinRoomIfPossible();
  });

  // Initial join attempt (in case socket is already connected).
  joinRoomIfPossible();

  // Optional cleanup hook for tests/hot reload.
  return () => {
    try {
      if (unsubscribe) unsubscribe();
      unsubscribe = null;
      socket.off("notification");
      socket.off("connect");
      initialized = false;
      currentUserId = null;
    } catch {
      // ignore
    }
  };
};
