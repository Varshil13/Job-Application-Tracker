const e = require("express");
const mongoose = require("mongoose");
const resumeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",

    },
    fileUrl: String,
    parsedData: {
        skills: [String],
        projects: [{
            name: String,
            description: String,
            techStack: [String]
        }],
        experience: [{
            company: String,
            role: String,
            duration: String
        }],
        education: [{
            degree: String,
            college: String,
            year: String,
            cgpa: String

        }]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

});
module.exports = mongoose.model("Resume", resumeSchema)