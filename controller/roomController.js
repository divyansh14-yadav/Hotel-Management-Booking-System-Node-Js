const Normal = require('../Models/normalRooms')
const deluxeRoom = require('../Models/deluxeRoomModel')
const fs = require('fs')
const path = require('path')

const createRoom = async (req,res) =>{

    try {
        const {description, roomNumber,rent} = req.body

        const createRoom = new Normal({
    
            description,roomNumber,rent,
            roomImage :  req.files.map(({ filename }) => `/public/assets/images/${filename}`)
        })
        await createRoom.save()
        
            res.status(200).json({
                status:"success",
                message: "Normal Room created successfully"
            })
    } catch (error) {
        res.status(400).send({message:error.message})
    }
}


const getNormalRooms = async(req,res) =>{

    const getRooms = await Normal.find({},{roomNumber:0})
    const getRoom = await Normal.count()

    if(getRooms.length === 0) {
        res.status(400).send({message:"Rooms not found"})
    }
    else{
        res.status(200).json({
            status:"success",
            message:"Normal Room list",
            Room:getRooms,
            totalNormalRoom : getRoom
        })

    }
}

const createDeluxeRoom = async(req,res)=>{
    try {
        const room = new deluxeRoom(req.body)
        room.roomImages =  req.files.map(({ filename }) => `/public/assets/images/${filename}`)
         const newRoom = await room.save()
        res.status(200).json({
        status : "success",
        message : "deluxe room created successfull"
       })
    } catch (error) {
        res.status(400).json({
            message : error.message
        })
    }
}

const getDeluxeRooms = async(req,res) =>{
    const getRooms = await deluxeRoom.find({},{roomNumber:0})
    const getRoom = await deluxeRoom.count()
    if(getRooms.length === 0) {
        res.status(400).send({message:"Rooms not found"})
    }
    else{
        res.status(200).json({
            status:"success",
            message:"deluxe Room list",
            totalrooms : getRoom,
            Room:getRooms
        })

    }
}

const updateDeluxeRoom = async(req,res)=>{
    try {
        const{roomNumber,description,roomImages,facilities,rent} = req.body
        const {id} = req.params
        const roomDetails = await deluxeRoom.findByIdAndUpdate(id,{
            roomNumber,description,roomImages,facilities,rent
        },{new:true})
        if(roomDetails){
            roomDetails.roomImages =req.files.map(({ filename }) => `/public/assets/images/${filename}`)
            const updatedRooms = await roomDetails.save()
            res.status(200).json({
                status : "success",
                message : "updated successfull"
            })
        }else{
            return res.status(400).json({
            status : "bad-request",
            message : "room details not found"
        }) 
        }
    } catch (error) {
        res.status(400).json({
            message : error.message
        })
    }
}

const deleteDeluxeRoom = async(req,res)=>{
    try {
        const {id} = req.params
        const roomDetails = await deluxeRoom.findByIdAndDelete(id)
        if(!roomDetails){
            return res.status(400).json({
                status : "bad-request",
                message : "room details not found"
            })
        }else{
            const imagePaths = roomDetails.roomImages && roomDetails.roomImages.length > 0 && roomDetails.roomImages.map((image) => {
                return `${image}`});
              if (imagePaths) {
                imagePaths.forEach((imagePath) => {
                      fs.unlinkSync(path.join(__dirname, '..', imagePath));
                });
              }
            res.status(200).json({
                status : "success",
                message : "room deleted successfull"
            })
        }   
    } catch (error) {
        res.status(400).json({
            status : "bad-request",
            message : error.message
        })
    }
}


const updateNormalRoom = async (req,res) =>{

    try {
        const{roomNumber,description,roomImage,rent} = req.body

        const {id} = req.params

        const roomDetails = await Normal.findByIdAndUpdate(id,{
            roomNumber,description,roomImage,rent
        
        },{new:true})

        if(roomDetails){
            roomDetails.roomImage =req.files.map(({ filename }) => `/public/assets/images/${filename}`)
            const updatedRooms = await roomDetails.save()
            res.status(200).json({
                status : "success",
                message : "updated successfull"
            })

        }else{
            return res.status(400).json({
            status : "bad-request",
            message : "room details not found"
        })
         
        }
    } catch (error) {
        res.status(400).json({
            message : error.message
        })
    }
}


const deleteNormalRoom = async (req,res) =>{

    try {
        const {id} = req.params
        const roomDetails = await Normal.findByIdAndDelete(id)
        if(!roomDetails){
            return res.status(400).json({
                status : "bad-request",
                message : "room details not found"
            })
        }else{
            const imagePaths = roomDetails.roomImage && roomDetails.roomImage.length > 0 && roomDetails.roomImage.map((image) => {
                return `${image}`});
              if (imagePaths) {
                imagePaths.forEach((imagePath) => {
                      fs.unlinkSync(path.join(__dirname, '..', imagePath));
                });
              }
            res.status(200).json({
                status : "success",
                message : "room deleted successfull"
            })
        }   
    } catch (error) {
        res.status(400).json({
            status : "bad-request",
            message : error.message
        })
    }
}

module.exports = {
    createRoom,
    getNormalRooms,
    createDeluxeRoom,
    getDeluxeRooms,
    updateDeluxeRoom,
    deleteDeluxeRoom,
    updateNormalRoom,
    deleteNormalRoom
}