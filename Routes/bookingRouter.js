const express = require('express')
const bookR = express.Router();
const booking = require('../controller/bookingController');
const {upload} = require('../image/image')
const checkAuth = require('../middleware/auth')

bookR.post('/hotelBook',checkAuth,upload.single(),booking.bookHotel)
bookR.get('/bookingDetail',checkAuth,booking.getBookingDetails)
bookR.delete('/cancelbooking/:id',checkAuth,booking.cancelBooking)

module.exports = bookR;