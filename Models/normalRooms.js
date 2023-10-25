const mongoose = require('mongoose')
var Schema = mongoose.Schema

const normalRoom = new mongoose.Schema({

    description: {
        type: String
    },
    roomType : {
        type: String,
        default : "normalRoom"
    },
    roomNumber:{
        type:Number
    },
    rent:{
        type:Number
    },
    roomImage:{
        type:Array
    }
})

normalRoom.set('timestamps',true)

module.exports = mongoose.model("normal",normalRoom)