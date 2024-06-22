// luke
/* Import express & define router */
const express = require('express');
const router = express.Router();
module.exports = router; // Export router so it can be used in app.js

/* Import Controllers */
const bookingController = require('../controllers/bookingController.js');

/* Define Routes */
router.post('/bookings', bookingController.bookRide);
router.put('/bookings/:id/cancel', bookingController.cancelBooking);
router.get('/bookings', bookingController.viewMyBookings);
router.post('/bookings/:id/confirm', bookingController.confirmPayment);