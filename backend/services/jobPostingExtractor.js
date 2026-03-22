const fs = require("fs")
const pdf = require("pdf-parse");

const PDFParser = require("./pdfParse");

const { extractText, isProbablyScanned } = require("./pdfParse");
const { extractFromText, extractFromFile } = require("./geminiExtractor");

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
