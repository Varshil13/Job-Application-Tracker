const Application = require("../models/applicationSchema");
const transporter = require("../config/mail");

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function daysLeftUntil(deadline) {
  const today = startOfDay(new Date());
  const target = startOfDay(deadline);
  return Math.round((target.getTime() - today.getTime()) / ONE_DAY_MS);
}

async function sendReminderEmail({ to, subject, text }) {
  await transporter.sendMail({
    from: process.env.EMAIL,
    to,
    subject,
    text,
  });
}

async function processApplicationReminder(app) {
  const userEmail = app.userId?.email;
  const userName = app.userId?.name || "there";

  if (!userEmail) return;
  if (!app.smartReminderEnabled) return;

  let updated = false;

  // Deadline-based reminders: 5 days left, 1 day left
  if (app.deadline) {
    const daysLeft = daysLeftUntil(app.deadline);

    if (daysLeft === 5 && !app.reminderLogs?.deadlineFiveDaysSentAt) {
      await sendReminderEmail({
        to: userEmail,
        subject: `5 days left to apply: ${app.role || "Application"}`,
        text: `Hi ${userName},\n\nThere are 5 days left before the deadline for ${app.role || "this role"} at ${app.company || "the company"}.\n\nPlease complete your application in time.`,
      });
      app.reminderLogs = app.reminderLogs || {};
      app.reminderLogs.deadlineFiveDaysSentAt = new Date();
      updated = true;
    }

    if (daysLeft === 1 && !app.reminderLogs?.deadlineOneDaySentAt) {
      await sendReminderEmail({
        to: userEmail,
        subject: `1 day left to apply: ${app.role || "Application"}`,
        text: `Hi ${userName},\n\nOnly 1 day is left before the deadline for ${app.role || "this role"} at ${app.company || "the company"}.\n\nThis is your final reminder to apply.`,
      });
      app.reminderLogs = app.reminderLogs || {};
      app.reminderLogs.deadlineOneDaySentAt = new Date();
      updated = true;
    }
  }

  // Applied reminder: one day after appliedDate
  if (app.status === "applied" && app.appliedDate && !app.reminderLogs?.appliedOneDaySentAt) {
    const appliedAt = new Date(app.appliedDate).getTime();
    const now = Date.now();

    if (now - appliedAt >= ONE_DAY_MS) {
      await sendReminderEmail({
        to: userEmail,
        subject: `Result update reminder: ${app.role || "Application"}`,
        text: `Hi ${userName},\n\nYour result for ${app.role || "this internship"} at ${app.company || "the company"} may be announced soon.\n\nKeep checking your email and portal updates.`,
      });
      app.reminderLogs = app.reminderLogs || {};
      app.reminderLogs.appliedOneDaySentAt = new Date();
      updated = true;
    }
  }

  if (updated) {
    app.markModified("reminderLogs");
    await app.save();
  }
}

async function runReminderSweep() {
  try {
    const apps = await Application.find({ smartReminderEnabled: true }).populate(
      "userId",
      "email name",
    );

    for (const app of apps) {
      try {
        await processApplicationReminder(app);
      } catch (err) {
        console.error(`Reminder failed for application ${app._id}:`, err.message);
      }
    }
  } catch (err) {
    console.error("Reminder sweep failed:", err);
  }
}

function startReminderScheduler() {
  // Run once at startup, then hourly.
  runReminderSweep();
  setInterval(runReminderSweep, 60 * 60 * 1000);
}

module.exports = {
  startReminderScheduler,
};
