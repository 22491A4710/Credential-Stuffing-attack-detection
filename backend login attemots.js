const mongoose = require("mongoose");

const loginSchema = new mongoose.Schema({
  username: String,
  timestamp: String,
});

module.exports = mongoose.model("LoginAttempt", loginSchema);
