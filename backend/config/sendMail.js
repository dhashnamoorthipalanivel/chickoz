const nodemailer = require("nodemailer");

const sendMail = async ({ to, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",

      auth: {
        user: process.env.EMAIL_USER,

        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,

      to,

      subject,

      html,
    });

    console.log("EMAIL SENT SUCCESSFULLY");
  } catch (error) {
    console.log("MAIL ERROR:", error);
  }
};

module.exports = sendMail;
