import express from "express";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";
import {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
  getCategoryById,
} from "../controllers/categoryControllers.js";

const router = express.Router();

// Public route
router.get("/", getAllCategories);

// Admin-only routes
router.get("/:id", protect,authorizeRoles("admin", "superAdmin"), getCategoryById);
router.post("/", protect, authorizeRoles("admin", "superadmin"), createCategory);
router.patch("/:id", protect, authorizeRoles("admin", "superadmin"), updateCategory);
router.delete("/:id", protect, authorizeRoles("admin", "superadmin"), deleteCategory);

export default router;
