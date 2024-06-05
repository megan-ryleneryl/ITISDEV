/* Import Models */
const User = require('../models/User');
const Reservation = require('../models/Reservation');

/* Define Functions */
async function postRide(req, res) {}

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