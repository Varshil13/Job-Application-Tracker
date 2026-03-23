const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        unique: true
    },
    password: String,
    authProvider: {
        type: String,
        enum: ["local", "google"],
        default: "local"
    },
    googleId: String,
    createdAt: {
        type: Date,
        default: Date.now
    }

});
module.exports = mongoose.model("User", userSchema);