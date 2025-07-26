const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { uploadPost, getPosts, validatePost } = require('../controllers/mediaController');

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

router.post('/upload', upload.single('image'), uploadPost);
router.get('/posts', getPosts);
router.post('/:id/validate', validatePost);

module.exports = router;