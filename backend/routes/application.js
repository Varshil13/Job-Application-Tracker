const express = require("express");
const { getallapplications } = require("../controllers/applicationController");

const router = express.Router();


router.get("/getallapplications",getallapplications);

module.exports = router;
