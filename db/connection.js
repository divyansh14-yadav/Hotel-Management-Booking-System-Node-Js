const mongoose = require('mongoose')

mongoose.set('strictQuery',true);


mongoose.connect(process.env.MONGO_URL,{useNewUrlParser:true,}).then(()=>{
    console.log("connected to mongodb atlas")
}).catch(error=>{
console.log("something wrong")
})

