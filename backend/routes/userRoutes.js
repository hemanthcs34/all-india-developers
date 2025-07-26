const express = require('express');
const router = express.Router();
const { getLeaderboard, getMyPosts } = require('../controllers/userController');

router.get('/leaderboard', getLeaderboard);
router.get('/me/posts', getMyPosts);

module.exports = router;