const express = require ('express')
const canteenRouter = express.Router()
const canteen = require('../controller/canteenController')
const adminAuth = require('../middleware/admin')
const checkAuth = require('../middleware/auth')
const {upload} = require('../image/image')


canteenRouter.post('/createCanteen',upload.single(),[checkAuth,adminAuth], canteen.createCanteen)

canteenRouter.get('/getCanteens',checkAuth, canteen.getAllCanteen)

canteenRouter.put('/updateCanteen/:id',upload.single(),[checkAuth,adminAuth], canteen.updateCanteen)






module.exports = canteenRouter