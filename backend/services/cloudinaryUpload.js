
const cloudinary = require("../config/cloudinary")
const crypto = require("crypto")
const dotenv = require("dotenv")
dotenv.config();
function encryptBuffer(fileBuffer) {
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    process.env.ENCRYPTION_KEY,
    process.env.ENCRYPTION_IV

  );
  return Buffer.concat([cipher.update(fileBuffer), cipher.final()])
}
async function uploadToCloudinary(fileBuffer) {

  const result = await new Promise((resolve, reject) => {

    const stream = cloudinary.uploader.upload_stream(
      { folder: "documents", resource_type: "" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    stream.end(fileBuffer);

  });

  return result;
}


module.exports = { uploadToCloudinary, encryptBuffer };