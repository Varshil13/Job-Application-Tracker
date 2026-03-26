
const cloudinary = require("../config/cloudinary")
const crypto = require("crypto")
const Doc = require("../models/docSchema")
const dotenv = require("dotenv")
dotenv.config();

function encryptBuffer(fileBuffer) {

  const key = crypto
    .createHash("sha256")
    .update(process.env.ENCRYPTION_KEY)
    .digest();        // ✅ always 32 bytes

  const iv = Buffer.from(process.env.ENCRYPTION_IV, "hex"); 
  // ✅ must be 16 bytes → 32 hex chars

  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    key,
    iv
  );

  return Buffer.concat([
    cipher.update(fileBuffer),
    cipher.final()
  ]);
}

async function uploadToCloudinary(fileBuffer) {

 

    const result = await new Promise((resolve, reject) => {
  
      const stream = cloudinary.uploader.upload_stream(
        { folder: "documents", resource_type: "raw" },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
  
      stream.end(fileBuffer);
  
    });
  
return result;

}

function decryptBuffer(encryptedBuffer) {

  const key = crypto
    .createHash("sha256")
    .update(process.env.ENCRYPTION_KEY)
    .digest();

  const iv = Buffer.from(process.env.ENCRYPTION_IV, "hex");

  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    key,
    iv
  );

  return Buffer.concat([
    decipher.update(encryptedBuffer),
    decipher.final()
  ]);
}



async function savetodb(result,req){

return await Doc.create({

  userId: req.user.id,   // ⭐ VERY IMPORTANT

  public_id: result.public_id,
  url: result.secure_url,
  resource_type: result.resource_type,

  mimeType: req.file.mimetype,
  originalName: req.file.originalname,
  size: result.bytes

})
}
module.exports = { uploadToCloudinary, encryptBuffer , decryptBuffer , savetodb};