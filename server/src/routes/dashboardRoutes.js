import express from "express";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";
import { studentDashboard, instructorDashboard } from "../controllers/dashboardController.js";

const router = express.Router();

router.get('/students', protect, authorizeRoles("student"), studentDashboard);
// ✅ Instructor dashboard
router.get('/instructors', protect, authorizeRoles("instructor"), instructorDashboard);

export default router