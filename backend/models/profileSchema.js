const mongoose = require("mongoose");
const profileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    cgpa: Number,
    degree: String,
    branch: String,
    year: String,

    skills: [String],

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Profile", profileSchema);