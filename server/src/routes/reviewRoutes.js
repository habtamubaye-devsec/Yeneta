import express from "express";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";
import { addReview, getCourseReviews, deleteReview } from "../controllers/reviewControllers.js";

const router = express.Router();

// Leave review (student)
router.post("/:courseId/review", protect, addReview);

// Get all reviews for a course
router.get("/:courseId/reviews", getCourseReviews);

// Delete review (admin only)
router.delete("/reviews/:id", protect, authorizeRoles("admin", "superadmin"), deleteReview);

export default router;
