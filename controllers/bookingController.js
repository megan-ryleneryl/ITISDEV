/* Import Models */
const User = require('../models/User');
const Ride = require('../models/Ride');
const Booking = require('../models/Booking');

// Utility Functions
function formatMonth(date) {
    return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long' }).format(date);
}

function isEndOfWeek(index) {
    return (index + 1) % 7 === 0;
}


/* Define Functions */
async function getBookingForm(req, res) {
    const ride = await Ride.findOne({ rideID: req.params.id });

    if (!ride) {
        req.flash('error', 'Ride not found');
        return res.redirect('/ride/viewRides');
    }

    const driver = await User.findOne({ userID: ride.driverID });
    if (!driver) {
        req.flash('error', 'Driver not found');
        return res.redirect('/ride/viewRides');
    }

    const today = new Date();
    const availableDays = ride.availableDays.map(day => day.toLowerCase());
    const weekDays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    
    // Find the closest available day from today
    let closestAvailableDay = new Date(today);
    while (!availableDays.includes(weekDays[closestAvailableDay.getDay()])) {
        closestAvailableDay.setDate(closestAvailableDay.getDate() + 1);
    }

    const calendarDaysCurrentMonth = [];
    const calendarDaysNextMonth = [];
    const startDay = new Date(closestAvailableDay);
    startDay.setDate(startDay.getDate() - startDay.getDay()); // Start from the first day of the week
    const endDay = new Date(today.getFullYear(), today.getMonth() + 2, 0); // End at the end of the next month

    for (let day = new Date(startDay); day <= endDay; day.setDate(day.getDate() + 1)) {
        const calendarDay = {
            date: day.toISOString().split('T')[0],
            day: day.getDate(),
            isInMonth: day.getMonth() === closestAvailableDay.getMonth() || day.getMonth() === closestAvailableDay.getMonth() + 1,
            isAvailable: availableDays.includes(weekDays[day.getDay()]) && day >= today
        };
        
        if (day.getMonth() === today.getMonth()) {
            calendarDaysCurrentMonth.push(calendarDay);
        } else if (day.getMonth() === today.getMonth() + 1) {
            calendarDaysNextMonth.push(calendarDay);
        }
    }

    res.render('booking/bookride', { 
        title: 'Book Ride',
        ride: ride,
        driver: driver,
        currentMonth: formatMonth(closestAvailableDay),
        nextMonth: formatMonth(new Date(closestAvailableDay.getFullYear(), closestAvailableDay.getMonth() + 1, 1)),
        calendarDaysCurrentMonth: calendarDaysCurrentMonth,
        calendarDaysNextMonth: calendarDaysNextMonth,
        formatMonth: formatMonth,
        isEndOfWeek: isEndOfWeek,
        css: ['index.css'],
        layout: "main",
        user: req.user,
        messages: {
            error: req.flash('error'),
            success: req.flash('success')
        }
    });
}




async function bookRide(req, res) {
    const { rideId, dates } = req.body;
    //const passengerId = req.user.userId; // Assuming you have authentication and can get the user ID
    
    //Sample passenger ID for testing
    const passengerId = 20001;

    //make new booking id
    const lastBooking = await Booking.findOne().sort('-bookingID');
    const newBookingId = lastBooking ? lastBooking.bookingID + 1 : 40001;


    // Create a new booking instance
    const booking = new Booking({
      bookingID: newBookingId,
      rideID: rideId,
      passengerID: passengerId,
      bookingDates: dates,
      responseStatus: 'pending', // Initial status is pending until the driver accepts
      rideStatus: 'pending', // Ride status starts as pending
      paymentStatus: 'pending', // Payment status starts as pending
    });
  
    try {
      // Save the booking to the database
      const savedBooking = await booking.save();
  
      // Respond with success message
      res.json({ success: true, message: 'Ride request submitted successfully!' });
    } catch (error) {
      console.error('Error while booking ride:', error);
      res.status(500).json({ success: false, message: 'Failed to submit ride request. Please try again later.' });
    }
  }

async function cancelBooking(req, res) {}

async function viewMyBookings(req, res) {}

async function confirmPayment(req, res) {}

module.exports = {
    getBookingForm,
    bookRide,
    cancelBooking,
    viewMyBookings,
    confirmPayment
}