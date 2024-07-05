// const mongoose = require('mongoose');

// const RideSchema = new mongoose.Schema({
//   rideID: { type: Number, required: true }, // Starts at ID 30001 onwards
//   driverID: { type: Number, ref: 'Driver' }, // Should match a userID (20001 onwards)
//   origin: { type: String, required: true }, // Just a city in luzon
//   destination: { type: String, required: true }, // Also a city in luzon
//   datetime: { type: Date, required: true }, 
//   numSeats: { type: Number, required: true }, // Number of seats available in the car
//   price: { type: Number, required: true }, // Price in pesos, can range from 50 to 1000 pesos
//   description: { type: String },
// });

// const Ride = mongoose.model('rides', RideSchema);
// module.exports = Ride;

// models/Ride.js
const mongoose = require('mongoose');

const TimeSlotSchema = new mongoose.Schema({
  hour: { type: Number, required: true, min: 0, max: 23 },
  minute: { type: Number, required: true, min: 0, max: 59 }
});

const DayScheduleSchema = new mongoose.Schema({
  active: { type: Boolean, default: false },
  departureTime: TimeSlotSchema,
  returnTime: TimeSlotSchema
});

const RideSchema = new mongoose.Schema({
  rideID: { 
    type: Number, 
    required: true,
    unique: true
  },
  driverID: { 
    type: Number, 
    ref: 'User',
    required: true
  },
  originCity: { 
    type: String, 
    required: true 
  },
  originAddress: { 
    type: String, 
    required: true 
  },
  university: { 
    type: String, 
    required: true 
  },
  schedule: {
    monday: DayScheduleSchema,
    tuesday: DayScheduleSchema,
    wednesday: DayScheduleSchema,
    thursday: DayScheduleSchema,
    friday: DayScheduleSchema,
    saturday: DayScheduleSchema,
    sunday: DayScheduleSchema
  },
  numSeats: { 
    type: Number, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true,
    min: 50,
    max: 1000
  },
  description: { 
    type: String 
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, { timestamps: true });

const Ride = mongoose.model('rides', RideSchema);
module.exports = Ride;