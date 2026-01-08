import Notification from "../models/Notification.js";
import User from "../models/userModel.js";
import { emitNotification } from "../config/socket.js";
import { ROLE_NOTIFICATION_RULES } from "../middlewares/notificationRoles.js";

const ANTI_SPAM_WINDOW = 60 * 1000;

export const sendUserNotification = async ({
  userId,
  title,
  message,
  type = "info",
  antiSpamWindowMs = ANTI_SPAM_WINDOW,
}) => {
  if (!userId) throw new Error("userId is required");
  if (!title) throw new Error("title is required");
  if (!message) throw new Error("message is required");

  if (antiSpamWindowMs && antiSpamWindowMs > 0) {
    const recent = await Notification.findOne({
      userId,
      title,
      createdAt: { $gte: new Date(Date.now() - antiSpamWindowMs) },
    });
    if (recent) return recent;
  }

  const n = await Notification.create({
    userId,
    title,
    message,
    type,
  });

  emitNotification(n.userId, {
    _id: n._id,
    title: n.title,
    message: n.message,
    type: n.type,
    isRead: false,
    createdAt: n.createdAt,
  });

  return n;
};

export const sendRoleNotification = async ({
  sender,
  targetRoles,
  title,
  message,
  type = "info",
}) => {
  for (const role of targetRoles) {
    if (!ROLE_NOTIFICATION_RULES[sender.role]?.includes(role)) {
      throw new Error("Role not allowed");
    }
  }

  const users = await User.find({
    role: { $in: targetRoles },
    _id: { $ne: sender._id },
  }).select("_id");

  const notifications = [];

  for (const user of users) {
    const recent = await Notification.findOne({
      userId: user._id,
      title,
      createdAt: { $gte: new Date(Date.now() - ANTI_SPAM_WINDOW) },
    });

    if (!recent) {
      notifications.push({
        userId: user._id,
        title,
        message,
        type,
      });
    }
  }

  const saved = await Notification.insertMany(notifications);

  saved.forEach(n => {
    emitNotification(n.userId, {
      _id: n._id,
      title,
      message,
      type,
      isRead: false,
      createdAt: n.createdAt,
    });
  });

  return saved.length;
};
