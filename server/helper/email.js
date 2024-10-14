import nodemailer from "nodemailer";
const config = useRuntimeConfig();

// console.log("NUXT_NODEMAILER_HOST:", config.NUXT_NODEMAILER_HOST);
// console.log("NUXT_NODEMAILER_PORT:", config.NUXT_NODEMAILER_PORT);
// console.log("NUXT_NODEMAILER_SECURE:", config.NUXT_NODEMAILER_SECURE);
// console.log("NUXT_NODEMAILER_EMAIL:", config.NUXT_NODEMAILER_EMAIL);
// console.log("NUXT_NODEMAILER_PASSWORD:", config.NUXT_NODEMAILER_PASSWORD);

// const transporter = nodemailer.createTransport({
//   host: config.NUXT_NODEMAILER_HOST,
//   port: parseInt(config.NUXT_NODEMAILER_PORT, 10), // Ensure the port is correctly parsed as an integer
//   // port: 2525,
//   secure: config.NUXT_NODEMAILER_SECURE === "true", // Convert to boolean if needed
//   auth: {
//     user: config.NUXT_NODEMAILER_EMAIL,
//     pass: config.NUXT_NODEMAILER_PASSWORD,
//   },
// });

// const transporter = nodemailer.createTransport({
//   host: config.nodemailer.host,
//   port: config.nodemaier.port,
//   secure: config.nodemailer.secure,
//   auth: {
//     user: config.nodemailer.email,
//     pass: config.nodemailer.password,
//   },
// });

const transporter = nodemailer.createTransport({
  host: config.nodemailer.host,
  port: config.nodemailer.port,
  secure: config.nodemailer.secure,
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: config.nodemailer.email,
    pass: config.nodemailer.password,
  },
});

async function sendMail(to, subject, text, html) {
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

export default sendMail;
