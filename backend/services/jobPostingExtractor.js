const fs = require("fs")


const { extractText, isProbablyScanned } = require("./pdfParse");
const { extractFromText, extractFromFile } = require("./AIExtractor");

async function jobPostingExtractor(filePath) {
  const pdfBuffer = fs.readFileSync(filePath); //reads from path and converts to binary data , pdf parse ko binary data chahiye hota hai , to humne buffer me store kar diya
  const text = await extractText(pdfBuffer);
  const isScanned = isProbablyScanned(text);

  if (!isScanned) {
    return await extractFromText(text);
  } else {
    return await extractFromFile(filePath);

  }
}


module.exports = { jobPostingExtractor };
