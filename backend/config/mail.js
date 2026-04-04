   
   const nodemailer = require("nodemailer");
   
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // REQUIRED
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS, // MUST be app password
  },
  connectionTimeout: 20000,
  greetingTimeout: 15000,
  socketTimeout: 30000,
});
    module.exports = transporter;