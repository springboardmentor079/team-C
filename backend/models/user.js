const mongoose = require('mongoose');

// ✅ BULLETPROOF - No overwrite errors
if (mongoose.models.User) {
  delete mongoose.models.User;
  delete mongoose.connection.models.User;
}

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  location: { type: String, default: "Chennai" },
  role: { type: String, enum: ["Citizen", "Admin"], default: "Citizen" },
  
  // ✅ ADDED: OTP Field for Password Reset
  otp: { type: String },
  
  // ✅ Keep existing field
  impactPoints: { type: Number, default: 0 },
  
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
