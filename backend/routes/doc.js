const express = require("express")

const router = express.Router()

const { downloadDoc, getDocs, renameDoc, deleteDoc } = require("../controllers/docController");
router.get('/download/:id', downloadDoc);
router.get("/documents", getDocs);
router.patch("/rename/:id", renameDoc);
router.delete("/delete/:id", deleteDoc);
module.exports = router