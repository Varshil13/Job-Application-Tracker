const dns = require('dns');
const { promisify } = require('util');
const resolve4 = promisify(dns.resolve4);

const [ip] = await resolve4('smtp.gmail.com');

const transporter = nodemailer.createTransport({
  host: ip,       // use resolved IPv4 directly
  port: 587,
  secure: false,
  family: 4,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    servername: 'smtp.gmail.com'  // required when using IP instead of hostname
  }
});

// Test the connection explicitly
transporter.verify((err, success) => {
  if (err) console.error('SMTP verify failed:', err);
  else console.log('SMTP ready');
});
    module.exports = transporter;