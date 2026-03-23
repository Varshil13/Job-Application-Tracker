const mongoose = require("mongoose");
const documentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    name: String,
    fileUrl: String,

    type: {
        type: String,
        enum: ["resume", "coverLetter", "marksheet", "other"]
    },

    isLocked: {
        type: Boolean,
        default: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Document", documentSchema);