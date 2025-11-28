import express from "express";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";
import { studentDashboard, instructorDashboard, adminDashboard, superAdminDashboard } from "../controllers/dashboardController.js";

const router = express.Router();

router.get('/students', protect, authorizeRoles("student"), studentDashboard);
// ✅ Instructor dashboard
router.get('/instructors', protect, authorizeRoles("instructor"), instructorDashboard);
// Admin dashboard (admins & superadmins)
router.get('/admin', protect, authorizeRoles("admin", "superadmin"), adminDashboard);
// Superadmin dashboard
// keep backward-compatible plural route that frontend thunks expect
router.get('/superadmin', protect, authorizeRoles("superadmin"), superAdminDashboard);
router.get('/superadmins', protect, authorizeRoles("superadmin"), superAdminDashboard);

export default router