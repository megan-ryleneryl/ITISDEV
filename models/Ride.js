const mongoose = require('mongoose');

const RideSchema = new mongoose.Schema({
  id: {
      type: Number,
      required: true
  },
  driver_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Driver'
  },
  start_location: {
      type: String,
      required: true
  },
  end_location: {
      type: String,
      required: true
  },
  pickup_location: {
      type: String
  },
  date: {
      type: Date,
      required: true
  },
  time: {
      type: String,
      required: true
  },
  available_seats: {
      type: Number,
      required: true
  },
  price: {
      type: Number,
      required: true
  },
  ride_status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'canceled'],
      default: 'pending'
  },
  ride_description: {
      type: String
  },
  created_at: {
      type: Date,
      default: Date.now
  },
  updated_at: {
      type: Date,
      default: Date.now
  }
});

const Ride = mongoose.model('rides', RideSchema);
module.exports = Ride;