const express = require("express")

const router = express.Router()
const authMiddleware = require("../middleware/authmiddleware");
const { downloadDoc, getDocs, renameDoc, deleteDoc } = require("../controllers/docController");
router.get('/download/:id', authMiddleware, downloadDoc);
router.get("/documents", authMiddleware, getDocs);
router.patch("/rename/:id", authMiddleware, renameDoc);
router.delete("/delete/:id", authMiddleware, deleteDoc);
module.exports = router