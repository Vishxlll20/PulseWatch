import nodemailer from "nodemailer";
import config from "./config.js";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,        // ← change from 587 to 465
  secure: true,     // ← change from false to true
  auth: {
    user: config.GMAIL_USER,
    pass: config.GMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});

export default transporter;