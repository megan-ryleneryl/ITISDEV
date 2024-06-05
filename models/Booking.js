const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  id: {
      type: Number,
      required: true
  },
  ride_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ride'
  },
  passenger_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
  },
  status: {
      type: String,
      required: true
  },
  payment_details: {
      type: String
  },
  payment_status: {
      type: String,
      enum: ['pending', 'paid', 'refunded'],
      default: 'pending'
  },
  booking_date: {
      type: Date,
      default: Date.now
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

const Booking = mongoose.model('bookings', BookingSchema);
module.exports = Booking;