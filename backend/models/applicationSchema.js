const mongoose = require("mongoose");
const applicationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    company: String,
    role: String,
    deadline: Date,

    applicationLink: String,

    appliedDate: {
        type: Date,
        default: Date.now
    },

    status: {
        type: String,
        enum: ["applied", "interview", "rejected", "offer"],
        default: "applied"
    },
    matchResult: {
        matchScore: Number,
        eligible: Boolean,
        strengths: [String],
        missingSkills: [String],
        summary: String,
        suggestions: [String]
    },

    // at the time of applying , tumhari ye halat thi , ab ho sakta hai better ya worse ho
    eligibilitySnapshot: {
        skills: [String],
        degree: String,
        experience: String
    }
});
module.exports = mongoose.model("Application", applicationSchema);