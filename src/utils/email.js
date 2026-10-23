import nodemailer from "nodemailer";

export const sendEmail = async (options) => {
  const port = Number(process.env.SMTP_PORT) || 587;
  const isSecure = port === 465 || process.env.SMTP_SECURE === "true";

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "sandbox.smtp.mailtrap.io",
    port,
    secure: isSecure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const message = {
    from: `${process.env.FROM_NAME || "LocalHost Dining"} <${process.env.FROM_EMAIL || process.env.SMTP_USER || "reservations@localhostdining.com"}>`,
    to: options.email,
    subject: options.subject,
    text: options.message || "",
    html: options.html,
  };

  try {
    const info = await transporter.sendMail(message);
    console.log("📧 Email successfully dispatched to %s (ID: %s)", options.email, info.messageId);
    return info;
  } catch (error) {
    console.error("⚠️ Failed to dispatch email to %s:", options.email, error.message);
    return null;
  }
};
