/* Import Models */
const User = require('../models/User');

async function viewProfile(req, res) {}
async function editProfile(req, res) {}
async function deleteProfile(req, res) {}
async function withdrawBalance(req, res) {}

async function getProfilePage(req, res) {
    try {
        const userID = req.params.userID || req.user.userID;
        const user = await User.findOne({ userID: userID });
    
        if (!user) {
          req.flash('error', 'User not found');
          return res.redirect('/');
        }
    
        res.render('/user/account', {
          title: 'Account Details',
          css: ['account-details.css'], // Create this CSS file for styling
          user: user,
          messages: {
            error: req.flash('error'),
            success: req.flash('success')
          }
        });
      } catch (error) {
        console.error('Error fetching account details:', error);
        req.flash('error', 'Error loading account details');
        res.redirect('/');
      }
}

async function getNewDriverForm(req, res) {
    res.render('user/newdriver.hbs', {
        layout: 'main.hbs', // Layout file to use
        title: 'Become a Driver', // Title of the page
        css: ['newdriver.css'], // Array of CSS files to include
        user: req.user, // User info
    });
}

async function createDriver(req, res) {
    try {
        const loggedUser = req.user; // The logged in user
        const { carMake, carModel, carPlate } = req.body;

        const driverLicensePath = req.file ? "/driver-licenses/" + req.file.filename : '';

        const updatedUser = await User.findOneAndUpdate(
            { userID: loggedUser.userID },
            {
                driverLicense: driverLicensePath,
                carMake: carMake,
                carModel: carModel,
                carPlate: carPlate,
            },
            { new: true }
        );

        if (updatedUser) {
            console.log('Updated user to driver successfully!');
            res.redirect('/');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating user data');
    }
}

module.exports = {
    viewProfile,
    editProfile,
    deleteProfile,
    withdrawBalance,
    getProfilePage,
    getNewDriverForm,
    createDriver
}