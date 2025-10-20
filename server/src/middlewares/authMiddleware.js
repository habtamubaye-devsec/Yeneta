import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// 🔒 Protect routes (must be logged in)
export const protect = async (req, res, next) => {
  try {
    let token;

    // ✅ Get token from cookies
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ success: false, message: "Not authorized, no token" });
    }

    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Attach user to request
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    next();
  } catch (error) {
    console.error("Auth error:", error.message);
    return res.status(401).json({ success: false, message: "Not authorized, token failed" });
  }
};

// 🔑 Authorize specific roles (student, instructor, admin, etc.)
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Forbidden: You don’t have permission" });
    }
    next();
  };
};
