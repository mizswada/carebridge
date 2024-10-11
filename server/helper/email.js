import nodemailer from "nodemailer";
const config = useRuntimeConfig();

const transporter = nodemailer.createTransport({
  host: config.NUXT_NODEMAILER_HOST,
  port: config.NUXT_NODEMAILER_PORT,
  secure: config.NUXT_NODEMAILER_SECURE === "true", // Convert to boolean if needed
  auth: {
    user: config.NUXT_NODEMAILER_EMAIL,
    pass: config.NUXT_NODEMAILER_PASSWORD,
  },
});

async function main(to, subject, text, html) {
  try {
    if (!to) throw new Error("Recipient email address 'to' is required");
    if (!subject) throw new Error("Email subject is required");
    if (!text) throw new Error("Email text content is required");
    if (!html) throw new Error("Email HTML content is required");

    // Send email with the transport object
    const info = await transporter.sendMail({
      from: `"Toyyibcart" <${config.NUXT_NODEMAILER_EMAIL}>`, // sender address
      to, // recipient address
      subject, // Subject line
      text, // Plain text body
      html, // HTML body
    });

    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Failed to send email:", error);
  }
}

export default main;
