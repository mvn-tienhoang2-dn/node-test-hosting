const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      password: process.env.EMAIL_PASSWORD,
    },
  });
  const mailOptions = {
    from: 'Tien Hoang V. <tien.hoang2@monstar-lab.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html: options.html,
  };
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
