const express = require("express");
const router = express.Router();
const { createPetition, getAllPetitions, signPetition } = require("../controllers/petitionController");

// Middleware to protect routes (Reuse the one from dashboard.js or create middleware/auth.js)
const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ status: "error", message: "No token" });
  
  // MOCK USER ID for now (Replace with JWT verification later)
  req.user = { id: "67abc123def4567890abcdef" }; 
  next();
};

router.post("/create", protect, createPetition);
router.get("/all", protect, getAllPetitions);
router.post("/sign/:id", protect, signPetition);

module.exports = router;
