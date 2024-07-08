// luke
// routes/rideRoutes.js
const express = require('express');
const router = express.Router();
const rideController = require('../controllers/rideController');

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error', 'You must be logged in to access this page');
  res.redirect('/login');
};

router.get('/new', isAuthenticated, rideController.getNewRideForm);
router.post('/', isAuthenticated, rideController.postRide);
router.get('/', rideController.viewRides);
router.get('/:id', rideController.viewRideDetails);
router.get('/:id/edit', isAuthenticated, rideController.getEditRideForm);
router.put('/:id', isAuthenticated, rideController.editRide);
router.delete('/:id', isAuthenticated, rideController.deleteRide);

module.exports = router;