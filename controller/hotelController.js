const Hotel = require("../Models/hotelModel");
const deluxe = require('../Models/deluxeRoomModel')
const normal = require('../Models/normalRooms')

const createHotel = async (req, res) => {

  try {
    const { hotelName,location, totalRooms, deluxeRooms, normalRooms, facility} = req.body;


    if (!location  || !deluxeRooms || !normalRooms || !facility) {
      res.status(400).send({ message: "please fill the all fields" });
    } else {
      const createHotel = new Hotel({
        hotelName,
        location,
        totalRooms,
        deluxeRooms,
        normalRooms,
        facility,
        owner: req.user,
        images : req.files.map(({ filename }) => `/public/assets/images/${filename}`)
      });
  
      await createHotel.save();
  
      res.status(200).json({
        status: "success",
        message: "hotel created successfully",
      });
    }
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }

};

const getAllHotel = async (req, res) => {
  
  try {
    // Retrieve all the hotels and populate their owner and room details
    const getDetails = await Hotel.find({})
      .populate("owner", { firstName: 1 })
      .populate("deluxeRooms", {
        rent: 1,
        roomImages: 1,
        description: 1,
        facilities: 1,
      })
      .populate("normalRooms", { rent: 1, roomImage: 1, description: 1 });
  
    // Count the number of normal and deluxe rooms for each hotel
    var count = getDetails.map((element, i) => {
      // Return the sum of normal and deluxe rooms
      return ( element.normalRooms?.length + " "+ `normalRoom` +","+"  ") + (element.deluxeRooms?.length+" "+"deluxeRooms");
    });
  
    // Calculate the total number of rooms for all hotels
    // const total = count.reduce((acc, curr) => acc + curr);
  
    // Check if the hotel details were found and return a response accordingly
    if (getDetails.length === 0) {
      res.status(400).json({
        status: "Bad Request",
        message: "hotel details not found",
        hotelDetails: getDetails,
      });
    } else {
      res.status(200).json({
        status: "success",
        message: "Get all the hotel details",
        hotelDetails: getDetails,
        totalRooms: count
      });
    }
  } catch (error) {
    // Handle any errors that occur during retrieval
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }

};

const getHotel = async (req, res) => {

  try {
    const id = req.params.id;
    const getDetail = await Hotel.findById(id).populate("owner",{firstName:1})

    .populate("normalRooms", {rent:1,roomImage:1, description:1})
  
    if (getDetail === null) {
      res.status(400).json({
        status: "Bad Request",
        message: "hotel details not found",
        hotelDetail: getDetail,
      });
    } else {
      res.status(200).json({
        status: "success",
        message: "It's a hotel detail",
        hotelDetail: getDetail,
      });
    }
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

const updateHotel = async (req, res) => {

  try {
    const { location, totalRooms, deluxeRooms, normalRooms, facility } = req.body;

    const id = req.params.id;
  
    const detailUpdate = await Hotel.findByIdAndUpdate(
      id,
      {
        location,
        totalRooms,
        deluxeRooms,
        normalRooms,
        facility,
        images :req.files.map(({ filename }) => `/public/assets/images/${filename}`)
      },
      { new: true }
    );
  
    if (detailUpdate) {
      res.status(200).json({
        status: "success",
        message: "hotel detail updated",
        updateHotel: detailUpdate,
      });
    } else {
      res.status(400).json({
        status: "Bad Request",
        message: "hotel detail not updated",
        updateHotel: detailUpdate,
      });
    } 
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};


const deleteHotel = async (req,res) =>{

  try {
    const id = req.params.id

    const deleteHotelDetails = await Hotel.findByIdAndDelete(id)

    if(deleteHotelDetails) {
      res.status(200).json({
        status:"success",
        message:"Deleted hotel details"
    })
    }else{
        res.status(400).json({
          status: "Bad Request",
          message: "hotel details not found"
        });
    }

  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
}

module.exports = {
  createHotel,
  getAllHotel,
  getHotel,
  updateHotel,
  deleteHotel
};
