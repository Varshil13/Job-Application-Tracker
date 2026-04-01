const applicationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    company: String,
    role: String,
    location: String,

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
        degree: String,
        experience: String
    }
});