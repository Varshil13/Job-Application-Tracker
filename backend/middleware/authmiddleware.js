const jwt = require("jsonwebtoken")
const User = require("../models/userSchema")





async function  authMiddleware(req,res,next) {


    try{
        const token = req.cookies.token
      
        if(!token){

            return res.status(401).json({
                success:false,
                message : "Not Authorized. Please Login"
            })
        }

        const decoded = jwt.verify(token , process.env.JWT_SECRET)
        const user = await User.findById(decoded.id).select("-password")//returns everything except the password


        if(!user){
            return res.status(401).json({
                success:false,
                message : "User Not Found"
            })

        }

            req.user = user;
            next();
 

    }

    catch (err){
        console.error("Auth Error:",err)

        return res.status(401).json({
            success:false,
            message:"Invalid Token"
        })
    }


    
}

module.exports = authMiddleware