const express = require("express");
const multer = require("multer");

const cors = require("cors");
const { jobPostingExtractor } = require("./services/jobPostingExtractor");

const app = express();
const upload = multer({ dest: "uploads/" });
//upload , multer ka object hai aur hamari file ka object bana dega meta data ke sath aur usko uploads folder me store kar dega
app.use(cors());

app.post("/upload", upload.single("pdf"), async (req,res)=>{

    const filePath = req.file.path

    try{

        const result = await jobPostingExtractor(filePath)
        console.log(result)
        res.json({
            message:"Information Extracted Successfully"
        })
        
    }
    catch(err){
        res.status(500).json({
            error:"Extraction Failed"
        })
    }






})

app.listen(5000, () => console.log("Server running on 5000"));

