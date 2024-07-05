// luke
/* Import express & define router */
const express = require('express');
const router = express.Router();
module.exports = router; // Export router so it can be used in app.js

/* Import Controllers */
const rideController = require('../controllers/rideController.js');


// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error', 'You must be logged in to access this page');
  res.redirect('/login');
};

// Route to display the form for posting a new ride
router.get('/new', isAuthenticated, (req, res) => {
  res.render('ride/new', { 
    title: 'Post a New Ride',
    css: ['ride.css'],
    user: req.user,
    messages: {
      error: req.flash('error'),
      success: req.flash('success')
    }
  });
});

// Route to handle posting a new ride
router.post('/', isAuthenticated, rideController.postRide);

// Route to view all rides
router.get('/', rideController.viewRides);

// Route to view details of a specific ride
router.get('/:id', rideController.viewRideDetails);

// Route to display the form for editing a ride
router.get('/:id/edit', isAuthenticated, rideController.getEditRideForm);

// Route to handle editing a ride
router.put('/:id', isAuthenticated, rideController.editRide);

// Route to handle deleting a ride
router.delete('/:id', isAuthenticated, rideController.deleteRide);

module.exports = router;