const User = require('../models/User');

// @desc    Get top users for leaderboard
// @route   GET /api/users/leaderboard
exports.getLeaderboard = async (req, res) => {
  try {
    const topUsers = await User.find().sort({ points: -1 }).limit(10);
    res.json(topUsers);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};