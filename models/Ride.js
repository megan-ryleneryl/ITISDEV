const mongoose = require('mongoose');

const RideSchema = new mongoose.Schema({
  rideID: { type: Number, required: true },
  driverID: { type: Number, ref: 'Driver' }, // Changed this from object id and driver
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  pickup_location: { type: String }, // What's the difference between origin and pickup_location?
  date: { type: Date, required: true }, // Do you think there's a way for us to merge date and time? if they select sa front end will it be saved as a datetime object
  time: { type: String, required: true },
  numSeats: { type: Number, required: true },
  price: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'completed', 'canceled'], default: 'pending' }, // Under what conditions will it be set to confirmed?
  description: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now } // I don't think it's possible for the users to update the ride! unless you mean system update
});

const Ride = mongoose.model('rides', RideSchema);
module.exports = Ride;