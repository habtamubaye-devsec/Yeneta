import express from "express";
import { protect } from "..\/middlewares/authMiddleware.js";
import {
  getMyCertificates,
  generateCertificate,
} from "../controllers/certificateController.js";

const router = express.Router();

router.get("/my-certificates", protect, getMyCertificates);
router.get("/:courseId/certificate", protect, generateCertificate);

export default router;

// Auto change for Thu Oct 31 2024 03:00:00 GMT+0300 (East Africa Time)