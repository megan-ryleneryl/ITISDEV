const mongoose = require('mongoose');

const DriverSchema = new mongoose.Schema({
  userID: { type: Number, ref: 'User' }, // Changed to number from objectid
  driverID: { type: Number, required: true }, // Do you think this is applicable to add? I'm thinking about how we'll call the driver object in Ride
  driverLicense: { type: String, required: true },
  carDetails: { type: String, required: true }, // What's the difference between vehicle details and make/model?
  carMake: { type: String },
  carModel: { type: String },
  carPlate: { type: String }
});

const Driver = mongoose.model('drivers', DriverSchema);
module.exports = Driver;