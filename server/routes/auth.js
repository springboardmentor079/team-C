const express = require("express");
const router = express.Router();
const User = require("../models/user");
const sendOTPMail = require("../utils/mailer");

let tempOTPs = {};

router.post("/register-otp", async (req, res) => {
  try {
    const { email } = req.body;
    const lowerEmail = email.toLowerCase();
    const existingUser = await User.findOne({ email: lowerEmail });
    if (existingUser) return res.status(400).json({ status: "error", message: "User already exists" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    tempOTPs[lowerEmail] = otp;

    const sent = await sendOTPMail(lowerEmail, otp);
    if (sent) res.json({ status: "ok", message: "OTP sent" });
    else res.status(500).json({ status: "error", message: "Mail failed" });
  } catch (err) { res.status(500).json({ status: "error" }); }
});

router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  const lowerEmail = email.toLowerCase();
  if (tempOTPs[lowerEmail] === otp) return res.json({ status: "ok" });
  const user = await User.findOne({ email: lowerEmail, otp: otp });
  if (user) return res.json({ status: "ok" });
  res.status(400).json({ status: "error", message: "Invalid OTP" });
});

router.post("/register", async (req, res) => {
  try {
    const { fullName, email, location, password, role } = req.body;
    const newUser = new User({ fullName, email: email.toLowerCase(), location, password, role });
    await newUser.save();
    delete tempOTPs[email.toLowerCase()];
    res.json({ status: "ok" });
  } catch (err) { res.status(500).json({ status: "error" }); }
});

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ status: "error", message: "Email not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    await user.save();
    await sendOTPMail(user.email, otp);
    res.json({ status: "ok" });
  } catch (err) { res.status(500).json({ status: "error" }); }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      user.password = newPassword;
      user.otp = undefined;
      await user.save();
      return res.json({ status: "ok" });
    }
    res.status(404).json({ status: "error" });
  } catch (err) { res.status(500).json({ status: "error" }); }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email.toLowerCase(), password });
  if (user) return res.json({ status: "ok", role: user.role });
  res.status(401).json({ status: "error" });
});

module.exports = router;