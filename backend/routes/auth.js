const express = require("express")
const { signup, signin, googleLogin, logout } = require("../controllers/authController")

const router = express.Router()


router.post("/signup", signup)
router.post("/signin", signin)
router.post("/google", googleLogin);
router.post("/logout", logout);
module.exports = router


