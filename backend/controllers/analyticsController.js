const Media = require('../models/Media');

// @desc    Get analytics summary
// @route   GET /api/analytics/summary
exports.getAnalyticsSummary = async (req, res) => {
  try {
    // 1. Total posts per category
    const postsPerCategory = await Media.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // 2. Most active time slots (by hour of the day in UTC)
    const activeTimeSlots = await Media.aggregate([
      {
        $group: {
          _id: { $hour: '$timestamp' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      postsPerCategory,
      activeTimeSlots
    });

  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};