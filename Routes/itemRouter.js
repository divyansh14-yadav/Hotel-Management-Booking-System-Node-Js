const express = require('express')
const itemRouter = express.Router()
const item = require('../controller/itemController')
const {upload} = require('../image/image')


itemRouter.post("/createItem",upload.array('itemImage',5) ,item.createItem)

itemRouter.get("/getItems", item.getItems)

itemRouter.get("/getItem/:id", item.getItem)

itemRouter.put("/updateItem/:id",upload.array('itemImage',5) ,item.updateItem)

itemRouter.delete("/deleteItem/:id", item.deleteItem)






module.exports = itemRouter