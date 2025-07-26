const express = require('express');
const router = express.Router();
const passport = require('passport');
const { register, login, logout, getCurrentUser } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/current_user', getCurrentUser);

// --- Google OAuth Routes ---
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: 'https://mindmaze-ushe-nav-city-pulse-agent.netlify.app/login.html' }),
  (req, res) => {
    // Successful authentication, redirect to the map.
    res.redirect('https://mindmaze-ushe-nav-city-pulse-agent.netlify.app/map.html'); // This must be the full URL
  }
);

module.exports = router;