   
   const nodemailer = require("nodemailer");
   
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  family: 4, // 🔥 prevents IPv6 issues
  auth: {
    user: process.env.EMAIL,
    pass: process.env.APP_PASSWORD,
  },
  connectionTimeout: 30000,
  greetingTimeout: 20000,
  socketTimeout: 40000,
});
    module.exports = transporter;