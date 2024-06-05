const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  reviewer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
  },
  reviewee_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
  },
  rating: {
      type: Number,
      min: 1,
      max: 5
  },
  comment: {
      type: String
  },
  created_at: {
      type: Date,
      default: Date.now
  }
});

const Review = mongoose.model('reviews', ReviewSchema);
module.exports = Review