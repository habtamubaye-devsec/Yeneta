import express from "express";
import {
  createLesson,
  getAllLessons,
  getLesson,
  updateLesson,
  deleteLesson
} from "../controllers/lessonControllers.js";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";
import { parser } from "../utils/multer.js"; // Multer + Cloudinary

const router = express.Router();

// 🔹 Create a lesson (Instructor/Admin only)
// Accepts multipart/form-data: "resources" files + textResources JSON string
router.post(
  "/:courseId/lessons",
  protect,
  authorizeRoles("instructor", "admin"),
  parser.array("resources", 10), // max 10 files per request
  createLesson
);

// 🔹 Get all lessons for a course
router.get("/:courseId/lessons", protect, getAllLessons);

// 🔹 Get a single lesson by ID
router.get("/lesson/:id", protect, getLesson);

// 🔹 Update a lesson (text + file resources)
router.put(
  "/:id",
  protect,
  authorizeRoles("instructor", "admin"),
  parser.array("resources", 10), // optional new files
  updateLesson
);

// 🔹 Delete a lesson by ID
router.delete("/:id", protect, authorizeRoles("instructor", "admin"), deleteLesson);

export default router;
