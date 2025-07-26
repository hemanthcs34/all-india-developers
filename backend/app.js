// app.js
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const app = express();

// --- Create uploads directory if it doesn't exist ---
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Middlewares
app.use(cors());
app.use(express.json());

// API Routes
const mediaRoutes = require("./routes/mediaRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

app.use("/api/media", mediaRoutes);
app.use("/api/analytics", analyticsRoutes);

// --- Serve Frontend Static Files ---
// This tells Express where to find your index.html, map.html, etc.
// It will now serve them automatically.
app.use(express.static(path.join(__dirname, '..')));

module.exports = app;
