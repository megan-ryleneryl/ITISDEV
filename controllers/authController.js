/* Import Models */
const User = require('../models/User.js');
const bcrypt = require('bcrypt');

async function register(req, res) {}

// async function login(req, res) {
//     if(req.user){
//         res.redirect('/')
//     }
//     res.render('user/login', {
//         title: "Login",
//         css: ["login.css"],
//         layout: "bodyOnly",
//         messages: req.flash('error')
//     });

// }
async function logout(req, res) {}
async function verifyEmail(req, res) {}

module.exports = {
    register,
    logout,
    verifyEmail
}
