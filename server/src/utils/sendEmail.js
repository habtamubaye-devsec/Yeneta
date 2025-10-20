import nodemailer from 'nodemailer';
import ejs from 'ejs';
import path from 'path';
import { fileURLToPath } from 'url';

// For ES modules, get __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const transporter = nodemailer.createTransport({
  service: 'gmail', // or your SMTP
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD, // App password for Gmail
  },
});

/**
 * Send verification email using EJS template
 */
export const sendVerificationEmail = async ({ to, name, otp }) => {
  try {
    const templatePath = path.join(__dirname, '../templates/verifyEmail.ejs');

    const html = await ejs.renderFile(templatePath, { name, otp });

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: 'Email Verification Code',
      html,
    });

    console.log('Verification email sent:', info.response);
    return info;
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
};
