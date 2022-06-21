const jwt = require('jsonwebtoken')
require('dotenv').config()

const auth = (req,res,next)=>{
    const token = req.header('x-auth-token')
    if(!token){
        res.status(401).send('Access denied . No token provided')
        return
    }

    try {
        const {_id,isAdmin} = jwt.verify(token,process.env.JWT_PRIVATE_KEY)
        req.body.userid = _id
        req.body.isAdmin = isAdmin
        next()
    } catch (error) {
        res.status(400).send('Invalid token')
    }
}

module.exports = {auth}