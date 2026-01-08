import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const transporter = nodemailer.createTransport({
  service: "gmail", // or your SMTP provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD, // Gmail App Password
  },
});

export const sendVerificationEmail = async ({
  to,
  name,
  otp,
  expiresMinutes = 10,
}) => {
  try {
    const appName = process.env.APP_NAME || "Yeneta";
    const templatePath = path.join(__dirname, "../templates/verifyEmail.ejs");

    const logoPath = path.join(__dirname, "../templates/yeneta2.png");
    const logoCid = fs.existsSync(logoPath) ? "yeneta-logo" : null;

    const html = await ejs.renderFile(templatePath, {
      appName,
      name,
      otp,
      expiresMinutes,
      logoCid,
    });

    const text =
      `${appName} verification code: ${otp}\n\n` +
      `This code expires in ${expiresMinutes} minutes.\n` +
      `If you didn’t request this, you can ignore this email.`;

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: `${appName} — Email verification code`,
      text,
      html,
      attachments: logoCid
        ? [
            {
              filename: "logo.png",
              path: logoPath,
              cid: logoCid,
            },
          ]
        : [],
    });

    console.log("Verification email sent:", info.response);
    return info;
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error;
  }
};
