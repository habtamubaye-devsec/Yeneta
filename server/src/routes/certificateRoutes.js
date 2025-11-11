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
