const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path');

const app = express();
const PORT = 3000;

// Handlebars middleware
app.engine('hbs', engine({ extname: 'hbs' }));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Dummy data
const profileData = {
    profilePic: 'images/profile-pic.jpg',
    name: 'John Doe',
    role: 'Rider',
    firstName: 'John',
    lastName: 'Doe',
    description: 'I enjoy socializing with others. I would like to share a ride with trusted peers for convenience and safety.',
    verificationItems: [
        { item: 'Enrollment Confirmation email', verified: true },
        { item: 'EAF', verified: true },
        { item: 'Student ID', verified: true },
        { item: 'LTO certificate/Driver\'s License', verified: false }
    ]
};

// Routes
app.get('/profile', (req, res) => {
    res.render('profile', profileData);
});

app.get('/edit-profile', (req, res) => {
    res.render('edit-profile', profileData);
});

app.get('/account', (req, res) => {
    const user = {
        name: "John",
        age: 23,
        accountType: "Rider",
        balance: 100.00,
        joinDate: "June 2024",
        profilePic: "path/to/profile-pic.jpg"
    };

    res.render('account', user);
});

app.get('/delete-account', (req, res) => {
    // Logic to delete the account
    res.redirect('/login'); // Redirect to login or home page after account deletion
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
