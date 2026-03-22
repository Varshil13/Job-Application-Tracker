const fs = require("fs")
const pdf = require("pdf-parse");

const { extractText } = require("./pdfParse");
const { extractFromResume } = require("./geminiExtractor");

async function resumeParse(resumePath) {
    const resumeBuffer = fs.readFileSync(resumePath);
    const resumeText = await extractText(resumeBuffer);

    return await extractFromResume(resumeText);
}
module.exports = {
    resumeParse
}