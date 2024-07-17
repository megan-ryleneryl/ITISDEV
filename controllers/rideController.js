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
        ride.profilePicture = driver.profilePicture;
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

//View Rides based on Search
async function searchRides(req, res) {
  try {
    const { rideType, pickupPoint, dropoffPoint, date } = req.body;

    // Parse the dates (date is now expected to be an array of dates)
    const searchDates = date.split(',').map(d => new Date(d.trim()));

    // Create an array of day names corresponding to the search dates
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const searchDays = searchDates.map(searchDate => days[searchDate.getDay()]);

    // Find rides that match any of the search days
    const rides = await Ride.find({
      rideType,
      pickupPoint,
      dropoffPoint,
      availableDays: { $in: searchDays },
      'departureTime.hour': { 
        $gte: 0, 
        $lte: 23 
      },
      numSeats: { $gte: 1 },
      status: 'active'
    }).sort('-createdAt');

    // Populate driver information for each ride
    for (const ride of rides) {
      const driver = await User.findOne({ userID: ride.driverID });
      if (driver) {
        ride.driverName = driver.name;
        ride.profilePicture = driver.profilePicture;
      }
    }

    res.render('ride/ridelist', {
      title: 'Search Results',
      rides,
      css: ['ride.css'],
      user: req.user,
      messages: {
        error: req.flash('error'),
        success: req.flash('success')
      }
    });
  } catch (error) {
    console.error('Error searching rides:', error);
    req.flash('error', 'Error searching rides');
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

async function driverDashboard(req, res) {
  try {
      // Assuming the driver is authenticated and their ID is available in req.user.userID
      // For testing purposes, you can use a hardcoded driver ID
      const driverID = req.user ? req.user.userID : 20001; // Replace with actual driver ID when authentication is implemented

      // Fetch all rides for this driver
      const rides = await Ride.find({ driverID: driverID });

      // Fetch all bookings for these rides
      const bookings = await Booking.find({ 
          rideID: { $in: rides.map(ride => ride.rideID) }
      });

      // Fetch passenger details for each booking
      const bookingsWithPassengerDetails = await Promise.all(bookings.map(async (booking) => {
          const passenger = await User.findOne({ userID: booking.passengerID });
          return {
              ...booking.toObject(),
              passenger: passenger ? {
                  name: passenger.name,
                  profilePicture: passenger.profilePicture
              } : null
          };
      }));

      // Separate accepted and pending bookings
      const acceptedBookings = bookingsWithPassengerDetails.filter(booking => booking.responseStatus === 'accepted');
      const pendingBookings = bookingsWithPassengerDetails.filter(booking => booking.responseStatus === 'pending');

      res.render('ride/driverDashboard', {
          title: 'Driver Dashboard',
          acceptedBookings,
          pendingBookings,
          css: ['driverDashboard.css'],
          user: req.user,
          messages: {
              error: req.flash('error'),
              success: req.flash('success')
          }
      });
  } catch (error) {
      console.error('Error loading driver dashboard:', error);
      req.flash('error', 'Error loading dashboard');
      res.redirect('/');
  }
}

async function acceptBooking(req, res) {
  try {
      const bookingId = parseInt(req.params.id);
      const booking = await Booking.findOne({ bookingID: bookingId });

      if (!booking) {
          return res.status(404).json({ success: false, message: 'Booking not found' });
      }

      booking.responseStatus = 'accepted';
      await booking.save();

      res.json({ success: true, message: 'Booking accepted successfully' });
  } catch (error) {
      console.error('Error accepting booking:', error);
      res.status(500).json({ success: false, message: 'Error accepting booking' });
  }
}

async function rejectBooking(req, res) {
  try {
      const bookingId = parseInt(req.params.id);
      const booking = await Booking.findOne({ bookingID: bookingId });

      if (!booking) {
          return res.status(404).json({ success: false, message: 'Booking not found' });
      }

      booking.responseStatus = 'rejected';
      await booking.save();

      res.json({ success: true, message: 'Booking rejected successfully' });
  } catch (error) {
      console.error('Error rejecting booking:', error);
      res.status(500).json({ success: false, message: 'Error rejecting booking' });
  }
}

async function autoRejectDueBookings() {
  const currentDate = new Date();
  const dueBookings = await Booking.find({
      responseStatus: 'pending',
      bookingDates: { $lt: currentDate }
  });

  for (const booking of dueBookings) {
      booking.responseStatus = 'rejected';
      await booking.save();
  }

  console.log(`Auto-rejected ${dueBookings.length} due bookings`);
}

async function cancelBooking(req, res) {
  try {
      const bookingId = parseInt(req.params.id);
      const booking = await Booking.findOne({ bookingID: bookingId });

      if (!booking) {
          return res.status(404).json({ success: false, message: 'Booking not found' });
      }

      // Fetch the associated ride to get the departure time
      const ride = await Ride.findOne({ rideID: booking.rideID });
      if (!ride) {
          return res.status(404).json({ success: false, message: 'Associated ride not found' });
      }

      // Calculate the time difference
      const now = new Date();
      
      // Find the next occurrence of the ride based on booking dates
      const nextRideDate = booking.bookingDates.find(date => date > now);
      
      if (!nextRideDate) {
          return res.status(400).json({ success: false, message: 'No future rides found for this booking' });
      }

      // Set the departure time on the next ride date
      const departureTime = new Date(nextRideDate);
      departureTime.setHours(ride.departureTime.hour, ride.departureTime.minute, 0, 0);

      const timeDifference = (departureTime - now) / (1000 * 60 * 60); // difference in hours

      let message = 'Booking cancelled successfully';
      let warning = '';

      if (timeDifference <= 3) {
          warning = 'Warning: Cancelling within 3 hours of departure. Penalties may be applied in the future.';
      }

      booking.rideStatus = 'cancelled';
      await booking.save();

      res.json({ success: true, message, warning });
  } catch (error) {
      console.error('Error cancelling booking:', error);
      res.status(500).json({ success: false, message: 'Error cancelling booking' });
  }
}

async function autoCompleteRides() {

}

module.exports = {
  getDriverHome,
  getNewRideForm,
  postRide,
  viewRides,
  searchRides,
  viewRideDetails,
  getEditRideForm,
  editRide,
  deleteRide,
  driverDashboard,
  acceptBooking,
  rejectBooking,
  autoRejectDueBookings,
  cancelBooking,
  autoCompleteRides
};