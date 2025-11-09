import express from "express";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";
import {
  getAllUsers,
  getCurrentUser,
  updateCurrentUser,
  updateUserRole,
  updateUserStatus,
  deleteUser,
  getUserById,
} from "../controllers/userController.js";

const router = express.Router();

// Admin only
router.get("/", protect, authorizeRoles("admin", "superadmin"), getAllUsers);
router.patch("/:id/role", protect, authorizeRoles("admin", "superadmin"), updateUserRole);
router.delete("/:id", protect, authorizeRoles("admin", "superadmin"), deleteUser);
router.patch("/:id/status", protect, authorizeRoles("admin", "superadmin"), updateUserStatus);

// Current user
router.get("/current", protect, getCurrentUser);
router.patch("/current", protect, updateCurrentUser);

// Get single user
router.get("/:id", protect, getUserById);

export default router;
