const mongoose = require('mongoose');

const Schema = mongoose.Schema

const notificationSchema = new Schema({
    sender:{
          type: Schema.Types.ObjectId,      
          ref:'Auth'
    },
    receiver:{
        type: Schema.Types.ObjectId,
        ref:'Auth'
    },
    notificationType:{
        type:String,
        enum:['like','comment','review']
    },
    date:Date,
    notificationData:Object,
    read:{
        type:Boolean,
        default:false
    }

})

const notification = mongoose.model('notification',notificationSchema);

module.exports = notification;