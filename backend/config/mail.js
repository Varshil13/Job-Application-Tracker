const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const DEFAULT_FROM = process.env.EMAIL_FROM || "noreply@trakio-v1.vshil.me";

const transporter = {
  async sendMail({ to, subject, text, html, from }) {
    const { data, error } = await resend.emails.send({
      from: from || DEFAULT_FROM,
      to,
      subject,
      text,
      html,
    });

    if (error) {
      throw new Error(error.message || "Failed to send email");
    }

    return data;
  },
};

module.exports = transporter;