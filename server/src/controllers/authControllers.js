    import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendVerificationEmail } from "../utils/verificationEmail.js";

// 📌 Generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "3d" }
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
    res.status(400).json({message: "User already exists"});
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

  await sendVerificationEmail({ to: email, otp });

  res.status(201).json({
    message: "User registered successfully. Check your email for the OTP.",
    userId: user._id,
  });
});

// 🔑 Verify OTP
const verifyOtp = asyncHandler(async (req, res) => {
  const { userId, otp } = req.body;

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });
  if (user.isVerified) return res.status(400).json({ message: "Already verified" });
  if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });
  if (user.otpExpiry < Date.now()) return res.status(400).json({ message: "OTP expired" });

  user.isVerified = true;
  user.otp = null;
  user.otpExpiry = null;
  await user.save();

  res.status(200).json({ message: "Email verified successfully!" });
});

// 🔁 Resend OTP
const resendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });
  if (user.isVerified) return res.status(400).json({ message: "Already verified" });

  const otp = crypto.randomInt(100000, 999999).toString();
  user.otp = otp;
  user.otpExpiry = Date.now() + 10 * 60 * 1000;
  await user.save();

  await sendVerificationEmail({ to: email, otp });

  res.status(200).json({ message: "New OTP sent to your email" });
});

// 🔐 Login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "All input is mandatory" });

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: "Invalid email or password" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

  if (!user.isVerified)
    return res.status(401).json({ message: "Please verify your email first" });

  const token = generateToken(user);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
  });

  res.status(200).json({
    message: "Login successful",
    token,
    user: { id: user._id, email: user.email, name: user.name, role: user.role },
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
    sameSite: "strict",
    expires: new Date(0),
  });

  res.status(200).json({ message: "Logout successful" });
});

export { registerUser, verifyOtp, resendOtp, login, me, logout };