const mongoose = require('mongoose');

const RideSchema = new mongoose.Schema({
  rideID: { type: Number, required: true },
  driverID: { type: Number, ref: 'Driver' }, // Changed this from object id and driver
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  datetime: { type: Date, required: true }, // Merged date and time since date objects contain both
  numSeats: { type: Number, required: true },
  price: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'completed', 'canceled'], default: 'pending' }, // Under what conditions will it be set to confirmed? + I'm thinking about whether the ride should contain status or booking (feel ko ride)
  description: { type: String },
});

const Ride = mongoose.model('rides', RideSchema);
module.exports = Ride;