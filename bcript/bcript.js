const bcrypt = require('bcrypt');

const secure =async(password)=>{
    try {
        const hasedpassword = await bcrypt.hash(password,10);
        return hasedpassword
    } catch (error) {
        res.status(401).send(error.message);
    }
}

module.exports =secure;