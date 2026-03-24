// const router  = require("express").Router()
// const bcrypt = require("bcryptjs")
// const jwt  = require("jsonwebtoken")
// const User = require("../models/userSchema")

// router.post("/signup", async(req,res)=>{
//     try {

//         const { name,email,password } = req.body;


//         if(!email || !password || !name){
//             return res.status(400).json({message : "All fields req"})
//         }

//         const existingUser = await User.findOne({email});

//         if(!existingUser){
//             const hashedPass = await bcrypt.hash(password, 10)


//             const newUser = await User.create({
//                 name : name,
//                 email: email,
//                 password : hashedPass
//             })

//             const token = jwt.sign(
//                 {id : newUser._id},
//                 process.env.JWT_SECRET,
//                 {expiresIn : "1d"}
//             ) 

//             res.cookie()

//         }

//     }
// })