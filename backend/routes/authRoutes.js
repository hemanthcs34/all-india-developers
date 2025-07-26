const express = require('express');
const router = express.Router();
const passport = require('passport');
const { register, login, logout, getCurrentUser } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/current_user', getCurrentUser);

// Conditionally add Google OAuth Routes only if keys are present
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

  router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: 'https://mindmaze-ushe-nav-city-pulse-agent.netlify.app/login.html' }),
    (req, res) => {
      // Successful authentication, redirect to the map.
      res.redirect('https://mindmaze-ushe-nav-city-pulse-agent.netlify.app/map.html');
    }
  );
}

module.exports = router;