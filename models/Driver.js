const mongoose = require('mongoose');

const DriverSchema = new mongoose.Schema({
  user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
  },
  driver_license: {
      type: String,
      required: true
  },
  vehicle_details: {
      type: String,
      required: true
  },
  vehicle_make: {
      type: String
  },
  vehicle_model: {
      type: String
  },
  vehicle_plate_number: {
      type: String
  }
});

const Driver = mongoose.model('drivers', DriverSchema);
module.exports = Driver;