// luke
/* Import express & define router */
const express = require('express');
const router = express.Router();
module.exports = router; // Export router so it can be used in app.js

/* Import Controllers */
const contestController = require('../controllers/contestController.js');

/* Define Routes */
router.post('/contests', contestController.contestRide);
router.get('/contests', contestController.viewContests);