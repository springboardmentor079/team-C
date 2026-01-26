const Petition = require("../models/Petition");

// Create
exports.createPetition = async (req, res) => {
  try {
    const { title, description, category, targetSignatures, deadline, location } = req.body;
    const newPetition = new Petition({
      title, description, category, targetSignatures, deadline, location,
      author: req.user.id 
    });
    await newPetition.save();
    res.json({ status: "ok", message: "Created!" });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

// Get All
exports.getAllPetitions = async (req, res) => {
  try {
    const petitions = await Petition.find().sort({ createdAt: -1 });
    res.json({ status: "ok", data: petitions });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

// Sign
exports.signPetition = async (req, res) => {
  try {
    const petition = await Petition.findById(req.params.id);
    if (!petition) return res.status(404).json({ message: "Not found" });

    // Check if already signed
    if (petition.signatures.some(s => s.user.toString() === req.user.id)) {
      return res.status(400).json({ message: "Already signed" });
    }

    petition.signatures.push({ user: req.user.id });
    petition.signatureCount = petition.signatures.length;
    await petition.save();
    
    res.json({ status: "ok", message: "Signed!" });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};
