const mongoose = require('mongoose');

const MediaSchema = new mongoose.Schema({
  lat: { type: Number, required: true },
  lon: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true },
  imagePath: { type: String }, // Path to the stored image
  isValidated: { type: Boolean, default: false },
  aiTags: { type: [String], default: [] },
  userValidations: { type: Number, default: 0 },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Media', MediaSchema);
