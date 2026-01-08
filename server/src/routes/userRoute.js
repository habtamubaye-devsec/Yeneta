import express from "express";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";
import {
  getAllUsers,
  getCurrentUser,
  updateCurrentUser,
  updateUserStatus,
  updateUserRole,
  updateUserPassword,
  deleteUser,
  getUserById,
  requestedToBeInstructor,
  getInstructorRequests,
  approveInstructor,
  rejectInstructorRequest
} from "../controllers/userController.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

// Admin only
router.get("/", protect, authorizeRoles("admin", "superadmin"), getAllUsers);
router.delete("/:id", protect, authorizeRoles("admin", "superadmin"), deleteUser);
router.patch("/:id/status", protect, authorizeRoles("admin", "superadmin"), updateUserStatus);
router.patch("/:id/role", protect, authorizeRoles("superadmin"), updateUserRole);
router.get("/instructor-requests", protect, authorizeRoles("admin", "superadmin"), getInstructorRequests);
router.patch("/:id/approve-instructor", protect, authorizeRoles("admin", "superadmin"), approveInstructor);
router.patch("/:id/reject-instructor", protect, authorizeRoles("admin", "superadmin"), rejectInstructorRequest);

// Current user
router.get("/current", protect, getCurrentUser);
router.patch("/current/updateProfile", protect, upload.single("profileImage"), updateCurrentUser);
router.patch("/current/password", protect, updateUserPassword);

// Get single user
router.get("/:id", protect, getUserById);

//student
router.patch("/request-instructor", protect, authorizeRoles("student"), requestedToBeInstructor);


export default router;
