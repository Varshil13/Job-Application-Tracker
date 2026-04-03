const fs = require("fs")


const { extractText } = require("./pdfParse");
const { extractFromResume } = require("./AIExtractor");

async function resumeParse(resumePath) {
    const resumeBuffer = fs.readFileSync(resumePath);
    const resumeText = await extractText(resumeBuffer);

    return await extractFromResume(resumeText);
}
module.exports = {
    resumeParse
}