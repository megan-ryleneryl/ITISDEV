const mongoose = require('mongoose');

const RideSchema = new mongoose.Schema({
  rideID: { type: Number, required: true }, // Starts at ID 30001 onwards
  driverID: { type: Number, ref: 'Driver' }, // Should match a userID (20001 onwards)
  origin: { type: String, required: true }, // Just a city in luzon
  destination: { type: String, required: true }, // Also a city in luzon
  datetime: { type: Date, required: true }, 
  numSeats: { type: Number, required: true }, // Number of seats available in the car
  price: { type: Number, required: true }, // Price in pesos, can range from 50 to 1000 pesos
  description: { type: String },
});

const Ride = mongoose.model('rides', RideSchema);
module.exports = Ride;