const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    enum: ["Infrastructure", "Sanitation", "Health", "Environment", "Other"],
    required: true 
  },
  location: { type: String, required: true },
  
  // Status tracking
  status: { 
    type: String, 
    enum: ["Pending", "In Progress", "Resolved", "Rejected"],
    default: "Pending" 
  },
  
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // People can back this report
  
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Report", ReportSchema);
