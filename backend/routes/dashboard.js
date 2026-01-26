const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { getDashboard } = require("../controllers/dashboardController");

// ✅ REAL JWT AUTH MIDDLEWARE
const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ status: "error", message: "No token provided" });
    }

    // ✅ VERIFY REAL JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id: user._id, email: user.email }
    console.log("✅ Authenticated user:", decoded.email);
    next();
  } catch (error) {
    console.error("❌ Auth failed:", error.message);
    return res.status(401).json({ status: "error", message: "Invalid token" });
  }
};

router.get("/dashboard", protect, getDashboard);

module.exports = router;
