const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");
const { OAuth2Client } = require("google-auth-library");
const transporter = require("../config/mail");
const Otp = require("../models/otpSchema");
const otpGenerator = require("otp-generator");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const authCookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
};

function withTimeout(promise, ms) {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error("EMAIL_TIMEOUT")), ms);

        promise
            .then((value) => {
                clearTimeout(timer);
                resolve(value);
            })
            .catch((error) => {
                clearTimeout(timer);
                reject(error);
            });
    });
}

async function signup(req, res) {
    try {
        const { otp, name, email, password } = req.body;

        if (!email || !password || !name || !otp) {
            return res.status(400).json({ message: "All fields required" });
        }

        const otprecord = await Otp.findOne({ email, otp });

        if (!otprecord) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired OTP",
            });
        }

        const hashedPass = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name: name,
            email: email,
            password: hashedPass,
        });

        await Otp.deleteMany({ email });

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
            expiresIn: "4d",
        });

        res.cookie("token", token, authCookieOptions);
        res.status(201).json({
            message: "Signup Success",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
}

async function getMe(req, res) {
    const token = req.cookies.token;

    if (!token) {
        return res.json({ user: null });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("name email authProvider");

        if (!user) {
            return res.json({ user: null });
        }

        res.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                provider: user.authProvider,
            },
        });
    } catch {
        res.json({ user: null });
    }
}

async function sendOtp(req, res) {
    try {
        const { email } = req.body;
        console.log("[sendOtp] request received for", email);

        if (!email || !email.includes("@")) {
            return res.status(400).json({
                success: false,
                message: "Invalid email",
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        const otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });

        await withTimeout(Otp.create({ email, otp }), 10000);
        console.log("[sendOtp] OTP saved for", email);

        await withTimeout(
            transporter.sendMail({
                from: process.env.EMAIL,
                to: email,
                subject: "OTP Verification",
                text: `Your OTP is ${otp}`,
            }),
            15000
        );
        console.log("[sendOtp] email sent for", email);

        res.json({
            success: true,
            message: "OTP sent Successfully",
        });
    } catch (err) {
        console.error("[sendOtp] failed", err);
        await Otp.deleteMany({ email: req.body?.email }).catch(() => {});
        if (err.message === "EMAIL_TIMEOUT") {
            return res.status(504).json({
                success: false,
                message: "Email service timeout. Please try again.",
            });
        }
        if (err.name === "MongooseError" || err.name === "MongoServerError") {
            return res.status(503).json({
                success: false,
                message: "Database timeout. Please try again.",
            });
        }
        res.status(500).json({
            success: false,
            message: "Failed to send OTP",
        });
    }
}

async function signin(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All Fields Required" });
        }

        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return res.status(400).json({ message: "User Does Not Exists" });
        }
        if (existingUser.authProvider !== "local") {
            return res.status(400).json({
                message: "Please login with Google or signup",
            });
        }

        const isMatch = await bcrypt.compare(password, existingUser.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, {
            expiresIn: "4d",
        });

        res.cookie("token", token, authCookieOptions);

        res.status(200).json({
            message: "SignIn Success",
            user: {
                id: existingUser._id,
                name: existingUser.name,
                email: existingUser.email,
                provider: existingUser.authProvider,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
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
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        const { name, email, picture, sub: googleId } = payload;

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
                    authProvider: "google",
                });
            }
        }
        const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "4d",
        });

        res.cookie("token", jwtToken, authCookieOptions);

        res.status(200).json({
            message: "Google Login Success",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                provider: user.authProvider,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Google Auth Failed" });
    }
}
async function logout(req, res) {
    try {
        const clearOptions = {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            path: "/",
        };

        res.clearCookie("token", clearOptions);
        res.cookie("token", "", {
            ...clearOptions,
            expires: new Date(0),
            maxAge: 0,
        });

        return res.status(200).json({
            message: "Logout success",
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Logout failed",
        });
    }
}

module.exports = { signup, signin, googleLogin, logout, sendOtp, getMe };
