const express = require('express')
const authR = express.Router()
const user = require('../controller/userController')
const {upload} = require('../image/image')

authR.post('/authRegister',
 upload.fields([{ name: 'profilePic', maxCount: 1 }, { name: 'identity', maxCount: 1 }]),
user.authRegister)

authR.post('/authLogin',user.authLogin)

authR.get('/getallAuth',user.allAuthDetails)

authR.get('/authSetailsById/:id',user.authDetail)

authR.put('/authUpdate/:id',upload.fields([{ name: 'profilePic', maxCount: 1 }, { name: 'identity', maxCount: 1 }]),user.updateAuth)

authR.delete('/deleteUser/:id',user.deleteUser)

authR.get('/getNotification',user.getNotification)

authR.get('/readNotification',user.readNotication)

authR.patch('/changePassword/:id',user.authChangePassword)

authR.post('/verifyOtp',user.verifyOtp)

authR.post('/resendOtp',user.resendOtp)

module.exports = authR;