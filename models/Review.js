const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  reviewerID: { type: Number, ref: 'User' }, // Changed both of these to Number from objectid
  recipientID: { type: Number, ref: 'User' },
  rating: { type: Number, min: 1, max: 5 },
  comment: { type: String },
  date: { type: Date, default: Date.now } // Renamed from created_at to date
});

const Review = mongoose.model('reviews', ReviewSchema);
module.exports = Review;