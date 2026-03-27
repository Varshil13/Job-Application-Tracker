
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/userSchema")
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function signup(req, res) {
    try {

        const { name, email, password } = req.body;


        if (!email || !password || !name) {
            return res.status(400).json({ message: "All fields required" })
        }

        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            const hashedPass = await bcrypt.hash(password, 10)


            const newUser = await User.create({
                name: name,
                email: email,
                password: hashedPass
            })



            const token = jwt.sign(
                { id: newUser._id },
                process.env.JWT_SECRET,
                { expiresIn: "4d" }
            )
            console.log(token)

            res.cookie("token", token, {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                maxAge: 7 * 24 * 60 * 60 * 1000

            })
            return res.status(201).json({
                message: "Signup Success",
                user: {
                    id: newUser._id,
                    name: newUser.name,
                    email: newUser.email
                }
            })

        }

        res.status(400).json({ message: "User Already Exists" })

    }
    catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server Error" })
    }
}

async function signin(req, res) {
    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All Fields Required" })
        }

        const existingUser = await User.findOne({ email })

        if (!existingUser) {
            return res.status(400).json({ message: "User Does Not Exists" })
        }
        if (existingUser.authProvider !== "local") {
            return res.status(400).json({
                message: "Please login with Google or signup"
            });
        }

        const isMatch = await bcrypt.compare(password, existingUser.password)

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Credentials" })
        }

        const token = jwt.sign(
            { id: existingUser._id },
            process.env.JWT_SECRET,
            { expiresIn: "4d" }
        )

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.status(200).json({
            message: "SignIn Success",
            user: {
                id: existingUser._id,
                name: existingUser.name,
                email: existingUser.email,
                provider: existingUser.authProvider
            }
        })

    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Server Error" })
    }
}

async function googleLogin(req, res) {
    try {
        const { token } = req.body;
        if (!token) {
            return res.status(400).json({ message: "Token required" });
        }

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();

        const {
            name,
            email,
            picture,
            sub: googleId
        } = payload;

        let user = await User.findOne({ googleId });

        if (!user) {
            user = await User.findOne({ email });

            if (user) {
                user.googleId = googleId;
                user.authProvider = "google";
                user.profilePic = picture;
                await user.save();
            } else {
                user = await User.create({
                    name,
                    email,
                    googleId,
                    profilePic: picture,
                    authProvider: "google"
                });
            }
        }
        console.log(user);

        const jwtToken = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "4d" }
        );
        
        console.log(jwtToken)

        res.cookie("token", jwtToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        });

        res.status(200).json({
            message: "Google Login Success",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                provider: user.authProvider
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Google Auth Failed" });
    }
}
async function logout(req, res) {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        });

        return res.status(200).json({
            message: "Logout success"
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Logout failed"
        });
    }
}

module.exports = { signup, signin, googleLogin, logout }