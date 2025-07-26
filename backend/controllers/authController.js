const passport = require('passport');
const User = require('../models/User');

exports.register = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = new User({ username, password });
    await user.save();
    req.login(user, (err) => {
      if (err) return res.status(500).json({ message: 'Error logging in after registration' });
      res.status(201).json(user);
    });
  } catch (error) {
    res.status(400).json({ message: 'User already exists or invalid data' });
  }
};

exports.login = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: info.message });
    req.login(user, (err) => {
      if (err) return next(err);
      res.json(user);
    });
  })(req, res, next);
};

exports.logout = (req, res) => {
  req.logout(() => {
    res.json({ message: 'Logged out successfully' });
  });
};

exports.getCurrentUser = (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
};