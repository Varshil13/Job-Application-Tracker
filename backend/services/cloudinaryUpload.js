
const cloudinary = require("../config/cloudinary")

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


module.exports = uploadToCloudinary;