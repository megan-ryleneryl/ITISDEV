// megan
/* Import express & define router */
const express = require('express');
const router = express.Router();
module.exports = router; // Export router so it can be used in app.js

/* Import Multer & Path */
const multer = require('multer'); // This is only if there will be file uploads
const path = require('path');

/* Import Controllers */
const authController = require('../controllers/authController.js');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '../public/profile-pictures');
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

/* Define Routes */
router.get('/register', (req, res) => {
    res.render('user/register', {
        title: "Register",
        css: ["register.css"],
        layout: "bodyOnly",
    });
});


router.post('/new', upload.single("profilePicture"), (req, res) => {
    authController.uploadUser(req, res);
    console.log('Request file:', req.file); // Debugging: Check the request file
});

// Logout Route
router.get('/logout', (req, res) => {
    req.logout(function(err) {
        if (err) { s
            console.log(err); 
            return res.status(500).send('Error logging out'); 
        }
        req.session.destroy((err) => {
            if (err) {
                console.log(err);
                return res.status(500).send('Error clearing session');
            }
            res.redirect('/'); // Redirect to login after logout
        });
    });
});

router.get('/verify-email/:token', authController.verifyEmail);