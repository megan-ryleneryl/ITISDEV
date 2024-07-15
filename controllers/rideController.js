// controllers/rideController.js
const Ride = require('../models/Ride');
const User = require('../models/User');
const Booking = require('../models/Booking');
const University = require('../models/University');
const City = require('../models/City');

//show driver home page
async function getDriverHome(req, res) {
  res.render('ride/driverhome', { 
    title: 'Post Ride',
    css: ['index.css'],
    user: req.user,
    messages: {
      error: req.flash('error'),
      success: req.flash('success')
    }
  });
}


// Get new ride form
async function getNewRideForm(req, res) {
  Promise.all([University.find(), City.find()])
        .then(([universities, cities]) => {
            const universityNames = universities.map(university => university.name);
            const cityNames = cities.map(city => city.name);

            // Display in cmd
            console.log('Universities:', universityNames);
            console.log('Cities:', cityNames);

        res.render('ride/new', { 
          title: 'Publish a New Ride',
          dropoffLocations: universityNames,
          pickupLocations: cityNames,
          css: ['index.css','ride.css'],
          user: req.user,
          messages: {
            error: req.flash('error'),
            success: req.flash('success')
          }
        });
  })
  .catch((err) => {
      console.error(err);
      res.status(500).send('Error retrieving data');
  });
}

// Post a new ride
// controllers/rideController.js

async function postRide(req, res) {
  try {
    const { 
      rideType,
      pickupPoint,
      dropoffPoint,
      route,
      pickupAreas,
      availableDays,
      departureTime,
      numSeats,
      price
    } = req.body;

    // if (!req.isAuthenticated()) {
    //   req.flash('error', 'You must be logged in to post a ride');
    //   return res.redirect('/login');
    // }

    // const driverID = req.user.userID;

    // Temporary driverID for testing
    const driverID = 20001;

    // Check if the driver has sufficient balance
    const driver = await User.findOne({ userID: driverID });
    if (!driver || driver.walletBalance <= 0) {
      req.flash('error', 'Insufficient balance to post a ride');
      return res.redirect('/ride/new');
    }

    // Generate a new rideID
    const lastRide = await Ride.findOne().sort('-rideID');
    const newRideID = lastRide ? lastRide.rideID + 1 : 30001;

    // Parse departure time
    const [hours, minutes] = departureTime.split(':').map(Number);

    if (isNaN(hours) || isNaN(minutes)) {
      req.flash('error', 'Invalid departure time format');
      return res.redirect('/ride/new');
    }

    // Fix Arrival Time 2 hrs after departure time
    const arrivalTime = new Date();
    arrivalTime.setHours(hours, minutes, 0);
    arrivalTime.setHours(arrivalTime.getHours() + 2);

    //Parse Arrival Time
    const [arrivalHours, arrivalMinutes] = arrivalTime.toTimeString().split(':').map(Number);
    if (isNaN(arrivalHours) || isNaN(arrivalMinutes)) {
      req.flash('error', 'Invalid arrival time format');
      return res.redirect('/ride/new');
    }

    const newRide = new Ride({
      rideID: newRideID,
      driverID,
      rideType,
      pickupPoint,
      dropoffPoint,
      route,
      pickupAreas: pickupAreas ? pickupAreas.split(',').map(area => area.trim()) : [],
      availableDays: Array.isArray(availableDays) ? availableDays : [availableDays],
      departureTime: {
        hour: hours,
        minute: minutes
      },
      arrivalTime: {
        hour: arrivalHours,
        minute: arrivalMinutes
      },
      numSeats: parseInt(numSeats),
      price: parseFloat(price),
      status: 'active'
    });

    await newRide.save();

    req.flash('success', 'Ride published successfully');
    res.redirect('/ride/' + newRide.rideID);
  } catch (error) {
    console.error('Error posting ride:', error);
    req.flash('error', 'Error posting ride: ' + error.message);
    res.redirect('/ride/new');
  }
}

// View all rides
async function viewRides(req, res) {
  try {
    //Get the Driver Names for the rides using the driverID and userID
    const rides = await Ride.find({ status: 'active' }).sort('-createdAt');
    for (const ride of rides) {
      const driver = await User.findOne({ userID: ride.driverID });
      if (driver) {
        ride.driverName = driver.name;
      }
    }

    
    res.render('ride/ridelist', { 
      title: 'All Rides',
      rides,
      css: ['ride.css'],
      user: req.user,
      messages: {
        error: req.flash('error'),
        success: req.flash('success')
      }
    });
  } catch (error) {
    console.error('Error viewing rides:', error);
    req.flash('error', 'Error loading rides');
    res.redirect('/');
  }
}

// View a specific ride
async function viewRideDetails(req, res) {
  try {
    const ride = await Ride.findOne({ rideID: req.params.id });
    if (!ride) {
      req.flash('error', 'Ride not found');
      return res.redirect('/ride');
    }
    
    // Get bookings for this ride
    const bookings = await Booking.find({ rideID: ride.rideID });


    res.render('ride/details', { 
      title: 'Ride Detail',
      ride,
      bookings,
      css: ['ride.css'],
      user: req.user,
      messages: {
        error: req.flash('error'),
        success: req.flash('success')
      }
    });
  } catch (error) {
    console.error('Error viewing ride details:', error);
    req.flash('error', 'Error loading ride details');
    res.redirect('/ride');
  }
}

// Get edit ride form
async function getEditRideForm(req, res) {
  try {
    const ride = await Ride.findOne({ rideID: req.params.id });
    if (!ride) {
      req.flash('error', 'Ride not found');
      return res.redirect('/ride');
    }
    if (ride.driverID !== req.user.userID) {
      req.flash('error', 'You are not authorized to edit this ride');
      return res.redirect('/ride');
    }
    res.render('ride/edit', { 
      title: 'Edit Ride',
      ride,
      user: req.user,
      messages: {
        error: req.flash('error'),
        success: req.flash('success')
      }
    });
  } catch (error) {
    console.error('Error getting edit ride form:', error);
    req.flash('error', 'Error loading edit form');
    res.redirect('/ride');
  }
}

// Edit a ride
async function editRide(req, res) {
  try {
    const { 
      rideType,
      pickupPoint,
      dropoffPoint,
      route,
      pickupAreas,
      availableDays,
      departureTime,
      arrivalTime,
      numSeats,
      price
    } = req.body;

    const ride = await Ride.findOne({ rideID: req.params.id });
    if (!ride) {
      req.flash('error', 'Ride not found');
      return res.redirect('/ride');
    }
    if (ride.driverID !== req.user.userID) {
      req.flash('error', 'You are not authorized to edit this ride');
      return res.redirect('/ride');
    }

    // Update ride details
    ride.rideType = rideType;
    ride.pickupPoint = pickupPoint;
    ride.dropoffPoint = dropoffPoint;
    ride.route = route;
    ride.pickupAreas = pickupAreas;
    ride.availableDays = availableDays;
    ride.departureTime = departureTime;
    ride.arrivalTime = arrivalTime;
    ride.numSeats = numSeats;
    ride.price = price;

    await ride.save();

    req.flash('success', 'Ride updated successfully');
    res.redirect('/ride/' + ride.rideID);
  } catch (error) {
    console.error('Error editing ride:', error);
    req.flash('error', 'Error updating ride: ' + error.message);
    res.redirect('/ride/' + req.params.id + '/edit');
  }
}

// Delete a ride
async function deleteRide(req, res) {
  try {
    const ride = await Ride.findOne({ rideID: req.params.id });
    if (!ride) {
      req.flash('error', 'Ride not found');
      return res.redirect('/ride');
    }
    if (ride.driverID !== req.user.userID) {
      req.flash('error', 'You are not authorized to delete this ride');
      return res.redirect('/ride');
    }

    // Instead of deleting, set status to inactive
    ride.status = 'inactive';
    await ride.save();

    // Cancel all pending bookings for this ride
    await Booking.updateMany(
      { rideID: ride.rideID, status: 'pending' },
      { $set: { status: 'cancelled' } }
    );

    req.flash('success', 'Ride deleted successfully');
    res.redirect('/ride');
  } catch (error) {
    console.error('Error deleting ride:', error);
    req.flash('error', 'Error deleting ride: ' + error.message);
    res.redirect('/ride');
  }
}

module.exports = {
  getDriverHome,
  getNewRideForm,
  postRide,
  viewRides,
  viewRideDetails,
  getEditRideForm,
  editRide,
  deleteRide
};