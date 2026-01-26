const Poll = require("../models/Poll");

// Create Poll
exports.createPoll = async (req, res) => {
  try {
    const { question, options, category, expiresAt } = req.body;
    
    // Convert array of strings ["Yes", "No"] to object array [{text:"Yes"}, {text:"No"}]
    const formattedOptions = options.map(opt => ({ text: opt, votes: 0 }));

    const newPoll = new Poll({
      question,
      options: formattedOptions,
      category,
      expiresAt,
      createdBy: req.user.id
    });

    await newPoll.save();
    res.json({ status: "ok", message: "Poll created!" });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

// Get All Polls
exports.getAllPolls = async (req, res) => {
  try {
    const polls = await Poll.find().sort({ createdAt: -1 });
    
    // Add "hasVoted" flag for the current user
    const pollsWithUserStatus = polls.map(poll => {
      const pollObj = poll.toObject();
      pollObj.hasVoted = poll.voters.includes(req.user.id);
      return pollObj;
    });

    res.json({ status: "ok", data: pollsWithUserStatus });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

// Vote on Poll
exports.votePoll = async (req, res) => {
  try {
    const { pollId, optionIndex } = req.body;
    const poll = await Poll.findById(pollId);

    if (!poll) return res.status(404).json({ message: "Poll not found" });
    if (poll.voters.includes(req.user.id)) {
      return res.status(400).json({ message: "You already voted!" });
    }

    // Increment vote count for specific option
    poll.options[optionIndex].votes += 1;
    // Add user to voters list
    poll.voters.push(req.user.id);

    await poll.save();
    res.json({ status: "ok", message: "Vote cast successfully!", data: poll });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};
