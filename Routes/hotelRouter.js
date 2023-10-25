const express = require ('express')
const hotelRouter = express.Router()
const hotel = require('../controller/hotelController')
const checkAuth = require('../middleware/auth')
const adminAuth = require('../middleware/admin')
const {upload} = require('../image/image')


hotelRouter.post('/createHotel',[checkAuth,adminAuth],upload.array('images',5),hotel.createHotel)

hotelRouter.get('/getHotelDetails',hotel.getAllHotel)

hotelRouter.get('/getHotelDetail/:id',hotel.getHotel)

hotelRouter.put('/updateHotelDetail/:id',upload.array('images',5),hotel.updateHotel)

hotelRouter.delete('/deleteHotelDetail/:id',hotel.deleteHotel)


module.exports = hotelRouter
