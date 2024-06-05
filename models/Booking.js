const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  bookingID: { type: Number, required: true },
  rideID: { type: Number, ref: 'Ride' },
  passengerID: { type: Number, ref: 'User' }, // Changed objectid to number
  status: { type: String, required: true }, // Will we enum this? Or boolean
  paymentDetails: { type: String }, // What are the possible values for payment details? 
  paymentStatus: { type: String, enum: ['pending', 'paid', 'refunded'], default: 'pending' },
  bookingDate: { type: Date, default: Date.now }, // Isn't the booking date the same as the date from the ride object?
  createdAt: { type: Date, default: Date.now }, 
  updatedAt: { type: Date, default: Date.now } 
});

const Booking = mongoose.model('bookings', BookingSchema);
module.exports = Booking;