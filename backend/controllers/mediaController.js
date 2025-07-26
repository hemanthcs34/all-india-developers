const Media = require('../models/Media');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Helper function to calculate distance between two coordinates in kilometers
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// @desc    Upload a new media post
// @route   POST /api/media/upload
exports.uploadPost = async (req, res) => {
  try {
    const { lat, lon, title, description, category } = req.body;

    // --- AI Image Validation Logic ---
    if (req.file) {
      const validationRules = {
        '⚡': ['electric', 'power', 'wire', 'pole', 'storm'],
        '🚧': ['road', 'car', 'construction', 'traffic', 'street', 'pavement'],
        '🎭': ['people', 'event', 'crowd', 'stage', 'music', 'art'],
        '☔': ['water', 'rain', 'flood', 'street', 'wet', 'umbrella'],
      };

      const imagePath = path.join(__dirname, '..', 'uploads', req.file.filename);
      const imageBytes = fs.readFileSync(imagePath, { encoding: 'base64' });

      const clarifaiResponse = await axios.post(
        "https://api.clarifai.com/v2/models/general-image-recognition/versions/aa7f35c01e0642fda5cf400f543e7c40/outputs",
        {
          "inputs": [{ "data": { "image": { "base64": imageBytes } } }]
        },
        {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Key ${process.env.CLARIFAI_API_KEY}`
          }
        }
      );

      const concepts = clarifaiResponse.data.outputs[0].data.concepts.map(c => c.name);
      const relevantTags = validationRules[category] || [];
      const isRelevant = concepts.some(concept => relevantTags.includes(concept));

      if (!isRelevant) {
        // If not relevant, delete the uploaded file and reject the post.
        fs.unlinkSync(imagePath);
        return res.status(400).json({
          message: `Image does not seem relevant to the category '${category}'. AI detected: ${concepts.slice(0, 5).join(', ')}.`
        });
      }

      // If relevant, we'll save the tags.
      var aiTags = concepts.slice(0, 10); // Save top 10 tags
    }
    // --- End of AI Validation ---

    const newPost = new Media({
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      title,
      description,
      category,
      imagePath: req.file ? `/uploads/${req.file.filename}` : null,
      // If an image was processed, mark as validated and store tags
      isValidated: !!req.file,
      aiTags: aiTags || []
    });

    await newPost.save();

    const io = require('../socket').getIO();

    // --- User Validation Logic ---
    // For certain categories, ask nearby users to validate.
    if (['⚡', '🚧', '☔'].includes(category)) {
      const userLocations = require('../socket').getLocations();
      const validationRadius = 1; // 1 km

      Object.keys(userLocations).forEach(socketId => {
        const userLocation = userLocations[socketId];
        const distance = getDistance(newPost.lat, newPost.lon, userLocation.lat, userLocation.lon);

        if (distance <= validationRadius) {
          io.to(socketId).emit('request-validation', newPost);
        }
      });
    }

    // This is the magic: broadcast the new post to ALL connected clients.
    // Get the io instance ONLY when it's needed, ensuring it's initialized.
    require('../socket').getIO().emit('new-post', newPost);

    // Send the new post back to the client that submitted it.
    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error creating post:", error);
    // Check for Mongoose validation error to provide a more specific message
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message).join(', ');
      return res.status(400).json({ message: `Validation failed: ${messages}` });
    }
    res.status(500).json({ message: 'An unexpected server error occurred.' });
  }
};

// @desc    Get all media posts
// @route   GET /api/media/posts
exports.getPosts = async (req, res) => {
  // Fetch all posts from the database, newest first.
  const posts = await Media.find({}).sort({ timestamp: -1 });
  res.json(posts);
};

// @desc    Validate a media post
// @route   POST /api/media/:id/validate
exports.validatePost = async (req, res) => {
  try {
    const post = await Media.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.userValidations = (post.userValidations || 0) + 1;
    await post.save();

    // Broadcast the updated validation count to all clients
    require('../socket').getIO().emit('post-validated', { postId: post._id, userValidations: post.userValidations });

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'An unexpected server error occurred.' });
  }
};