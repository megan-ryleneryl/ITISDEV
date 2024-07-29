/* Import Models */
const User = require('../models/User');

async function viewProfile(req, res) {}
async function editProfile(req, res) {}
async function deleteProfile(req, res) {}
async function withdrawBalance(req, res) {}

async function getProfilePage(req, res) {
    // try {
    //     const loggedUser = req.user; // The logged in user
    //     const queryID = req.params.userID; // The profile page being viewed
    //     const user = await User.findOne({ userID: queryID }); // The user data of the profile page being viewed

    //     const users = await User.find({ // All other users
    //         userID: { 
    //             $nin: [loggedUser.userID, queryID, '10000'] 
    //         } 
    //     });

    //     res.render('../views/profile.hbs', {
    //         layout: 'main.hbs', // Layout file to use
    //         title: 'View Profile', // Title of the page
    //         css: ['profile.css'], // Array of CSS files to include
    //         view: 'profile', // View file to use
    //         userData: users,
    //         profileUser: user,
    //         user: req.user, // User info
    //     });
    // } catch(error) {
    //     console.error(error);
    // }
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