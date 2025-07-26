// app.js
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo');

const app = express();

const isProduction = process.env.NODE_ENV === 'production';

// --- Create uploads directory if it doesn't exist ---
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Middlewares
app.use(cors({
  origin: 'https://mindmaze-ushe-nav-city-pulse-agent.netlify.app', // Explicitly trust your frontend
  credentials: true // Allow cookies to be sent
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (isProduction) {
  app.set('trust proxy', 1); // trust first proxy
}

// --- Session and Passport Middleware ---
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  cookie: {
    secure: isProduction, // Only send cookies over HTTPS
    sameSite: isProduction ? 'none' : 'lax' // Allow cross-site cookie usage
  }
}));

require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

// API Routes
const mediaRoutes = require("./routes/mediaRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

app.use("/api/media", mediaRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// --- Serve Frontend Static Files ---
// This tells Express where to find your index.html, map.html, etc.
// It will now serve them automatically.
app.use(express.static(path.join(__dirname, '..')));

module.exports = app;
