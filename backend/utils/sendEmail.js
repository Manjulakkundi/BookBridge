// backend/utils/sendEmail.js
// Handles sending OTP emails via Gmail.
// Nodemailer is the library used to send emails from Node.js.

const nodemailer = require("nodemailer");

const sendOTPEmail = async (email, otp) => {
  // Create a transporter — this is the "email sender" configuration
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // This must be a Gmail App Password
    },
  });

  // Build the email with a clean HTML template
  const mailOptions = {
    from: `"BookBridge" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "BookBridge — Your Email Verification OTP",
    html: `
      <div style="
        font-family: Arial, sans-serif;
        max-width: 480px;
        margin: auto;
        padding: 32px;
        background: #ffffff;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
      ">
        <h2 style="color: #111827; margin-bottom: 8px;">Verify your email</h2>
        <p style="color: #6b7280; font-size: 15px;">
          Use the OTP below to complete your BookBridge registration.
          It expires in <strong>10 minutes</strong>.
        </p>

        <div style="
          display: flex;
          justify-content: center;
          gap: 8px;
          margin: 28px 0;
        ">
          ${otp.split("").map(digit => `
            <div style="
              width: 44px; height: 52px;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              font-size: 26px;
              font-weight: bold;
              border: 2px solid #d1d5db;
              border-radius: 8px;
              background: #f9fafb;
              color: #111827;
              margin: 0 3px;
            ">${digit}</div>
          `).join("")}
        </div>

        <p style="color: #9ca3af; font-size: 13px; margin-top: 24px;">
          If you didn't create a BookBridge account, you can safely ignore this email.
        </p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = { sendOTPEmail };
