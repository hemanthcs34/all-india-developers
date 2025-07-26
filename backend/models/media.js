const mongoose = require('mongoose');

const MediaSchema = new mongoose.Schema({
  author: { type: String, required: true }, // Username of the post creator
  lat: { type: Number, required: true },
  lon: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true },
  imagePath: { type: String }, // Path to the stored image
  isValidated: { type: Boolean, default: false },
  aiTags: { type: [String], default: [] },
  upvotes: { type: [String], default: [] }, // Array of usernames who upvoted
  downvotes: { type: [String], default: [] }, // Array of usernames who downvoted
  comments: [{
    username: String,
    text: String,
    timestamp: { type: Date, default: Date.now }
  }],
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Media', MediaSchema);
