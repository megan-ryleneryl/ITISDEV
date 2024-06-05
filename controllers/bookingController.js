/* Import Models */
const User = require('../models/User');

/* Define Functions */
async function bookRide(req, res) {}

async function cancelBooking(req, res) {}

async function viewMyBookings(req, res) {}

async function confirmPayment(req, res) {}

module.exports = {
    bookRide,
    cancelBooking,
    viewMyBookings,
    confirmPayment
}