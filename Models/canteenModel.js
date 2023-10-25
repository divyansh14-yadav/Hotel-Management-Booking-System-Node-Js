const mongoose = require('mongoose')
var Schema = mongoose.Schema;

const canteenSchema = new mongoose.Schema({


    createdBy:{
        type: Schema.Types.ObjectId,
        ref: "Auth"
    },
    hotelId:{
        type: Schema.Types.ObjectId,
        ref: "Hotel"
    },
    itemList: [{
        type: Schema.Types.ObjectId,
        ref: "Item"
    }],
    description: {
        type: String
    }
})

canteenSchema.set("timestamps", true);

module.exports = mongoose.model("Canteen", canteenSchema);