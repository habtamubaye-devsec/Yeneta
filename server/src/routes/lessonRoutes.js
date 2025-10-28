import express from "express";
import {
  createLesson,
  getAllLessons,
  getLesson,
  updateLesson,
  deleteLesson,
} from "../controllers/lessonControllers.js";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";
import { parser } from "../utils/multer.js";
import { upload } from "../config/cloudinary-l.js";

const router = express.Router();

// ✅ Get all lessons for a course
router.get("/:courseId/lessons", protect, getAllLessons);

// ✅ Create a lesson
router.post(
  "/:courseId/lessons",
  protect,
  authorizeRoles("instructor", "admin"),
  upload.array("resources", 10),
  createLesson
);

// ✅ Get a single lesson
router.get("/:courseId/lessons/:lessonId", protect, getLesson);

// ✅ Update a lesson
router.put(
  "/:courseId/lessons/:lessonId",
  protect,
  authorizeRoles("instructor", "admin"),
  parser.array("resources", 10),
  updateLesson
);

// ✅ Delete a lesson
router.delete(
  "/:courseId/lessons/:lessonId",
  protect,
  authorizeRoles("instructor", "admin"),
  deleteLesson
);

export default router;
