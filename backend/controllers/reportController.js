const Report = require("../models/Report");

// Create Report
exports.createReport = async (req, res) => {
  try {
    const { title, description, category, location } = req.body;
    
    const newReport = new Report({
      title, description, category, location,
      author: req.user.id
    });

    await newReport.save();
    res.json({ status: "ok", message: "Report submitted successfully!" });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

// Get All Reports
exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("author", "fullName")
      .sort({ createdAt: -1 });
    res.json({ status: "ok", data: reports });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

// Upvote Report (Backing the issue)
exports.upvoteReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: "Report not found" });

    if (report.upvotes.includes(req.user.id)) {
      return res.status(400).json({ message: "Already upvoted" });
    }

    report.upvotes.push(req.user.id);
    await report.save();
    
    res.json({ status: "ok", message: "Upvoted!" });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};
