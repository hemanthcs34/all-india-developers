const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { uploadPost, getPosts, voteOnPost, commentOnPost } = require('../controllers/mediaController');

// Multer setup for image uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/upload', upload.single('image'), uploadPost);
router.get('/posts', getPosts);
router.post('/:id/vote', voteOnPost);
router.post('/:id/comment', commentOnPost);

module.exports = router;