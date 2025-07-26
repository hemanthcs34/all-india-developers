const Media = require('../models/media');
const User = require('../models/User');
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
    const { author, lat, lon, title, description, category } = req.body;

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
      author,
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

    // Award points to the user for creating a post
    await User.findOneAndUpdate({ username: author }, { $inc: { points: 10 }, $setOnInsert: { username: author } }, { upsert: true });


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

// @desc    Vote on a post (up or down)
// @route   POST /api/media/:id/vote
exports.voteOnPost = async (req, res) => {
  try {
    const { username, voteType } = req.body; // voteType can be 'up' or 'down'
    if (!username || !voteType) {
      return res.status(400).json({ message: 'Username and voteType are required.' });
    }

    const post = await Media.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    // Remove user from the opposite vote array if they're switching their vote
    if (voteType === 'up') {
      post.downvotes.pull(username);
    } else if (voteType === 'down') {
      post.upvotes.pull(username);
    }

    // Toggle the vote in the correct array
    const voteArray = voteType === 'up' ? post.upvotes : post.downvotes;
    if (voteArray.includes(username)) {
      voteArray.pull(username); // User is un-voting
      if (voteType === 'up') await User.findOneAndUpdate({ username: post.author }, { $inc: { points: -1 } });
    } else {
      voteArray.push(username); // User is casting a new vote
      if (voteType === 'up') await User.findOneAndUpdate({ username: post.author }, { $inc: { points: 1 } });
    }

    await post.save();

    require('../socket').getIO().emit('post-updated', post);
    res.json(post);
  } catch (error) {
    console.error("Error voting on post:", error);
    res.status(500).json({ message: 'Server error while voting on post.' });
  }
};

// @desc    Comment on a post
// @route   POST /api/media/:id/comment
exports.commentOnPost = async (req, res) => {
  try {
    const { username, text } = req.body;
    if (!username || !text) return res.status(400).json({ message: 'Username and text are required.' });

    const post = await Media.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found.' });

    const newComment = { username, text };
    post.comments.push(newComment);

    // Award points for commenting
    await User.findOneAndUpdate({ username: post.author }, { $inc: { points: 2 } });

    await post.save();

    const io = require('../socket').getIO();
    io.emit('post-updated', post);

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error while commenting.' });
  }
};

// @desc    Get all media posts
// @route   GET /api/media/posts
exports.getPosts = async (req, res) => {
  // Fetch all posts from the database, newest first.
  const posts = await Media.find({}).sort({ timestamp: -1 });
  res.json(posts);
};