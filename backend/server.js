require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const LoginAttempt = require('./models/LoginAttempt');
const bodyParser = require('body-parser');
const cors = require('cors');
const fetch = require('node-fetch'); // for reCAPTCHA
const app = express();

app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log(err));

// CAPTCHA & Login Logic
app.post('/login', async (req, res) => {
  const { username, ip, captcha } = req.body;

  // CAPTCHA Verification
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  const verifyURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captcha}`;

  const captchaResponse = await fetch(verifyURL, { method: 'POST' });
  const captchaData = await captchaResponse.json();

  if (!captchaData.success) {
    return res.status(400).json({ message: 'CAPTCHA verification failed' });
  }

  // Save Login Attempt
  const attempt = new LoginAttempt({ username, ip, timestamp: new Date() });
  await attempt.save();

  const count = await LoginAttempt.countDocuments({ ip });

  // Threshold logic
  if (count >= 5) {
    return res.json({ message: '⚠️ Multiple login attempts detected', count });
  }

  res.json({ message: 'Login attempt recorded', count });
});

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
