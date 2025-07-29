const mongoose = require("mongoose");

const loginAttemptSchema = new mongoose.Schema({
  username: { type: String, required: true },
  timestamp: { type: String, required: true },
});

module.exports = mongoose.model("LoginAttempt", loginAttemptSchema);
