const {GoogleGenerativeAI} = require("@google/generative-ai");
const dotenv = require("dotenv")
dotenv.config();


const fs = require("fs")

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

const model = genAI.getGenerativeModel({
    model : "gemini-3-flash-preview"
})

function buildPrompt(text = ""){

    return  `Extract job posting information from the following text and return as JSON:

TEXT:
${text}

RETURN ONLY VALID JSON (no markdown, no explanation):
{
  "company": "company name",
  "position": "job title",
  "applicationDeadline": "deadline date (date month , year) or null",
  "eligibility": {
    "minGPA": "GPA requirement or null",
    "courses/degree":"degree requirements or null" 
    "branches": ["list of branches"],
    "year": "year requirement or null",
    "skills": ["list of required skills"],
    "experience": "experience requirement or null"
  },
  "salaryRange/stipend": "salary or null",
  "jobType": "full-time/part-time/internship",
  "portalLink": "link if mentioned or null",
  "applicationLink": "application URL or null"
}`

}
function cleanJSON(text){
  return text
    .replace(/```json\n?/g, "")
    .replace(/```\n?/g, "")
    .trim();
}

async function extractFromText(text){
    try {
        const prompt = buildPrompt(text)

        const result = await model.generateContent(prompt)
        const responseText = result.response.text()

        return JSON.parse(cleanJSON(responseText))

    }
    catch(err){
          console.error("Gemini Text Extraction Error:", err);
          throw new Error("Failed to extract data from text");
    }
}

//agar pdf parse zyada text nhi de paya toh poori file ka buffer bana kr gemini ko bhj do 
async function extractFromFile(filePath, mimeType = "application/pdf") {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const base64File = fileBuffer.toString("base64");

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType,
          data: base64File,
        },
      },
      buildPrompt(),
    ]);

    const responseText = result.response.text();

    return JSON.parse(cleanJSON(responseText));
  } catch (err) {
    console.error("Gemini File Extraction Error:", err);
    throw new Error("Failed to extract data from file");
  }

}

module.exports = {
    extractFromFile,
    extractFromText
}










