import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import {
  registerUser,
  resendOtp,
  verifyOtp,
  login,
  logout,
  me,
} from "../controllers/authControllers.js";

const router = express.Router();

// ========================
// GOOGLE AUTH
// ========================
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"]}));

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login", session: false }),
  (req, res) => {
    const token = jwt.sign( 
      { id: req.user._id, email: req.user.email, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Secure HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    // Redirect to frontend dashboard
    res.redirect('http://localhost:5173/');
  }
);

// ========================
// GITHUB AUTH
// ========================
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/login", session: false }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user._id, email: req.user.email, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Secure HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    // Redirect to frontend dashboard
    res.redirect('http://localhost:5173/');
  }
);

// ========================
// LOCAL AUTH ROUTES
// ========================
router.post("/register", registerUser);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", me);

export default router;

// Auto change for Mon Oct 21 2024 03:00:00 GMT+0300 (East Africa Time)
// Auto change for Mon Oct 28 2024 03:00:00 GMT+0300 (East Africa Time)
// Auto change for Fri Nov 01 2024 03:00:00 GMT+0300 (East Africa Time)