import dotenv from "dotenv";
dotenv.config(); // ✅ load env variables first

import express from "express";
import http from "http";
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
import notication from './src/routes/notificationRoutes.js';
import { initSocket } from "./src/config/socket.js";

const app = express();
const httpServer = http.createServer(app);

// Middleware
const isAllowedOrigin = (origin) => {
  if (!origin) return true;

  const allowedOrigins = [
    process.env.CLIENT_URL,
    "http://localhost:5173",
    "http://localhost:5174",
  ].filter(Boolean);

  if (allowedOrigins.includes(origin)) return true;
  if (/^http:\/\/localhost:\d+$/.test(origin)) return true;
  return false;
};

app.use(
  cors({
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) return callback(null, true);
      return callback(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true,
  })
);
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


// Health check endpoint for deployment verification
app.get("/healthz", (req, res) => {
  res.status(200).json({ status: "ok", deployedAt: new Date().toISOString() });
});

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
app.use("/api/notifications", notication);

initSocket(httpServer);


const PORT = process.env.PORT || 8001;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("✅ Deployment successful! Health check available at /healthz");
});
