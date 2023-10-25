const Item = require ('../Models/itemModel')
const fs = require('fs')
const path = require('path');


const createItem = async (req,res) =>{

    try {
        const { itemName, price, discount, itemDescription, quantity } = req.body;
      
        if (!itemName || !price || !discount || !itemDescription || !quantity) {
          res.status(400).send({ message: 'Please fill in all fields' });
        } else {
          const itemImage = req.files.map(({ filename }) => `/public/assets/images/${filename}`);
          const createItem = new Item({ itemName, price, discount, itemDescription, quantity, itemImage });
      
          await createItem.save();
      
          res.status(200).json({
            status: 'success',
            message: 'Item created successfully',
          });
        }
      } catch (error) {
        res.status(400).send({ message: error.message });
      }
}

const getItems = async (req,res)=>{

    try {
        const getitems = await Item.find({})

        if(getitems.length === 0) {
            res.status(400).send({message:"Items not found"})
        }
        else{
            res.status(200).json({
                status:"success",
                message:"items list",
                items:getitems
            })
        }
    } catch (error) {
        res.status(400).send({message:error.message})
    }
}


const getItem = async (req,res) =>{

    try {
        const id = req.params.id

        const getItems = await Item.findById(id)
    
        if(getItems == null){
            res.status(400).send({message:"items not found"})
        }
        else{
            res.status(200).json({
                status:"success",
                message:"item detail",
                item:getItems
            })
        }   
    } catch (error) {
        res.status(400).send({message:error.message})
    }
}


const updateItem = async (req,res) => {

    try {
        const {itemName, price, discount, itemDescription, itemImage,quantity} = req.body
        const id = req.params.id
    
        const getItems = await Item.findByIdAndUpdate(id,{
            itemName, price, discount, itemDescription, quantity,itemImage
        },{new:true})
    
        if(getItems){
            getItems.itemImage = req.files.map(({ filename }) => `/public/assets/images/${filename}`)
          
            res.status(200).json({
                status:"success",
                message: "item updated"
            })
            getItems.save()
        }
        else{
            res.status(400).json({
                status:"Bad Request",
                message: "item not updated"
            })
        } 
    } catch (error) {
        res.status(400).send({message:error.message})
        
    }
}


const deleteItem = async (req,res) =>{

    const itemId = req.params.id;

    try {
      const item = await Item.findByIdAndDelete(itemId);
    
      const imagePaths = item.itemImage && item.itemImage.length > 0 && item.itemImage.map((image) => {
        return `${image}`;
      });
    
      if (imagePaths) {
            imagePaths.forEach((imagePath) => {
            fs.unlinkSync(path.join(__dirname, '..', imagePath));
        });
      }
    
      res.status(200).json({
        status: "success",
        message: "Deleted item successfully"
      });
    
    } catch (error) {
      res.status(400).send({message:error.message});
    }
}
module.exports = {
    createItem,
    getItems,
    getItem,
    updateItem,
    deleteItem
}