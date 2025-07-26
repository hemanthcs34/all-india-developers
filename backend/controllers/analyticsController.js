const Media = require('../models/media'); // Corrected: was likely '../models/Media'

// @desc    Get analytics summary for charts
// @route   GET /api/analytics/summary
exports.getAnalyticsSummary = async (req, res) => {
    try {
        // Data for posts per category pie chart
        const postsPerCategory = await Media.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        // Data for posts per hour bar chart
        const activeTimeSlots = await Media.aggregate([
            {
                $group: {
                    // Group by the hour of the timestamp (in UTC)
                    _id: { $hour: '$timestamp' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } } // Sort by hour
        ]);

        res.json({ postsPerCategory, activeTimeSlots });
    } catch (error) {
        console.error('Analytics Controller Error:', error);
        res.status(500).json({ message: 'Server error while fetching analytics data.' });
    }
};