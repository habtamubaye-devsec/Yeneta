import express from "express";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";
import { 
  addReview, 
  getCourseReviews, 
  getReviewSummaryForCourses,
  getReviewSummaryForSingleCourse,
  deleteReview,
  getMyReview,
  deleteMyReview,
  updateMyReview, 
  getInstructorReviews,
  getReviewForAdmin
} from "../controllers/reviewControllers.js";

const router = express.Router();

// Leave review (student)
router.post("/:courseId/review", protect, addReview);

// Get all reviews for a course
router.get("/:courseId/reviews", getCourseReviews);

// Get review summary for courses 
router.get("/review/summary", protect, getReviewSummaryForCourses);

// Get review summary for a single course
router.get("/review/summary/:courseId", protect, getReviewSummaryForSingleCourse);

// Student: Get their own review
router.get("/review/me", protect, getMyReview);

// Student: Delete their own review 
router.delete("/review/:id", protect, authorizeRoles("student", "admin", "superadmin"), deleteMyReview);

//student: Update their own review
router.patch("/review/:id", protect, authorizeRoles("student"), updateMyReview);

// Instructor: Get all reviews for courses they created
router.get("/review/instructor", protect, authorizeRoles("instructor"), getInstructorReviews);

// Admin: Get all reviews (for moderation)
router.get("/admin/review", protect, authorizeRoles("admin", "superadmin"), getReviewForAdmin)

// Delete review (admin only)
router.delete("/admin/review/:id", protect, authorizeRoles("admin", "superadmin"), deleteReview);

export default router;
