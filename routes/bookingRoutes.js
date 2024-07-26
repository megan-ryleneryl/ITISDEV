// luke
/* Import express & define router */
const express = require('express');
const router = express.Router();
module.exports = router; // Export router so it can be used in app.js

/* Import Controllers */
const bookingController = require('../controllers/bookingController.js');

/* Define Routes */
router.get('/dashboard', bookingController.driverDashboard);
router.post('/:id/accept', bookingController.acceptBooking);
router.post('/:id/reject', bookingController.rejectBooking);
router.post('/:id/cancel', bookingController.cancelBooking);
router.post('/:id/complete', bookingController.completeBooking);
router.post('/:id/start', bookingController.startBooking);
router.get('/bookingDetails/:id', bookingController.viewBookingDetails);

router.get('/myBookings', bookingController.viewMyBookings);
router.get('/:id', bookingController.getBookingForm);
router.post('/bookRide', bookingController.bookRide);
router.put('/:id/cancel', bookingController.cancelBooking);
router.post('/:id/confirm', bookingController.confirmPayment);