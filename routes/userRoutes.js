// megan
/* Import express & define router */
const express = require('express');
const router = express.Router();
module.exports = router; 

/* Import Controllers */
const userController = require('../controllers/userController.js');

router.get('/profile', userController.viewProfile);
router.put('/profile', userController.editProfile);
router.delete('/profile', userController.deleteProfile);
router.post('/withdraw', userController.withdrawBalance);
router.get('/:userID', userController.getProfilePage);