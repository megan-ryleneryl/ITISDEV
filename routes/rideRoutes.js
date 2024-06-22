// luke
/* Import express & define router */
const express = require('express');
const router = express.Router();
module.exports = router; // Export router so it can be used in app.js

/* Import Controllers */
const rideController = require('../controllers/rideController.js');

/* Define Routes */
router.post('/rides', rideController.postRide);
router.put('/rides/:id', rideController.editRide);
router.delete('/rides/:id', rideController.deleteRide);
router.get('/rides', rideController.viewRides);
router.get('/rides/:id', rideController.viewRideDetails);