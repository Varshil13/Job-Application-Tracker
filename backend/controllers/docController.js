const Doc = require("../models/docSchema");
const { decryptBuffer } = require("../services/cloudinaryUpload");
async function downloadDoc(req, res) {
    try {
        const doc = await Doc.findOne({ _id: req.params.id, userId: req.user.id });
        if (!doc) return res.status(404).json({ error: "File not found or unauthorized" });
        const response = await fetch(doc.url);
        if (!response.ok) {
            throw new Error(`Failed to fetch from Cloudinary: ${response.statusText}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        const encryptedBuffer = Buffer.from(arrayBuffer);
        const decryptedBuffer = decryptBuffer(encryptedBuffer);
        res.setHeader('Content-Type', doc.mimeType);
        res.setHeader('Content-Disposition', `attachment; filename="${doc.originalName}"`);
        res.send(decryptedBuffer);
    } catch (err) {
        console.error("DOWNLOAD ERROR:", err);
        res.status(500).json({ error: "Download failed" });
    }
}
async function getDocs(req, res) {
    try {
        const userId = req.user.id;
        const docs = await Doc.find({ userId }).sort({ uploadedAt: -1 });
        res.status(200).json(docs);
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to retreive documents"
        })
    }
}
async function renameDoc(req, res) {
    const { id } = req.params;
    const { docName } = req.body;
    if (!docName || !docName.trim()) {
        return res.status(400).json({
            message: "Name cannot be empty"
        })
    }
    try {
        const updatedDoc = await Doc.findByIdAndUpdate(
            id,
            { docName: docName.trim() },
            { new: true }

        );
        if (!updatedDoc) {
            return res.status(404).json({
                error: "Document not found"
            })
        }
        res.status(200).json(updatedDoc);
    } catch (err) {
        console.error("Rename error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
}
async function deleteDoc(req, res) {
    const { id } = req.params;
    try {
        const doc = await Doc.findByIdAndDelete(id);
        if (!doc) return res.status(404).json({ error: "Document not found" });
        res.status(200).json({ message: "Document deleted successfully" });
    } catch (err) {
        console.error("Delete error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
}
module.exports = { downloadDoc, getDocs, renameDoc, deleteDoc }