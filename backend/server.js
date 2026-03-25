const express = require("express");
const multer = require("multer");
const cors = require("cors");
const cookieParser = require("cookie-parser")
const { jobPostingExtractor } = require("./services/jobPostingExtractor");
const { resumeParse } = require("./services/resumeExtractor");
const { analyseMatchResume } = require("./services/geminiExtractor");
const { connect } = require("mongoose");

const connectDB = require("./config/db");
// const User = require("./models/test");

const authRoutes = require("./routes/auth")
const { uploadToCloudinary, encryptBuffer, decryptBuffer } = require("./services/cloudinaryUpload");
const { decrypt } = require("dotenv");
const authMiddleware = require("./middleware/authmiddleware");

const app = express();
app.use(express.json());
const upload = multer({ dest: "uploads/" });
const uploadram = multer({ storage: multer.memoryStorage() });
//upload , multer ka object hai aur hamari file ka object bana dega meta data ke sath aur usko uploads folder me store kar dega
app.use(cors());
app.use(cookieParser());

connectDB();

app.use("/auth",authRoutes)

app.post("/uploadfile", uploadram.single("file"), async (req, res) => {

  try{
   
    const buffer = req.file.buffer;
    const encryptedBuffer = encryptBuffer(buffer);
  
    
    
  
    const result = await uploadToCloudinary(encryptedBuffer);
  
    console.log(result);

  }
  catch(err){
        console.error("UPLOAD ERROR:", err);

    res.status(500).json({
      success: false,
      message: err.message
    });

  }
  
});

app.get("/getfile" ,authMiddleware ,async(req,res)=>{
  try{
    const fileUrl = req.query.url;

    if(!fileUrl){
      return res.status(400).json({
        success : false,
        message : "File Url Reqired"
      })
    }

    const response = await fetch(fileUrl)

    if(!response.ok){
      throw new Error("Filed to download file from Cloudinary")

    }

    const arrayBuffer = await response.arrayBuffer();
    const encryptedBuffer = Buffer.from(arrayBuffer)

    const originalBuffer = decryptBuffer(encryptedBuffer)
    res.setHeader(
      "content-Disposition",
      "attachment; fimename = file "
    )

    res.send(originalBuffer)

  }
  catch (err){
    console.error("Download Error:",err)

    res.status(500).json({
      success : false,
      message : err.message
    })
  }
})

// app.get("/insert", async (req, res) => {
//   const newUser = new User({
//     username: "varshil",
//     password: "1234",
//   });

//   await newUser.save();

//   res.send("User Inserted");
// });

app.post("/upload", upload.single("pdf"), async (req, res) => {
  const filePath = req.file.path;

  try {
    console.log("Extracting information from the job posting...");
    const result = await jobPostingExtractor(filePath);
    console.log(result);
    res.json(result);
  } catch (err) {
    res.status(500).json({
      error: "Extraction Failed",
    });
  }
});
app.post("/resume/parse", upload.single("pdf"), async (req, res) => {
  const filePath = req.file.path;
  try {
    const result = await resumeParse(filePath);
    console.log("Extracting information from the resume...");
    console.log(result);
    res.json(result);
  } catch (err) {
    res.status(500).json({
      error: "Extraction Failed",
    });
  }
});
app.post("/match", async (req, res) => {
  try {
    const { resumeJSON, jobJSON } = req.body;
    const result = await analyseMatchResume(resumeJSON, jobJSON);
    console.log(result);
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Match failed",
    });
  }
});
app.listen(5000, () => console.log("Server running on 5000"));
