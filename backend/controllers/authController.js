
const bcrypt = require("bcryptjs")
const jwt  = require("jsonwebtoken")
const User = require("../models/userSchema")

async function signup(req,res){
    try {

        const { name,email,password } = req.body;


        if(!email || !password || !name){
            return res.status(400).json({message : "All fields required"})
        }

        const existingUser = await User.findOne({email});

        if(!existingUser){
            const hashedPass = await bcrypt.hash(password, 10)


            const newUser = await User.create({
                name : name,
                email: email,
                password : hashedPass
            })

    

            const token = jwt.sign(
                {id : newUser._id},
                process.env.JWT_SECRET,
                {expiresIn : "4d"}
            ) 

            res.cookie("token" , token ,{
             httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000

            })
            return res.status(201).json({message :"Signup Success",
                user:{
                    id : newUser._id,
                    name : newUser.name,
                    email: newUser.email
                }
            })

        }

        res.status(400).json({message : "User Already Exists" })

    }
    catch(err){
        console.log(err)
        res.status(500).json({message : "Server Error"})
    }
}

async function signin(req,res){
    try {

        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({message : "All Fields Required"})
        }

        const existingUser = await User.findOne({email})

        if(!existingUser){
            return res.status(400).json({message : "User Does Not Exists"})
        }

        const isMatch = await bcrypt.compare(password, existingUser.password)

        if(!isMatch){
            return res.status(400).json({message : "Invalid Credentials"})
        }

        const token = jwt.sign(
            {id : existingUser._id},
            process.env.JWT_SECRET,
            {expiresIn : "4d"}
        )

        res.cookie("token" , token ,{
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.status(200).json({
            message :"SignIn Success",
            user:{
                id : existingUser._id,
                name : existingUser.name,
                email: existingUser.email
            }
        })

    } catch(err){
        console.error(err)
        res.status(500).json({message : "Server Error"})
    }
}


module.exports = {signup, signin}