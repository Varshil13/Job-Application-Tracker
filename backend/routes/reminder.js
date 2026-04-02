const express = require("express");
const { getReminderState, updateReminderState } = require("../controllers/reminderController");

const router = express.Router();

router.get("/:jobId", getReminderState);
router.patch("/:jobId", updateReminderState);

module.exports = router;
