import dotenv from "dotenv";
dotenv.config(); // ✅ load env variables first

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import session from "express-session";
import bodyParser from "body-parser";


import "./src/config/passport.js"; // ✅ now env vars are defined
import connectDB from "./src/config/db-connection.js";
import authRouter from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoute.js";
import courseRoute from "./src/routes/courseRoute.js";
import lessonRoutes from "./src/routes/lessonRoutes.js";
import enrollmentRoutes from "./src/routes/enrollementRoutes.js";
import certificateRoutes from "./src/routes/certificateRoutes.js";
import categoryRoutes from "./src/routes/categoryRoutes.js";
import reviewRoutes from "./src/routes/reviewRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js"

import geminiRoutes from './src/routes/geminiAiRoutes.js'
import dashboardRoutes from './src/routes/dashboardRoutes.js';

const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:5173", // frontend URL
  credentials: true, // <-- allows cookies to be sent
}));
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
  })
);

// Connect to MongoDB
connectDB();

app.use(passport.initialize());
app.use(passport.session());

// Stripe webhook requires raw body
app.use("/api/enrollment/webhook", bodyParser.raw({ type: "application/json" }));

app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRoutes);
app.use("/api/courses", courseRoute);
app.use("/api/courses", lessonRoutes);
app.use("/api/enrollment", enrollmentRoutes);
app.use("/api/certificate", certificateRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/courses", reviewRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/gemini", geminiRoutes);
app.use("/api/dashboard", dashboardRoutes);

// app.use("/api", resourceRoutes);

const PORT = process.env.PORT || 8001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Auto change for Wed Oct 23 2024 03:00:00 GMT+0300 (East Africa Time)