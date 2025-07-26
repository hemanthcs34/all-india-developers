const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const { uploadPost, getPosts, voteOnPost, commentOnPost } = require('../controllers/mediaController');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({ cloudinary: cloudinary, params: { folder: 'ushe-nav' } });
const upload = multer({ storage: storage });

router.post('/upload', upload.single('image'), uploadPost);
router.get('/posts', getPosts);
router.post('/:id/vote', voteOnPost);
router.post('/:id/comment', commentOnPost);

module.exports = router;