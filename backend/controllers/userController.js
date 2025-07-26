const User = require('../models/User');
const Media = require('../models/media');

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

// @desc    Get all posts for the currently logged-in user
// @route   GET /api/users/me/posts
exports.getMyPosts = async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    const posts = await Media.find({ author: req.user.username }).sort({ timestamp: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};