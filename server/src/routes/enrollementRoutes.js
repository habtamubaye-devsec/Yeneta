import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import bodyParser from "body-parser";

import {
  createCheckoutSession,
  handleStripeWebhook,
  webhookTest,
  enrollInCourse,
  getMyEnrollments,
  getEnrollmentsLengthByCourse,
  getCourseProgress,
  updateLessonProgress,
  getEnrollmentsByCourse,
} from "../controllers/enrollementControllers.js";

const router = express.Router();

// ========================
// Stripe checkout session (frontend triggers this)
// POST /api/enrollment/checkout/:courseId
// ========================
router.post("/checkout/:courseId", protect, createCheckoutSession);

// ========================
// Stripe webhook (Stripe triggers this)
// POST /api/enrollment/webhook
// ========================
router.post("/webhook", bodyParser.raw({ type: "application/json" }), handleStripeWebhook);

// Local helper to process a checkout session and create enrollment.
// In production keep this protected; in development allow unprotected calls so
// the frontend (Stripe redirect) can finalize enrollment even if the auth cookie
// isn't present after the Stripe redirect.
if (process.env.NODE_ENV === 'production') {
  router.post("/webhook-test", protect, webhookTest);
} else {
  router.post("/webhook-test", webhookTest);
}

// ========================
// Manual enrollment (optional for free courses/admin)
// POST /api/enroll/:courseId
// ========================
router.post("/enroll/:courseId", protect, enrollInCourse);

// ========================
// Get all enrollments of logged-in user
// GET /api/enrollment/my
// ========================
router.get("/my", protect, getMyEnrollments);

// ========================
// Get all enrollments by course
// GET /api/enrollment/courseId
// ========================
router.get("/course/:courseId", protect, getEnrollmentsByCourse);

// ========================
// Get length enrollments by course
// GET /api/enrollment/courseId
// ========================
router.get("/length/:courseId", protect, getEnrollmentsLengthByCourse);

// ========================
// Get course progress
// GET /api/enrollment/:courseId/progress
// ========================
router.get("/:courseId/progress", protect, getCourseProgress);

// ========================
// Update lesson progress
// PATCH /api/enrollment/:courseId/progress
// ========================
router.patch("/:courseId/progress", protect, updateLessonProgress);

export default router;
