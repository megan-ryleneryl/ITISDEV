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


module.exports = {
    viewProfile,
    editProfile,
    deleteProfile,
    withdrawBalance,
    getProfilePage
}