// megan
/* Import express & define router */
const express = require('express');
const router = express.Router();
module.exports = router; // Export router so it can be used in app.js

/* Import Controllers */
const chatController = require('../controllers/chatController.js');

/* Define Routes */
router.post('/chats/:rideId', chatController.sendMessage);
router.get('/chats', chatController.viewChats);