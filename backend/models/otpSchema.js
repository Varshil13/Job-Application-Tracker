// models/Otp.js
const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  email: String,
  otp: String,
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300, // auto delete in 5 min
  },
});

module.exports = mongoose.model("Otp", otpSchema);