const Application = require("../models/applicationSchema");
const mongoose = require("mongoose");

const STATUS_DATE_FIELD = {
  saved: "savedDate",
  applied: "appliedDate",
  screen: "screenDate",
  interview: "interviewDate",
  offer: "offerDate",
};

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

async function findOwnedApplication(appId, userId) {
  return Application.findOne({ _id: appId, userId });
}

function normalizeStatus(status) {
  const allowed = new Set([
    "saved",
    "applied",
    "screen",
    "interview",
    "rejected",
    "offer",
    "withdrawn",
    "ghosted",
    "accepted",
  ]);
  const normalized = String(status || "saved").toLowerCase();
  return allowed.has(normalized) ? normalized : "saved";
}

function toNumberOrUndefined(value) {
  if (value === null || value === undefined || value === "") return undefined;

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : undefined;
  }

  if (typeof value === "string") {
    const match = value.match(/-?\d+(\.\d+)?/);
    if (!match) return undefined;
    const parsed = Number(match[0]);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
}

function toYearOrUndefined(value) {
  const parsed = toNumberOrUndefined(value);
  if (parsed !== undefined) return Math.trunc(parsed);

  if (typeof value === "string") {
    const text = value.toLowerCase();
    if (text.includes("final")) return 4;
  }

  return undefined;
}

function normalizeDeadlineToUTCDate(value) {
  if (!value) return undefined;

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate()));
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    const ymd = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (ymd) {
      const y = Number(ymd[1]);
      const m = Number(ymd[2]) - 1;
      const d = Number(ymd[3]);
      return new Date(Date.UTC(y, m, d));
    }
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return undefined;
  return new Date(Date.UTC(parsed.getUTCFullYear(), parsed.getUTCMonth(), parsed.getUTCDate()));
}

async function createApplication(req, res) {
  try {
    const userId = req.user.id;
    const {
      status,
      company,
      role,
      location,
      salary,
      stipend,
      jobType,
      description,
      portalLink,
      applicationLink,
      deadline,
      eligibilitySnapshot,
      eligibility,
      matchResult,
    } = req.body;

    if (!company || !role) {
      return res.status(400).json({
        success: false,
        message: "Company and role are required",
      });
    }

    const normalizedStatus = normalizeStatus(status);
    const now = new Date();

    const safeDeadline = normalizeDeadlineToUTCDate(deadline);

    const incomingEligibility = eligibilitySnapshot || eligibility || {};

    const safeEligibility = {
      skills: incomingEligibility.skills || [],
      branches: incomingEligibility.branches || [],
      degree: incomingEligibility.degree,
      experience: incomingEligibility.experience,
      cgpa: toNumberOrUndefined(incomingEligibility.cgpa),
      minGPA: toNumberOrUndefined(incomingEligibility.minGPA),
      year: toYearOrUndefined(incomingEligibility.year),
    };

    const safeMatchResult = {
      matchScore: matchResult?.matchScore ?? matchResult?.score,
      eligible: matchResult?.eligible,
      strengths: matchResult?.strengths || [],
      missingSkills: matchResult?.missingSkills || [],
      summary: matchResult?.summary,
      suggestions: matchResult?.suggestions || [],
    };

    const application = await Application.create({
      userId,
      company,
      role,
      location,
      salary,
      stipend,
      jobType,
      description,
      portalLink,
      applicationLink,
      deadline: safeDeadline,
      status: normalizedStatus,
      savedDate: normalizedStatus === "saved" ? now : undefined,
      appliedDate: normalizedStatus === "applied" ? now : undefined,
      eligibilitySnapshot: safeEligibility,
      matchResult: safeMatchResult,
    });

    return res.status(201).json({
      success: true,
      message: "Application created",
      application,
    });
  } catch (err) {
    console.error("Error creating application:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
}

async function getallapplications(req, res) {
  try {
    const userId = req.user.id;
    const applications = await Application.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: applications,
    });
  } catch (error) {
    console.error("Error fetching applications:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}

async function getjobdetails(req, res) {
  try {
    const jobid = req.params.id;
    const userId = req.user.id;

    if (!isValidObjectId(jobid)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application id",
      });
    }

    const application = await findOwnedApplication(jobid, userId);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Job not found or unauthorized",
      });
    }

    return res.status(200).json({
      success: true,
      application,
      documents: [],
    });
  } catch (err) {
    console.error("Error fetching job details:", err);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}

async function getApplicationStatus(req, res) {
  try {
    const appId = req.params.id;
    const userId = req.user.id;

    if (!isValidObjectId(appId)) {
      return res.status(400).json({ success: false, message: "Invalid application id" });
    }

    const application = await findOwnedApplication(appId, userId);
    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    return res.status(200).json({
      success: true,
      status: application.status,
      savedDate: application.savedDate,
      appliedDate: application.appliedDate,
      screenDate: application.screenDate,
      interviewDate: application.interviewDate,
      offerDate: application.offerDate,
    });
  } catch (err) {
    console.error("Error fetching application status:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
}

async function updateApplicationStatus(req, res) {
  try {
    const appId = req.params.id;
    const userId = req.user.id;
    const { status, savedDate, appliedDate, screenDate, interviewDate, offerDate } = req.body;

    if (!isValidObjectId(appId)) {
      return res.status(400).json({ success: false, message: "Invalid application id" });
    }

    if (!status) {
      return res.status(400).json({ success: false, message: "Status is required" });
    }

    const application = await findOwnedApplication(appId, userId);
    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    application.status = status;

    if (savedDate) application.savedDate = savedDate;
    if (appliedDate) application.appliedDate = appliedDate;
    if (screenDate) application.screenDate = screenDate;
    if (interviewDate) application.interviewDate = interviewDate;
    if (offerDate) application.offerDate = offerDate;

    const autoDateField = STATUS_DATE_FIELD[status];
    if (autoDateField && !application[autoDateField]) {
      application[autoDateField] = new Date();
    }

    await application.save();

    return res.status(200).json({
      success: true,
      message: "Status updated",
      application,
    });
  } catch (err) {
    console.error("Error updating application status:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
}

async function archiveApplication(req, res) {
  try {
    const appId = req.params.id;
    const userId = req.user.id;

    if (!isValidObjectId(appId)) {
      return res.status(400).json({ success: false, message: "Invalid application id" });
    }

    const application = await findOwnedApplication(appId, userId);
    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    application.status = "saved";
    if (!application.savedDate) application.savedDate = new Date();
    await application.save();

    return res.status(200).json({
      success: true,
      message: "Application archived",
      application,
    });
  } catch (err) {
    console.error("Error archiving application:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
}

async function deleteApplication(req, res) {
  try {
    const appId = req.params.id;
    const userId = req.user.id;

    if (!isValidObjectId(appId)) {
      return res.status(400).json({ success: false, message: "Invalid application id" });
    }

    const deleted = await Application.findOneAndDelete({ _id: appId, userId });
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    return res.status(200).json({ success: true, message: "Application deleted" });
  } catch (err) {
    console.error("Error deleting application:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
}

module.exports = {
  createApplication,
  getallapplications,
  getjobdetails,
  getApplicationStatus,
  updateApplicationStatus,
  archiveApplication,
  deleteApplication,
};
