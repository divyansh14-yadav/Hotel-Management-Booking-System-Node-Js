const jwt = require ('jsonwebtoken')


const adminAuth = (req,res,next) =>{

    try {

        const token = req.headers.authorization.split(" ")[1]

        const verify = jwt.verify(token,process.env.JWT_SECRET)

        const isAdmin = req.user.isAdmin

        if(!isAdmin){

            return res.status(400).send({message:"you are not admin"})
        }
        next()
        
    } catch (error) {
        
        res.status(400).send({message:error.message})
    }
}

module.exports = adminAuth