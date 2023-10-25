const booking = require('../Models/hotelBook')


const bookHotel = async (req, res) => {
    try {
        const { deluxeRoom, normalRoom, person=1, days=1 } = req.body;
        const newBooking = booking(req.body)

        const checkedBooking = await booking.findOne({ deluxeRoom })
        const checkedBookings = await booking.findOne({ normalRoom })

        if (!checkedBooking && !checkedBookings) {

            newBooking.user = req.user
            await newBooking.save();
            res.status(200).json({
                status: "success",
                message: "room booked"
            });

        } else {
            res.status(400).json({
                status: "bad-request",
                message: "this room alredy booked"
            })
        }
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
}


const getBookingDetails = async (req, res) => {
    try {
        const user = req.user._id;
        const bookings = await booking.find({ user })
            .populate('user', { firstName: 1, lastName: 1, age: 1, _id: 0 })
            .populate('hotel', { hotelName: 1, location: 1, _id: 0 })
            .populate('normalRoom', { roomNumber: 1, roomType: 1, _id: 0, rent: 1 })
            .populate('deluxeRoom', { roomNumber: 1, roomType: 1, _id: 0, rent: 1 });
 
        let total = 0;
        bookings.forEach(booking => {
            booking.deluxeRoom.forEach(room => {
                total += booking.person * booking.days * room.rent;
            });
            booking.normalRoom.forEach(room => {
                total += booking.person * booking.days * room.rent;
            });
        });

        if (bookings.length === 0) {
            return res.status(400).json({
                status: "bad-request",
                message: "you have not booked any room yet"
            });
        } else {
            res.status(200).json({
                status: "success",
                message: "your room details",
                total: total,
                bookedRoomDetails: bookings
            });
        }
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

const cancelBooking = async (req, res) => {
    try {
        const { id } = req.params
        const bookings = await booking.findByIdAndDelete(id)
        if (!bookings) {
            return res.status(400).json({
                status: "bad-request",
                message: "you have not booked any rooms yet"
            })
        } else {
            res.status(200).json({
                status: "success",
                message: "booking cancelled "
            })
        }
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
}

module.exports = {
    bookHotel,
    getBookingDetails,
    cancelBooking,
    getBookingDetails
}