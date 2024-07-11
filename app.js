/* Dependencies */
const express = require('express'); // Import Express, allows you to create a server and routes
const exphbs = require('express-handlebars'); // Import Express-Handlebars, allows you to create views
const mongoose = require('mongoose'); // Import Mongoose, allows you to connect to MongoDB
const bodyParser = require('body-parser');

// Imported for sessions
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');

const initializePassport = require('./passport-config.js');
initializePassport(passport);

/* Imported Routes */
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const rideRoutes = require('./routes/rideRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const contestRoutes = require('./routes/contestRoutes');
const chatRoutes = require('./routes/chatRoutes');

/* Initialize Express App */
const app = express();

/* Middleware */
app.use(express.static(__dirname + "/public")); // Set static folder
app.use(express.urlencoded({ extended: true })); // Allows you to access req.body for POST routes
app.use(bodyParser.urlencoded({ extended: false }));

// Use Handlebars as the view engine
const hbs = exphbs.create({
    extname: 'hbs',
    helpers: {
        // JSON
        json: function (context) {
            return JSON.stringify(context);
        },
        eq: function (a, b) {
            return a === b;
        },
        join: function (arr, separator) {
        return arr.join(separator);
        },
        formatTime: function (hour, minute) {
        return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        },
        formatDate: function (date) {
        return new Date(date).toLocaleDateString();
        }
    },
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    }
    
});

app.use(express.json());
app.engine("hbs", hbs.engine); // Inform the handlebars engine that file extension to read is .hbs
app.set("view engine", "hbs"); // Set express' default file extension for views as .hbs
app.set("views", "./views"); // Set the directory for the views

// Use sessions
app.use(flash());
app.use(session({
    secret: 'CKA8mqzpyGEuQRCZHJHhK39qCbtxYwu8',
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(methodOverride('_method')); // To allow the POST logout form to become a DELETE request


// For about page -> Idk if we still need this, but this is where i listed my specs
// app.get('/about', (req, res) => {
//     res.render('../views/about.hbs', {
//         layout: 'main.hbs', // Layout file to use
//         title: 'About', // Title of the page
//         css: ['about.css'], // Array of CSS files to include
//         user: req.user, // User
//     })
// });

// App Routes
app.use('/auth', authRoutes); // Use the authRoutes module for all routes starting with /auth
app.use('/user', userRoutes); // Use the userRoutes module for all routes starting with /user
app.use('/ride', rideRoutes); // Use the rideRoutes module for all routes starting with /ride
app.use('/booking', bookingRoutes); // Use the bookingRoutes module for all routes starting with /booking
app.use('/review', reviewRoutes); // Use the reviewRoutes module for all routes starting with /review
app.use('/contest', contestRoutes); // Use the contestRoutes module for all routes starting with /contest
app.use('/chat', chatRoutes); // Use the chatRoutes module for all routes starting with /chat

// Login Routes -> This bugged when I tried implementing it in a separate route
app.get('/', (req, res) => {
    res.render('index', {
        title: "Uniride",
        css: ["index.css"], 
        layout: "main",
        messages: req.flash('error')
    });
});

// app.post('/login', 
//     passport.authenticate('local', {
//         failureRedirect: '/login',
//         failureFlash: true
//     }),
//     function(req, res) {
//         // This function is for checking if remember me was clicked
//         if (req.body.rememberMe) {
//             req.session.cookie.maxAge = 3 * 7 * 24 * 60 * 60 * 1000; // Cookie expires after 3 weeks
//         } else {
//             req.session.cookie.expires = false; // Cookie expires at end of session
//         }
//       res.redirect('/index'); 
//     }
// );

// app.delete('/logout', (req, res) => {
//     req.logout((err) => {
//         if (err) {
//             return next(err);
//         }
//         res.redirect('/');
//     });
// })

/* Connect to MongoDB and then Listen for Requests */
/**
 * admin is the username
 * 12345 is the password
 * itisdev-mvp is the database name
 */
const dbURI = 'mongodb+srv://admin:12345@itisdev-mvp.jary1la.mongodb.net/itisdev-mvp'; 
mongoose.connect(dbURI)
    .then((result) => {
        console.log("App connected to MongoDB Atlas itisdev-mvp database.");
        /* If the DB connection was successful, listen for requests on localhost:3000 */
        app.listen(3000, () => {
            console.log("App started. Listening on port 3000.");
        });
    })
    .catch((err) => {
        console.log(err);
    });