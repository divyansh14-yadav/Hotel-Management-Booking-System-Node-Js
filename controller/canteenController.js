const Canteen = require('../Models/canteenModel')


const createCanteen = async (req,res) =>{

    try {

        const {description, itemList, hotelId} = req.body

        const createCanteen = new Canteen({
    
            description,
            itemList,
            hotelId,
            createdBy: req.user,
        })
        await createCanteen.save()
    
        res.status(200).json({
            status:"success",
            message: "Canteen created successfully"
        })
    } catch (error) {
        res.status(400).send({message:error.message})
    }
}

const getAllCanteen = async (req,res) =>{

    try {
        const canteen = await Canteen.find({}).populate("itemList", {itemName:1})
        .populate("hotelId", {hotelName:1}) 
    
        if(canteen.length === 0) {
            res.status(400).json({
                status: "Bad Request",
                message: "canteen details not found"
              });
        } else{
            res.status(200).json({
                status: "success",
                message: "Get all the canteen details",
                canteenDetails: canteen,
              });
        }
    } catch (error) {
        res.status(400).send({message:error.message})
    }


}


const updateCanteen = async (req,res) =>{

    try {
        const {description,itemList,hotelId} = req.body

        const id = req.params.id
    
        const getCanteen = await Canteen.findByIdAndUpdate(id, {
            description,hotelId,itemList
    
        },{new:true})
    
        if(getCanteen) {
    
            res.status(200).json({
                status: "success",
                message: "Canteen updated successfully"
            })
            getCanteen.save()
        }
        else {
            res.status(400).json({
                status:"Bad Request",
                message:"Canteen not found"
            })
        }
    } catch (error) {
        res.status(400).send({message:error.message})
    }
}
module.exports = {
    createCanteen,
    getAllCanteen,
    updateCanteen
}