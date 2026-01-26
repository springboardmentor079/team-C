const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); 
const sendOTPMail = require("../utils/mailer");

// Temporary in-memory storage for Registration OTPs
let tempOTPs = {};

// 🔍 DEBUG MIDDLEWARE: Log every request hitting this router
router.use((req, res, next) => {
  console.log(`📡 Auth Request: ${req.method} ${req.path}`);
  if (req.method === 'POST') console.log("📦 Body:", req.body);
  next();
});

// ✅ 1. REGISTER OTP (Validation + Storage)
router.post("/register-otp", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ status: "error", message: "Email is required" });
    
    const lowerEmail = email.toLowerCase().trim(); // Trim added for safety
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: lowerEmail });
    if (existingUser) {
      return res.status(400).json({ status: "error", message: "User already exists" });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    tempOTPs[lowerEmail] = otp;

    console.log(`Generated Register OTP for ${lowerEmail}: ${otp}`); // Debug log

    await sendOTPMail(lowerEmail, otp);
    res.json({ status: "success", message: "OTP sent" });

  } catch (err) {
    console.error("Register OTP Error:", err.message);
    res.status(500).json({ status: "error", message: "Failed to send OTP" });
  }
});

// ✅ 2. VERIFY OTP (Handles both Register & Forgot Password flows)
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ status: "error", message: "Missing email or OTP" });

    const lowerEmail = email.toLowerCase().trim();
    console.log(`🔍 Verifying ${lowerEmail} with OTP: ${otp}`);

    // Check Registration OTP (In Memory)
    if (tempOTPs[lowerEmail]) {
        if (tempOTPs[lowerEmail] === otp) {
            console.log("✅ Match found in Memory (Register)");
            return res.json({ status: "success", message: "OTP Verified" });
        } else {
            console.log(`❌ Memory Mismatch: Expected ${tempOTPs[lowerEmail]}, Got ${otp}`);
        }
    }

    // Check Forgot Password OTP (stored in DB)
    const user = await User.findOne({ email: lowerEmail });
    if (user) {
        if (user.otp === otp) {
             console.log("✅ Match found in Database (Reset)");
             return res.json({ status: "success", message: "OTP Verified" });
        } else {
             console.log(`❌ DB Mismatch: Expected ${user.otp}, Got ${otp}`);
        }
    } else {
        console.log("❌ User not found in DB");
    }

    res.status(400).json({ status: "error", message: "Invalid OTP" });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    res.status(500).json({ status: "error", message: "Verification failed" });
  }
});

// ✅ 3. REGISTER (Complete Registration)
router.post("/register", async (req, res) => {
  try {
    const { fullName, email, location, password, role } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ status: "error", message: "Missing required fields" });
    }
    
    const lowerEmail = email.toLowerCase().trim();

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User
    const newUser = new User({ 
      fullName, 
      email: lowerEmail, 
      location: location || "Chennai", 
      password: hashedPassword, 
      role: role || "Citizen" 
    });

    await newUser.save();

    // Cleanup OTP
    delete tempOTPs[lowerEmail];

    // Generate Token immediately so user is logged in
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email }, 
      process.env.JWT_SECRET, 
      { expiresIn: "7d" }
    );

    res.status(201).json({ 
      status: "success", 
      token,
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        location: newUser.location,
        role: newUser.role
      }
    });

  } catch (err) {
    console.error("Register Error:", err.message);
    res.status(500).json({ status: "error", message: "Registration failed" });
  }
});

// ✅ 4. FORGOT PASSWORD (Generates & Saves OTP)
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ status: "error", message: "Email is required" });
    
    const lowerEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: lowerEmail });
    
    if (!user) return res.status(404).json({ status: "error", message: "User not found" });

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Save OTP to User document
    user.otp = otp;
    await user.save();

    console.log(`Generated Reset OTP for ${lowerEmail}: ${otp}`); // Debug log

    await sendOTPMail(lowerEmail, otp);
    res.json({ status: "success", message: "OTP sent to email" });

  } catch (err) {
    console.error("Forgot Password Error:", err.message);
    res.status(500).json({ status: "error", message: "Failed to send OTP" });
  }
});

// ✅ 5. RESET PASSWORD (SECURE: Requires OTP)
router.post("/reset-password", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !newPassword || !otp) {
      return res.status(400).json({ status: "error", message: "Email, OTP, and new password are required" });
    }
    
    const lowerEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: lowerEmail });
    if (!user) return res.status(404).json({ status: "error", message: "User not found" });

    // 🔒 Security Check: Verify OTP again before resetting
    if (user.otp !== otp) {
      return res.status(400).json({ status: "error", message: "Invalid or expired OTP" });
    }
    
    // Update Password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.otp = undefined; // Clear OTP
    await user.save();

    res.json({ status: "success", message: "Password updated successfully" });

  } catch (err) {
    console.error("Reset Password Error:", err.message);
    res.status(500).json({ status: "error", message: "Password reset failed" });
  }
});

// ✅ 6. LOGIN (Standardized Response)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ status: "error", message: "Email and password are required" });
    }
    
    const lowerEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: lowerEmail }).select("+password"); // Ensure password is fetched
    
    if (!user) return res.status(401).json({ status: "error", message: "Invalid credentials" });
    
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return res.status(401).json({ status: "error", message: "Invalid credentials" });
    
    const token = jwt.sign(
      { id: user._id, email: user.email }, 
      process.env.JWT_SECRET, 
      { expiresIn: "7d" }
    );

    // Return full user object for Dashboard
    res.json({ 
      status: "success", 
      token, 
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        location: user.location,
        role: user.role
      }
    });

  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ status: "error", message: "Login failed" });
  }
});

module.exports = router;
