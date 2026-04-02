const mongoose = require("mongoose")

const applicationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    company: String,
    role: String,
    location: String,
    salary: String,
    stipend: String,
    jobType: String,
    description: String,
    portalLink: String,
    

    deadline: Date,
    applicationLink: String,

    savedDate: {
        type: Date,
        default: Date.now
    },

    appliedDate: Date,
    screenDate: Date,
    interviewDate: Date,
    offerDate: Date,

    status: {
        type: String,
        enum: [
            "saved",
            "applied",
            "screen",
            "interview",
            "rejected",
            "offer",
            "withdrawn",
            "ghosted",
            "accepted"
        ],
        default: "saved"
    },

    smartReminderEnabled: {
        type: Boolean,
        default: false
    },

    reminderLogs: {
        deadlineFiveDaysSentAt: Date,
        deadlineOneDaySentAt: Date,
        appliedOneDaySentAt: Date,
    },

    matchResult: {
        matchScore: Number,
        eligible: Boolean,
        strengths: [String],
        missingSkills: [String],
        summary: String,
        suggestions: [String]
    },

    eligibilitySnapshot: {
        skills: [String],
        branches: [String],
        degree: String,
        experience: String,
        cgpa: Number,
        minGPA: Number,
        year: Number
    }
}, { timestamps: true });

module.exports = mongoose.model("Application", applicationSchema)