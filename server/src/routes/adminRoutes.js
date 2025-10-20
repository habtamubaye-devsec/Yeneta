import express from "express";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";
import {
  getDashboardStats,
  getAllUsers,
  getAllInstructors,
  getInstructor,
  createInstructor,
  updateInstructor,
  deleteInstructor,
  updateUserStatusAndRole,
} from "../controllers/adminControllers.js";

const router = express.Router();

// Protect all admin routes
router.use(protect);
router.use(authorizeRoles("admin", "superadmin"));

// Dashboard
router.get("/dashboard", getDashboardStats);

// Users
router.get("/users", getAllUsers);
router.patch("/users/:id/status", updateUserStatusAndRole);

// Instructors CRUD
router.get("/instructors", getAllInstructors);
router.get("/instructors/:id", getInstructor);
router.post("/instructors", createInstructor);
router.patch("/instructors/:id", updateInstructor);
router.delete("/instructors/:id", deleteInstructor);

export default router;
