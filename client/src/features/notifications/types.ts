export type NotificationType = "info" | "success" | "warning" | "error";

export interface Notification {
  _id: string;
  userId?: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
  updatedAt?: string;
  readAt?: string;
}

export interface NotificationState {
  items: Notification[];
  unreadCount: number;
  page: number;
  loading: boolean;
  error: string | null;
}

export interface AdminSendPayload {
  targetRoles: Array<"superadmin" | "admin" | "instructor" | "student">;
  title: string;
  message: string;
  type?: NotificationType;
}
