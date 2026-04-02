const Application = require("../models/applicationSchema");
const mongoose = require("mongoose");

function parseEnabled(value) {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const v = value.trim().toLowerCase();
    return v === "true" || v === "1";
  }
  return Boolean(value);
}

async function getReminderState(req, res) {
  try {
    const { jobId } = req.params;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ success: false, message: "Invalid application id" });
    }

    const app = await Application.findOne({ _id: jobId, userId }).select(
      "smartReminderEnabled",
    );

    if (!app) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    return res.status(200).json({ success: true, enabled: !!app.smartReminderEnabled });
  } catch (err) {
    console.error("Error fetching reminder state:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
}

async function updateReminderState(req, res) {
  try {
    const { jobId } = req.params;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ success: false, message: "Invalid application id" });
    }

    const enabled = parseEnabled(req.body?.enabled);

    const app = await Application.findOne({ _id: jobId, userId });
    if (!app) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    app.smartReminderEnabled = enabled;
    await app.save();

    return res.status(200).json({
      success: true,
      message: "Reminder updated",
      enabled,
    });
  } catch (err) {
    console.error("Error updating reminder state:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
}

module.exports = {
  getReminderState,
  updateReminderState,
};
