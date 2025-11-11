import express from "express";
import {
  createCourse,
  updateCourse,
  deleteCourse,
  getAllCourses,
  getAllCoursesForAdmin,
  getCourseById,
  getCoursesByInstructor,
  getStats,
  requestTogglePublish,
  approveCourse,
  rejectCourse,
} from "../controllers/courseController.js";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

//Instructor only
router.get("/instructor-courses", protect, authorizeRoles("instructor"),getCoursesByInstructor);

// Public
router.get("/", getAllCourses);
router.get("/:courseId", getCourseById);

// Instructor only
router.post("/", protect, upload.single("thumbnail"), authorizeRoles("instructor"), createCourse);
router.put("/:id", protect, upload.single("thumbnail"), authorizeRoles("instructor"), updateCourse);
router.patch("/:id/publish", protect,authorizeRoles("instructor"), requestTogglePublish);
router.get("/instructor/stats", protect, authorizeRoles("instructor"), getStats);

//Admin only

router.get("/admin/all-courses", protect, authorizeRoles("admin", "superadmin"), getAllCoursesForAdmin);
router.patch("/:id/approve", protect, authorizeRoles("admin", "superadmin"), approveCourse);
router.patch("/:id/reject", protect, authorizeRoles("admin", "superadmin"), rejectCourse);

//for admin, superadmin, instructor
router.delete("/:id", protect, authorizeRoles("instructor", "admin", "superadmin"), deleteCourse);

export default router;
