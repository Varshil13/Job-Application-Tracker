const express = require("express")
const { signup, signin, googleLogin, logout, sendOtp, getMe } = require("../controllers/authController")

const router = express.Router()


router.post("/signup", signup)
router.post("/signin", signin)
router.post("/google", googleLogin);
router.post("/send-otp", sendOtp)
router.post("/logout", logout);
router.get("/getme" , getMe)
module.exports = router


