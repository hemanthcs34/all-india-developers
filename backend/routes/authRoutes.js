const express = require('express');
const router = express.Router();
const { register, login, logout, getCurrentUser } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/current_user', getCurrentUser);

module.exports = router;