const express = require("express");
const multer = require("multer");
const cors = require("cors");
const cookieParser = require("cookie-parser")
const { jobPostingExtractor } = require("./services/jobPostingExtractor");
const { resumeParse } = require("./services/resumeExtractor");
const { analyseMatchResume, extractFromText } = require("./services/AIExtractor");

const fs = require("fs")


const connectDB = require("./config/db");


const authRoutes = require("./routes/auth")
const docRoutes = require("./routes/doc")
const applicationRoutes = require("./routes/application")
const reminderRoutes = require("./routes/reminder")
const { uploadToCloudinary, encryptBuffer, decryptBuffer, savetodb } = require("./services/cloudinaryUpload");
const { startReminderScheduler } = require("./services/reminderScheduler");

const authMiddleware = require("./middleware/authmiddleware");

const app = express();
app.use(express.json());


const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 10 * 1024 * 1024 }
});


const uploadram = multer({ storage: multer.memoryStorage() });

//upload , multer ka object hai aur hamari file ka object bana dega meta data ke sath aur usko uploads folder me store kar dega
app.use(cors({
  origin: `${process.env.FRONTEND_URL}`,
  credentials: true
}));


app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  next();
});


app.use(cookieParser());

connectDB();

app.use("/auth", authRoutes);
app.use("/docs", authMiddleware, docRoutes);

app.use("/applications", authMiddleware, applicationRoutes)
app.use("/reminders", authMiddleware, reminderRoutes)
app.post("/uploadfile", authMiddleware, uploadram.single("file"), async (req, res) => {

  try {

    const buffer = req.file.buffer;

    const encryptedBuffer = encryptBuffer(buffer);
    const result = await uploadToCloudinary(encryptedBuffer);



    const savedresult = await savetodb(result, req);

    res.status(201).json({
      success: true,
      message: req.body.docName + " Saved Successfully"
    })

  }
  catch (err) {
    console.error("UPLOAD ERROR:", err);

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

});




app.get("/getfile", authMiddleware, async (req, res) => {
  try {
    const fileUrl = req.query.url;

    if (!fileUrl) {
      return res.status(400).json({
        success: false,
        message: "File Url Reqired"
      })
    }

    const response = await fetch(fileUrl)

    if (!response.ok) {
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
  catch (err) {
    console.error("Download Error:", err)

    res.status(500).json({
      success: false,
      message: err.message
    })
  }
})



app.post("/upload", authMiddleware, upload.single("pdf"), async (req, res) => {
  const filePath = req.file?.path;

  try {
    const result = await jobPostingExtractor(filePath);
    res.json(result);
  } catch (err) {
    res.status(500).json({
      error: "Extraction Failed",
    });
  }
  finally {
    if (filePath) {
      fs.unlink(filePath, (err) => {        // ✅ deletes file after job is done
        if (err) console.error("Failed to delete file:", err);
      });
    }
  }
});

app.post("/upload/text", authMiddleware, async (req, res) => {
  const { text } = req.body;

  if (!text || !String(text).trim()) {
    return res.status(400).json({ error: "Job details text is required" });
  }

  try {
    const result = await extractFromText({ text: String(text) });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Extraction Failed" });
  }
});


app.post("/resume/parse", authMiddleware, upload.single("pdf"), async (req, res) => {
  const filePath = req.file?.path;
  try {
    const result = await resumeParse(filePath);
    res.json(result);
  } catch (err) {
    res.status(500).json({
      error: "Extraction Failed",
    });
  }
  finally {
    if (filePath) {
      fs.unlink(filePath, (err) => {        // ✅ deletes file after job is done
        if (err) console.error("Failed to delete file:", err);
      });
    }
  }
});



app.post("/match", authMiddleware, async (req, res) => {
  try {
    const { resumeJSON, jobJSON } = req.body;
    const result = await analyseMatchResume(resumeJSON, jobJSON);
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Match failed",
    });
  }
});
app.listen(5000, () => console.log("Server running on 5000"));
startReminderScheduler();
