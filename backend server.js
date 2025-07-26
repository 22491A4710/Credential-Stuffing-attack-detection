require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios");
const LoginAttempt = require("./models/LoginAttempt");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ DB Error", err));

app.post("/login", async (req, res) => {
  const { username, password, token, timestamp } = req.body;

  const response = await axios.post(
    "https://www.google.com/recaptcha/api/siteverify",
    null,
    {
      params: {
        secret: process.env.RECAPTCHA_SECRET,
        response: token,
      },
    }
  );

  if (!response.data.success) {
    return res.status(403).json({ error: "Invalid CAPTCHA" });
  }

  await LoginAttempt.create({ username, timestamp });

  const attempts = await LoginAttempt.find({ username })
    .sort({ timestamp: -1 })
    .limit(5);

  const flagged = attempts.length >= 5;
  res.json({ flagged, loginCount: attempts.length });
});

app.listen(3000, () => console.log("🚀 Server running on http://localhost:3000"));
