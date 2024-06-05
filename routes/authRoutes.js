/* Import express & define router */
const express = require('express');
const router = express.Router();
module.exports = router; // Export router so it can be used in app.js

/* Import Controllers */
const authController = require('../controllers/authController.js');

const multer = require('multer'); // This is only if there will be file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, 'public/profile-pictures/');
    },
    filename: function (req, file, cb){
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

router.post('/register', authController.register);
router.post('/logout', authController.logout);
router.get('/verify-email/:token', authController.verifyEmail);