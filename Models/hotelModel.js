const mongoose = require("mongoose");
const Schema = mongoose.Schema
const {ObjectId} = mongoose.Schema.Types

const hotelSchema = new mongoose.Schema({

  hotelName:{
    type:String,
    default:"hotel sayaji"
  },
  location: {
    type: String,
  },
  images:{
      type:Array,
  },
  totalRooms: {
    type: Number,
  },
  deluxeRooms: [{
    type:ObjectId,
    ref: "deluxeRooms"
  }],
  normalRooms: [{
    type:ObjectId,
    ref: "normal"
  }],
  facility: {
    type: String,
  },
  owner:{
    type:ObjectId,
    ref:"Auth"
    },
});

hotelSchema.set("timestamps", true);

module.exports = mongoose.model("Hotel", hotelSchema);
