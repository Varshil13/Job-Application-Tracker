const express = require("express");
const {
	createApplication,
	getallapplications,
	getjobdetails,
	getApplicationStatus,
	updateApplicationStatus,
	archiveApplication,
	deleteApplication,
} = require("../controllers/applicationController");

const router = express.Router();


router.post("/create", createApplication);
router.get("/getallapplications",getallapplications);
router.get("/getjobdetails/:id",getjobdetails);
router.patch("/modify/:id/status", updateApplicationStatus);
router.get("/:id/status", getApplicationStatus);
router.patch("/:id/status", updateApplicationStatus);
router.patch("/:id/archive", archiveApplication);
router.delete("/:id", deleteApplication);


module.exports = router;
