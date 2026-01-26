const mongoose = require("mongoose");

const petitionSchema = new mongoose.Schema({
  title: { type: String, required: true, maxlength: 200 },
  description: { type: String, required: true },
  category: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  
  signatures: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    signedAt: { type: Date, default: Date.now }
  }],
  
  signatureCount: { type: Number, default: 0 },
  targetSignatures: { type: Number, required: true, min: 10 },
  status: { type: String, enum: ["Active", "Victory", "Closed"], default: "Active" },
  deadline: { type: Date, required: true },
  urgent: { type: Boolean, default: false },  // ✅ ADDED FOR TRENDING
  location: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// ✅ AUTO UPDATE signatureCount when signatures change
petitionSchema.pre('save', function(next) {
  this.signatureCount = this.signatures.length;
  next();
});

module.exports = mongoose.models.Petition || mongoose.model("Petition", petitionSchema);
