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
  origin: 'https://mindmaze-ushe-nav-city-pulse-agent.netlify.app', // Explicitly trust your Netlify frontend
  credentials: true // Allow cookies to be sent
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (isProduction) {
  app.set('trust proxy', 1); // Trust the first proxy (important for Render)
}

// --- Session and Passport Middleware ---
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  cookie: {
    secure: isProduction, // Only send cookies over HTTPS in production
    sameSite: isProduction ? 'none' : 'lax', // Required for cross-domain cookies
    httpOnly: true
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

module.exports = app;