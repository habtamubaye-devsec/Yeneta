import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendVerificationEmail } from "../utils/verificationEmail.js";

const ADMIN_SUPPORT_EMAIL = "habtamubaye2127@gmail.com";
const BANNED_MESSAGE =
  `you are banned from the learn huub and talk to admin by this email ${ADMIN_SUPPORT_EMAIL}`;

// 📌 Generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "3d" },
  );
};

// 📩 Register User
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please provide name, email, and password");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400).json({ message: "User already exists" });
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const otp = crypto.randomInt(100000, 999999).toString();
  const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 mins

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    otp,
    otpExpiry,
    isVerified: false,
  });

  await sendVerificationEmail({ to: email, name, otp });

  res.status(201).json({
    message: "User registered successfully. Check your email for the OTP.",
    userId: user._id,
    email: user.email,
  });
});

// 🔑 Verify OTP
const verifyOtp = asyncHandler(async (req, res) => {
  const { userId, email, otp } = req.body;
  // Allow verification using either userId or email so users can recover after refresh
  let user = null;
  if (userId) {
    user = await User.findById(userId);
  } else if (email) {
    user = await User.findOne({ email });
  }

  if (!user) return res.status(404).json({ message: "User not found" });
  if (user.isVerified)
    return res.status(400).json({ message: "Already verified" });
  if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });
  if (user.otpExpiry < Date.now())
    return res.status(400).json({ message: "OTP expired" });

  user.isVerified = true;
  user.otp = null;
  user.otpExpiry = null;
  await user.save();

  res.status(200).json({ message: "Email verified successfully!" });
});

// 🔁 Resend OTP
const resendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });
  if (user.isVerified)
    return res.status(400).json({ message: "Already verified" });

  const otp = crypto.randomInt(100000, 999999).toString();
  user.otp = otp;
  user.otpExpiry = Date.now() + 10 * 60 * 1000;
  await user.save();

  await sendVerificationEmail({ to: user.email, name: user.name, otp });

  res.status(200).json({ message: "New OTP sent to your email" });
});

// 🔐 Login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log("CORS Origins:", process.env.CORS_ORIGIN);

  if (!email || !password)
    return res.status(400).json({ message: "All input is mandatory" });

  const user = await User.findOne({ email });
  if (!user)
    return res.status(401).json({ message: "Invalid email or password" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    return res.status(401).json({ message: "Invalid email or password" });

  if (!user.isVerified) {
    // Refresh OTP to ensure the user always has a valid code when attempting login
    const otp = crypto.randomInt(100000, 999999).toString();
    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendVerificationEmail({ to: user.email, name: user.name, otp });

    return res.status(403).json({
      message:
        "Please verify your email before logging in. A new code has been sent.",
      needsVerification: true,
      userId: user._id,
      email: user.email,
    });
  }

  if (user.status !== "active") {
    return res.status(403).json({
      message: BANNED_MESSAGE,
      accountStatus: user.status,
      adminEmail: ADMIN_SUPPORT_EMAIL,
      banned: true,
    });
  }

  const token = generateToken(user);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    // In production we need None+Secure for cross-site redirects (Stripe). In dev use 'lax'
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
  });

  res.status(200).json({
    message: "Login successful",
    token,
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      status: user.status,
      isVerified: user.isVerified,
    },
  });
});

// 🧠 Get Current Authenticated User
const me = asyncHandler(async (req, res) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.id) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // Find user by decoded id
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
      
    }

    if (user.status && user.status !== "active") {
      return res.status(403).json({
        message: BANNED_MESSAGE,
        accountStatus: user.status,
        adminEmail: ADMIN_SUPPORT_EMAIL,
        banned: true,
      });
    }

    res.status(200).json({ user });
  } catch (err) {
    console.error("Auth check failed:", err.message);
    res.status(401).json({ message: "Invalid or expired token" });
  }
});

// 🚪 Logout
const logout = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    expires: new Date(0),
  });

  res.status(200).json({ message: "Logout successful" });
});

export { registerUser, verifyOtp, resendOtp, login, me, logout };
