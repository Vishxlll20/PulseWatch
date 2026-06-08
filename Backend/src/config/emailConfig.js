import nodemailer from "nodemailer";
import config from "./config.js";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Must be false for port 587
  auth: {
    user: config.GMAIL_USER,
    pass: config.GMAIL_PASS, // Make sure this is your 16-character Google App Password!
  },
  tls: {
    rejectUnauthorized: false // Prevents Render from blocking the connection over SSL mismatches
  }
});

export default transporter;