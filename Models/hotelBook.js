const mongoose  = require('mongoose')

const hotelBookSchema = new mongoose.Schema({
    hotel : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Hotel"
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Auth"
    },
    person:{
        type:Number,
        default:1,
    },
    days:{
        type:Number,
        default:1,
    },
    normalRoom: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "normal"
    }],
    deluxeRoom: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "deluxeRooms",
    }]
})
hotelBookSchema.set("timestamps",true)

module.exports = mongoose.model('booking',hotelBookSchema)