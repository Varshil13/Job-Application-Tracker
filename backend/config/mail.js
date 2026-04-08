   
   const nodemailer = require("nodemailer");
   
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',   // ← verify this is correct
  port: 587,                 // ← try 587 if 465 fails
  secure: false,             // false for 587, true for 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 10000,  // increase if needed
});

// Test the connection explicitly
transporter.verify((err, success) => {
  if (err) console.error('SMTP verify failed:', err);
  else console.log('SMTP ready');
});
    module.exports = transporter;