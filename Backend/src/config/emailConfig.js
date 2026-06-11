import { Resend } from 'resend';
import config from './config.js';

const resend = new Resend(config.RESEND_API_KEY);

const transporter = {
  sendMail: async ({ from, to, subject, html }) => {
    const { error } = await resend.emails.send({ from, to, subject, html });
    if (error) throw new Error(error.message);
  }
};

export default transporter;