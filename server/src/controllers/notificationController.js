import Notification from "../models/Notification.js";
import { emitNotification } from "../config/socket.js";
import { sendRoleNotification } from "../utils/notificationService.js";

export const createRoleNotification = async (req, res) => {
  try {
    const { title, message, targetRoles } = req.body;
    const sender = req.user; // from auth middleware

    if (!["superadmin", "admin"].includes(sender.role)) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const count = await sendRoleNotification({
      sender,
      targetRoles,
      title,
      message,
    });

    res.json({
      success: true,
      sentToUsers: count,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getNotifications = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = 10;

  const userId = req.user?._id ?? req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Not authorized" });
  }

  const notifications = await Notification.find({
    userId,
  })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  console.log("Fetched notifications for user:", String(userId), notifications.length);

  res.json(notifications);
};


export const markAsRead = async (req, res) => {
  const userId = req.user?._id ?? req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Not authorized" });
  }

  const n = await Notification.findOneAndUpdate(
    { _id: req.params.id, userId },
    { isRead: true, readAt: new Date() },
    { new: true }
  );

  if (!n) {
    return res.status(404).json({ message: "Notification not found" });
  }

  emitNotification(userId, { event: "READ_UPDATE", notificationId: n._id });

  res.json(n);
};
