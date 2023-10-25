const mongoose = require('mongoose');
const deluxeRoomSchema = new mongoose.Schema({
    roomNumber : {
        type : Number
    },
    description : {
        type : String
    },
    roomType : {
        type : String,
        default : "deluxeRoom"
    },
    roomImages : {
        type : Array
    },
    facilities : {
        type : String
    },
    rent : {
        type : Number
    },
    isactive : {
        type : Boolean
    }
})
deluxeRoomSchema.set("timestamps",true)

module.exports = mongoose.model('deluxeRooms',deluxeRoomSchema)