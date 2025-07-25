// controllers/analyticsController.js
exports.getAnalytics = (req, res) => {
  res.json({
    totalCameras: 2,
    motionEventsToday: 5,
    alertLevel: "Moderate"
  });
};
