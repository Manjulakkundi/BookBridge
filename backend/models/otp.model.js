// backend/models/otp.model.js

const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  // MongoDB will automatically delete this document when expiresAt is reached
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 },
  },
  verified: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("OTP", otpSchema);
