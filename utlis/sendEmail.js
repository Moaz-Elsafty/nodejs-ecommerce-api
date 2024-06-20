// eslint-disable-next-line import/no-extraneous-dependencies
const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // 1) Create transporter ( service that will send email like "gmail", "Mailgun", "Mailtrap", "sendGrid")
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT, // if secure false port = 587, if true port = 465
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  // 2) Define email options ( like from, to, subject, email content)
  const mailOptions = {
    from: "E-shop App <moaz.elsafty11@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  // 3) Send email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
