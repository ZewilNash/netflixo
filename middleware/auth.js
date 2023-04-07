const JWT = require("jsonwebtoken")
const User = require("../model/UserModel")

module.exports.isSignin = async (req , res , next) => {
    try {
        const token = req.headers.authorization
        if(!token){
            return res.send({
                success:false,
                message:"UnAuthorized Route Plesae Provide Token To Continue"
            })
        }

        const verifyToken = await JWT.verify(token , process.env.WEB_TOKEN_SECRET)
        if(verifyToken){
            const user = await User.findById(verifyToken._id)
            req.user = user
        }else {
            return res.send({
                success:false,
                message:"UnAuthorized Route Or Expired Token"
            })
        }

        next()

    }catch(error){
        res.send({
            success:false,
            message:"Error In Auth Middleware",
            error
        })
    }
}

module.exports.isAdmin = async (req , res,next) => {
    try {
        const user = req.user
        if(user.role !== 1){
            return res.send({
                success:false,
                message:'UnAuthorized Access'
            })
        }else {
            next()
        }
    }catch(error){
        res.send({
            success:false,
            message:"Error In Admin Middleware",
            error
        })
    }
}