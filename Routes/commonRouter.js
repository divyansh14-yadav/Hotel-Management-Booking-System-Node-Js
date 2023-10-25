const express = require('express')
const commonRouter= express.Router()
const authR = require('./authRouter')
const hotelRouter = require('./hotelRouter')
const itemRouter = require('./itemRouter')
const canteenRouter = require('./canteenRouter')
const roomRouter = require('./roomsRouter');
const booking = require('./bookingRouter')

commonRouter.use('/auth',authR)
commonRouter.use('/hotel',hotelRouter)
commonRouter.use('/item',itemRouter)
commonRouter.use('/canteen',canteenRouter)
commonRouter.use('/room',roomRouter)
commonRouter.use('/book',booking)


module.exports = commonRouter