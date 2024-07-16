/* Dependencies */
const express = require('express'); // Import Express, allows you to create a server and routes
const exphbs = require('express-handlebars'); // Import Express-Handlebars, allows you to create views
const mongoose = require('mongoose'); // Import Mongoose, allows you to connect to MongoDB
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt'); // For hashing passwords
const User = require('./models/User'); // Import the User model

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

// Import all models
require('./models/User');
require('./models/Ride');
require('./models/Booking');
require('./models/University');
require('./models/City');


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
        formatTime1: function(timeObj) {
            return `${timeObj.hour.toString().padStart(2, '0')}:${timeObj.minute.toString().padStart(2, '0')}`;
        },
        formatDate: function (date) {
        return new Date(date).toLocaleDateString();
        },
        formatDates: function(dates) {
            return dates.map(date => new Date(date).toLocaleDateString()).join(', ');
        },
        formatMonth(date) {
        return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long' }).format(date);
        }, 
        isEndOfWeek(index) {
            return (index + 1) % 7 === 0;
        },
        formatDuration(startTime, endTime) {
            const start = new Date(startTime);
            const end = new Date(endTime);
            const durationMs = end - start;
            const hours = Math.floor(durationMs / (1000 * 60 * 60));
            const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
            
            if (hours > 0) {
              return `${hours} hr ${minutes} min`;
            } else {
              return `${minutes} min`;
            }
        },
        array: function() {
            return Array.prototype.slice.call(arguments, 0, -1);
        },
        includes: function(item, list) {
            return list.includes(item);
        },
        isActive: function(status) {
            return status === 'pending' || status === 'accepted';
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

const University = require('./models/University');
const City = require('./models/City');

app.get('/', (req, res) => {
    // Get universities and cities from db concurrently
    Promise.all([University.find(), City.find()])
        .then(([universities, cities]) => {
            const universityNames = universities.map(university => university.name);
            const cityNames = cities.map(city => city.name);

            // Display in cmd
            console.log('Universities:', universityNames);
            console.log('Cities:', cityNames);

            res.render('index', {
                title: "Uniride",
                dropoffLocations: universityNames,
                pickupLocations: cityNames,
                css: ["index.css"], 
                layout: "main",
                messages: req.flash('error')
            });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error retrieving data');
        });
});


app.post('/login', 
    passport.authenticate('local', {
        failureRedirect: '/login-failed',
        failureFlash: true
    }),
    function(req, res) {
        // This function is for checking if remember me was clicked
        if (req.body.rememberMe) {
            req.session.cookie.maxAge = 3 * 7 * 24 * 60 * 60 * 1000; // Cookie expires after 3 weeks
        } else {
            req.session.cookie.expires = false; // Cookie expires at end of session
        }
      res.redirect('/index'); 
    }
);


app.get('/login', (req, res) => {
    if(req.user){
        res.redirect('/')
    }
    res.render('user/login', {
        title: "Login",
        css: ["login.css"],
        layout: "bodyOnly",
        messages: req.flash('error')
    });
});

app.get('/login-failed', (req, res) => {
    res.render('user/login', {
        title: "Login",
        css: ["login.css"],
        layout: "bodyOnly",
        isFailed: true,
        messages: req.flash('error')
    });
});

// app.delete('/logout', (req, res) => {
//     req.logout((err) => {
//         if (err) {
//             return next(err);
//         }
//         res.redirect('/');
//     });
// })

//console.log(app._router.stack);


// Route to display registration form
app.get('/register', (req, res) => {
    res.render('user/register', {
        title: "Register",
        css: ["register.css"],
        layout: "bodyOnly",
    });
});

// Route to handle registration form submission
app.post('/register', async (req, res) => {
    try {
        const { name, email, password, phoneNumber, universityID, profilePicture, driverLicense, carMake, carModel, carPlate } = req.body;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user object
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            phoneNumber,
            universityID,
            profilePicture,
            driverLicense,
            carMake,
            carModel,
            carPlate,
            balance: 0,
            isVerified: false,
        });

        // Save the user to the database
        await newUser.save();

        res.redirect('/login'); // Redirect to login page after successful registration
    } catch (error) {
        console.error(error);
        res.redirect('/register');
    }
});



const cron = require('node-cron');
const { autoRejectDueBookings } = require('./controllers/rideController');

// Schedule the task to run every hour
cron.schedule('0 * * * *', () => {
    console.log('Running auto-reject task');
    autoRejectDueBookings();
});