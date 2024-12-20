import nodemailer from "nodemailer";
import { environment } from "../environment.js";

// Ensure environment variables are properly typed and defaulted
const EMAIL_USER = environment.MY_GMAIL_ID;
const EMAIL_PASS = environment.MY_GMAIL_PASSWORD;

const transporter = nodemailer.createTransport({
  service: "Gmail", // or another email service
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

const sendingEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: `Project-Name <${EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new Error(
      "Failed to send email due to unexpected error",
      error.message
    );
  }
};

export default sendingEmail;
