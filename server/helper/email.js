import nodemailer from "nodemailer";

const config = useRuntimeConfig();

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

async function main(to, subject, text, html) {
  try {
    if (!to) throw new Error("to is required");
    if (!subject) throw new Error("subject is required");
    if (!text) throw new Error("text is required");
    if (!html) throw new Error("html is required");

    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: '"carebridge" <' + config.nodemailer.email + ">", // sender address
      to: to, // list of receivers
      subject: subject, // Subject line
      text: text, // plain text body
      html: html, // html body
    });

    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.log(error);
  }
}

<<<<<<< HEAD
export default main;
=======
export default main;
>>>>>>> suhada
