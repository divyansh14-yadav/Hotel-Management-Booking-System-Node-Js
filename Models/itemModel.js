const mongoose = require ('mongoose')

const itemSchema = new mongoose.Schema({

    itemName:{
        type:String
    },
    price:{
        type:Number
    },
    discount:{
        type:Number
    },
    itemDescription:{
        type: String
    },
    itemImage: {
        type:Array
    },
    quantity:{
        type:String
    }
})

itemSchema.set("timestamps", true);

module.exports = mongoose.model("Item", itemSchema);