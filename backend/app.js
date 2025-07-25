// app.js
const express = require("express");
const cors = require("cors");
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
const mediaRoutes = require("./routes/mediaRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

app.use("/api/media", mediaRoutes);
app.use("/api/analytics", analyticsRoutes);

// Root route (optional - fixes "Cannot GET /")
app.get("/", (req, res) => {
  res.send("🚀 CityPulse Agent Backend is Running!");
});

module.exports = app;
