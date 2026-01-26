require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Import Routes
const authRoutes = require("./routes/auth");
const dashboardRoutes = require("./routes/dashboard");
const petitionRoutes = require("./routes/petitions");
const pollRoutes = require("./routes/polls");
const reportRoutes = require("./routes/reports");

const app = express();

// Middleware
app.use(cors()); // Allows all connections (Update for production later)
app.use(express.json()); // Parses incoming JSON requests

// ✅ SMART CSP HEADER (Works for Localhost & Production)
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; " +
    "connect-src 'self' http://localhost:3000 http://localhost:5000 ws://localhost:3000 ws://localhost:5000; " +
    "script-src 'self' 'unsafe-inline'; " +
    "style-src 'self' 'unsafe-inline';"
  );
  next();
});

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Database Connected"))
  .catch((err) => console.log("❌ DB Error:", err));

// Route Mounting
app.use("/api/auth", authRoutes);       // -> /api/auth/login
app.use("/api", dashboardRoutes);       // -> /api/dashboard
app.use("/api/petitions", petitionRoutes); // -> /api/petitions
app.use("/api/polls", pollRoutes);      // -> /api/polls
app.use("/api/reports", reportRoutes);  // -> /api/reports

// Health Check
app.get("/", (req, res) => {
  res.json({ 
    status: "Civix Backend LIVE", 
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || "development"
  });
});

// ✅ GLOBAL ERROR HANDLER (Prevents server crashes)
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.stack);
  res.status(500).json({ 
    status: "error", 
    message: err.message || "Internal Server Error" 
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 API endpoints: /api/auth, /api/dashboard, /api/petitions, /api/polls, /api/reports`);
});
