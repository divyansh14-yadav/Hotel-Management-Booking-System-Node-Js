const express = require ('express')
const roomRouter = express.Router()
const room = require('../controller/roomController')
const {upload} = require('../image/image')
const adminAuth = require('../middleware/admin')
const checkAuth = require('../middleware/auth')


roomRouter.post("/createNormalRoom",[checkAuth,adminAuth],upload.array('roomImage',3),room.createRoom)

roomRouter.get("/getNormalRoom",checkAuth,room.getNormalRooms)

roomRouter.post('/createDeluxeRoom',[checkAuth,adminAuth],upload.array('roomImages',5),room.createDeluxeRoom)

roomRouter.get("/getDeluxeRoom",checkAuth,room.getDeluxeRooms)

roomRouter.put('/updateDeluxe/:id',[checkAuth,adminAuth],upload.array("roomImages",5),room.updateDeluxeRoom)

roomRouter.put('/updateNormal/:id',[checkAuth,adminAuth],upload.array("roomImage",5),room.updateNormalRoom)

roomRouter.delete('/deleteNormal/:id',[checkAuth,adminAuth],room.deleteNormalRoom)

roomRouter.delete('/deleteDeluxe/:id',[checkAuth,adminAuth],room.deleteDeluxeRoom)

module.exports = roomRouter