const User = require("../models/User");
const Petition = require("../models/Petition");
const Poll = require("../models/Poll");
const Report = require("../models/Report");

exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("🎯 Fetching dashboard for user:", userId);

    // 1. Real User Data
    const user = await User.findById(userId).select("fullName location role impactPoints");
    if (!user) return res.status(404).json({ error: "User not found" });

    // 2. Real Stats
    const [myPetitions, pollsVoted, activeReports] = await Promise.all([
      Petition.countDocuments({ author: userId }),
      Poll.countDocuments({ voters: { $in: [userId] } }),
      Report.countDocuments({ author: userId, status: "Pending" })
    ]);

    // 3. Real Trending Petition
    const trendingPetition = await Petition.findOne({ status: "Active" })
      .sort({ signatureCount: -1 })
      .select("title signatureCount targetSignatures deadline urgent")
      .lean();

    let trending = {
      title: "No active petitions",
      signatures: 0,
      targetSignatures: 1000,
      timeLeft: "",
      urgent: false,
      percentage: 0
    };

    if (trendingPetition) {
      const percentage = Math.min(
        Math.round((trendingPetition.signatureCount / trendingPetition.targetSignatures) * 100),
        100
      );
      trending = {
        title: trendingPetition.title,
        signatures: trendingPetition.signatureCount,
        targetSignatures: trendingPetition.targetSignatures,
        timeLeft: "Active",
        urgent: trendingPetition.urgent || false,
        percentage
      };
    }

    // 4. Response with REAL DATA ONLY
    res.json({
      status: "ok",
      user: {
        name: user.fullName,
        location: user.location,
        role: user.role,
        avatar: user.fullName.charAt(0).toUpperCase()
      },
      stats: {
        myPetitions,
        pollsVoted,
        impactPoints: user.impactPoints || 0,
        activeReports
      },
      trending
    });

  } catch (error) {
    console.error("💥 Dashboard Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
