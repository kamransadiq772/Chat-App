const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const asyncHandler = require('express-async-handler')

const protect = asyncHandler(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) { //token would be something like  Bearer dsjklfauiyerwer;ldjfaoiuyseakjhabsdfjg
        try {
            token = req.headers.authorization.split(" ")[1]           

            //decodes token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.id).select("-password") //-password mean without password
            next()

        } catch (error) {
            res.status(401)
            throw new Error('Not Authorized, token failed')
        }
    }
    if(!token){
        res.status(401)
        throw new Error("No Token, No Authorization")
    }
})

module.exports = {protect}