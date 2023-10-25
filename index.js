const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const bodyParser = require('body-parser')
const commonRouter = require('./Routes/commonRouter')
require ('./db/connection')
const app = express();
const multer = require('multer')


app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

app.set('viewengine','ejs')

app.use('/public/assets/images',express.static('public/assets/images'))

app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) { 
        return res.status(400).json({
         err_message: "please upload jpg/jpeg/png/pdf files only"
        });
    } else { 
        return res.status(400).json({
            err_message: err.message
        });
    }
 });


// routes
app.use('/',commonRouter)



// server port
app.listen(process.env.PORT,()=>{
    console.log(`server started at port http://localhost:${process.env.PORT}`);
})