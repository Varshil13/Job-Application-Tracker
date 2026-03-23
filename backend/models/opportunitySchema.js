const mongoose = require("mongoose");
const opportunitySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    source: {
        type: String,
        enum: ["pdf", "text", "link", "screenshot"]
    },
    company: String,
    position: String,
    applicationDeadline: String,
    eligibility: {
        minGPA: String,
        degree: String,
        branches: [String],
        year: String,
        skills: [String],
        experience: String
    },
    salary: String,
    jobType: {
        type: String,
        enum: ["full-time", "part-time", "internship"]
    },
    portalLink: String,
    applicationLink: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Opportunity", opportunitySchema);