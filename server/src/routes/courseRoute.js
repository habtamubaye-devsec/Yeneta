import express from "express";
import {
  createCourse,
  updateCourse,
  deleteCourse,
  getAllCourses,
  getCourseById,
  getStats,
  togglePublishStatus,
} from "../controllers/courseController.js";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

// Public
router.get("/", getAllCourses);
router.get("/:id", getCourseById);

// Instructor only
router.post("/", protect, upload.single("thumbnail"), authorizeRoles("instructor"), createCourse);
router.put("/:id", protect, upload.single("thumbnail"), authorizeRoles("instructor"), updateCourse);
router.patch("/:id/publish", protect,authorizeRoles("instructor"), togglePublishStatus);
router.delete("/:id", protect, authorizeRoles("instructor"), deleteCourse);
router.get("/instructor/stats", protect, authorizeRoles("instructor"), getStats);

export default router;
