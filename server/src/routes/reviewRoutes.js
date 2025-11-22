import express from "express";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";
import { 
  addReview, 
  getCourseReviews, 
  deleteReview,
  getMyReview,
  deleteMyReview,
  getInstructorReviews
} from "../controllers/reviewControllers.js";

const router = express.Router();

// Leave review (student)
router.post("/:courseId/review", protect, addReview);

// Get all reviews for a course
router.get("/:courseId/reviews", getCourseReviews);

// Student: Get their own review
router.get("/review/me", protect, getMyReview);

// Student: Delete their own review 
router.delete("/review/:id", protect, authorizeRoles("student", "admin", "superadmin"), deleteMyReview);

// Instructor: Get all reviews for courses they created
router.get("/review/instructor", protect, authorizeRoles("instructor"), getInstructorReviews);

// Delete review (admin only)
router.delete("/reviews/:id", protect, authorizeRoles("admin", "superadmin"), deleteReview);

export default router;
