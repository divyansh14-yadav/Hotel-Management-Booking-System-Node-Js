const jwt = require('jsonwebtoken')

const createtoken = async (id, res) => {

    try {
  
      const tokn = await jwt.sign({ _id: id }, process.env.JWT_SECRET, {
  
        expiresIn: "24h"
      })
  
      return tokn
  
    } catch (error) {
  
      res.send(error.message)
    }
  }

 module.exports= createtoken