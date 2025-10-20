import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  enrollInCourse,
  getMyEnrollments,
  getCourseProgress,
  updateLessonProgress,
  generateCertificate,
} from "../controllers/enrollementControllers.js";

const router = express.Router();

// Enroll in a course
router.post("/:courseId", protect, enrollInCourse);

// Get user's enrolled courses
router.get("/my", protect, getMyEnrollments);

// Get progress for a course
router.get("/:courseId/progress", protect, getCourseProgress);

// Update lesson completion
router.patch("/:courseId/progress", protect, updateLessonProgress);

// Generate certificate
router.get("/:courseId/certificate", protect, generateCertificate);

export default router;
