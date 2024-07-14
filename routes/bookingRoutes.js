// luke
/* Import express & define router */
const express = require('express');
const router = express.Router();
module.exports = router; // Export router so it can be used in app.js

/* Import Controllers */
const bookingController = require('../controllers/bookingController.js');

/* Define Routes */
router.get('/:id', bookingController.getBookingForm);
router.post('/bookRide', bookingController.bookRide);
router.put('/:id/cancel', bookingController.cancelBooking);
router.get('/myBookings', bookingController.viewMyBookings);
router.post('/:id/confirm', bookingController.confirmPayment);