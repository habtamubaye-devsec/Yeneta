import express from 'express'
import passport from "passport";
import jwt from "jsonwebtoken";
import { registerUser, resendOtp, verifyOtp, login, logout } from '../controllers/authControllers.js'

const router = express.Router()


// Google
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // Successful login
     const token = jwt.sign(
      { id: req.user._id, email: req.user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Store JWT in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,        // JS can't access this cookie
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      sameSite: "strict"
    });
    res.redirect("/dashboard"); // or send JWT cookie here
  }
);

// GitHub
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

router.get("/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => {
     const token = jwt.sign(
      { id: req.user._id, email: req.user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Store JWT in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,        // JS can't access this cookie
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      sameSite: "strict"
    });
    res.redirect("/dashboard"); // or send JWT cookie here
  }
);

router.post('/register', registerUser)
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp); 
router.post("/login", login); 
router.post("/logout", logout); 

export default router