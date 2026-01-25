import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import crypto from "crypto"
import User from "../models/userModel.js";
import dotenv from "dotenv";

dotenv.config();

const callbackURL = process.env.callbackURL || "http://localhost:8000";

// Serialize/deserialize
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

// --- Google OAuth ---
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.warn("Google OAuth client ID/secret not set in .env");
} else {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: callbackURL + "/api/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const existingUser = await User.findOne({ email: profile.emails[0].value });
          if (existingUser) return done(null, existingUser);

          const newUser = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            password: crypto.randomBytes(20).toString("hex"),
            isVerified: true, // OAuth emails are trusted
          });
          done(null, newUser);
        } catch (error) {
          done(error, null);
        }
      }
    )
  );
}

// --- GitHub OAuth ---
if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
  console.warn("GitHub OAuth client ID/secret not set in .env");
} else {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: callbackURL + "/api/auth/github/callback",
        scope: ["user:email"], // 🔑 Required to fetch emails
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // GitHub may not return a public email
          let email = profile.emails?.[0]?.value;

          // Fallback: generate a fake email if none exists
          if (!email) {
            email = `${profile.username}@users.noreply.github.com`;
            console.warn("No public email for GitHub user, using fallback:", email);
          }

          // Check if user already exists
          const existingUser = await User.findOne({ email });
          if (existingUser) return done(null, existingUser);

          // Create new user
          const newUser = await User.create({
            name: profile.displayName || profile.username,
            email,
            isVerified: true, // OAuth trusted
            password: crypto.randomBytes(20).toString("hex"), // random password
          });

          done(null, newUser);
        } catch (error) {
          done(error, null);
        }
      }
    )
  );
}
// Auto change for Sat Oct 26 2024 03:00:00 GMT+0300 (East Africa Time)