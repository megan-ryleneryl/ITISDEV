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


module.exports = {
    viewProfile,
    editProfile,
    deleteProfile,
    withdrawBalance,
    getProfilePage
}