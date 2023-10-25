const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    phoneNumber: {
        type: Number,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    otp:{
        type:String,
        
    },
    otpExpires: {
        type: Date,
      
    },
    age: {
        type: String,
    },
    dob: {
        type: String,
    },
    profilePic: {
        type: String,
        default: 'public/assets/images/default.jpg'
    },
    identity: {
        type: String
       
    },
    address: {
        type: String,
    },
    token:{
        type:String
    },
    isVerified :{
        default : 0,
        type : Number
    },
    isAdmin:{
        default : false,
        type: Boolean
    }
})
userSchema.set('timestamps',true)
module.exports = mongoose.model('Auth',userSchema)