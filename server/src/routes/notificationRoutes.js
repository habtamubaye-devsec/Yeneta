import express from "express";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";
import { createRoleNotification, getNotifications, markAsRead } from "../controllers/notificationController.js";

const router = express.Router();

router.post("/role", protect, authorizeRoles("superadmin", "admin"), createRoleNotification);
router.get("/", protect, getNotifications);
router.patch("/:id/read", protect, markAsRead);
    

export default router;
