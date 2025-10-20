import express from "express";
import { askAssistant } from "../controllers/geminiCotrollers.js";
import { protect } from "../middlewares/authMiddleware.js"; // optional

const router = express.Router();

// Endpoint for AI assistant
router.post("/ask", protect, askAssistant);

export default router;
