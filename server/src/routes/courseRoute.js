import express from "express";
import {
  createCourse,
  updateCourse,
  deleteCourse,
  getAllCourses,
  getCourseById,
  getStats,
} from "../controllers/courseController.js";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public
router.get("/", getAllCourses);
router.get("/:id", getCourseById);

// Instructor only
router.post("/", protect, authorizeRoles("instructor"), createCourse);
router.put("/:id", protect, authorizeRoles("instructor"), updateCourse);
router.delete("/:id", protect, authorizeRoles("instructor"), deleteCourse);
router.get("/instructor/stats", protect, authorizeRoles("instructor"), getStats);

export default router;
