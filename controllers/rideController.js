/* Import Models */
// controllers/rideController.js
const User = require('../models/User');
const Ride = require('../models/Ride');

async function postRide(req, res) {
  try {
    const { 
      originCity,
      originAddress,
      university,
      departureTime,
      returnTime,
      numSeats,
      price,
      description
    } = req.body;

    // Assuming you have middleware to authenticate the user and attach user info to req.user
    const driverID = req.user.userID;

    // Check if the driver has sufficient balance
    const driver = await User.findOne({ userID: driverID });
    if (!driver || driver.walletBalance <= 0) {
      return res.render('error', { message: "Insufficient balance to post a ride" });
    }

    // Validate input
    if (price < 50 || price > 1000) {
      return res.render('error', { message: "Price must be between 50 and 1000 pesos" });
    }

    if (new Date(departureTime) <= new Date()) {
      return res.render('error', { message: "Departure time must be in the future" });
    }

    if (new Date(returnTime) <= new Date(departureTime)) {
      return res.render('error', { message: "Return time must be after departure time" });
    }

    // Generate a new rideID
    const lastRide = await Ride.findOne().sort('-rideID');
    const newRideID = lastRide ? lastRide.rideID + 1 : 30001;

    const newRide = new Ride({
      rideID: newRideID,
      driverID,
      originCity,
      originAddress,
      university,
      departureTime,
      returnTime,
      numSeats,
      price,
      description
    });

    await newRide.save();

    // Render a success page or redirect to a ride list
    res.render('ride-posted', { 
      message: "Ride posted successfully", 
      ride: newRide 
    });
  } catch (error) {
    console.error('Error posting ride:', error);
    res.render('error', { message: "Error posting ride", error: error.message });
  }
}

async function editRide(req, res) {}

async function deleteRide(req, res) {}

async function viewRides(req, res) {}

async function viewRideDetails(req, res) {}

/* Allow functions to be used by other files */
module.exports = {
    postRide,
    editRide,
    deleteRide,
    viewRides,
    viewRideDetails
}