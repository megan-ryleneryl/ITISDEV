const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  bookingID: { type: Number, required: true }, // Bookings are IDs from 40001 onwards
  rideID: { type: Number, ref: 'Ride' }, // Rides are IDs from 30001 onwards
  passengerID: { type: Number, ref: 'User' }, // Should match with a userID (20001 onwards)
  status: { type: String, enum: ['pending', 'completed', 'canceled'], default: 'pending' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'refunded'], default: 'pending' } 
});

const Booking = mongoose.model('bookings', BookingSchema);
module.exports = Booking;