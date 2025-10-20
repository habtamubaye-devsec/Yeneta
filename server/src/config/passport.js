import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import crypto from "crypto"
import User from "../models/userModel.js";
import dotenv from "dotenv";

dotenv.config(); // ✅ Make sure env variables are loaded

console.log("Google Client ID:", process.env.GOOGLE_CLIENT_ID);
console.log("Google Client Secret:", process.env.GOOGLE_CLIENT_SECRET);

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
        callbackURL: "/api/auth/google/callback",
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
        callbackURL: "/api/auth/github/callback",
        scope: ["user:email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails && profile.emails[0]?.value;
          if (!email) return done(new Error("GitHub profile has no email"), null);

          const existingUser = await User.findOne({ email });
          if (existingUser) return done(null, existingUser);

          const newUser = await User.create({
            name: profile.username,
            email,
            isVerified: true,
          });
          done(null, newUser);
        } catch (error) {
          done(error, null);
        }
      }
    )
  );
}

export default passport;
