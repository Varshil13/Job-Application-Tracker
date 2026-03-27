const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: function () {
            return this.authProvider === "local";
        }
    },
    authProvider: {
        type: String,
        enum: ["local", "google"],
        default: "local"
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true
    },
    profilePic: String,
    createdAt: {
        type: Date,
        default: Date.now
    }

});
module.exports = mongoose.model("User", userSchema);