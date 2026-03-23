
const openAI = require("openai")

const dotenv = require("dotenv")
dotenv.config();


const fs = require("fs")

const client = new openAI({
  apiKey: process.env.GROK_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
})


function buildPrompt(text = "") {

  return `Extract job posting information from the following text and return as JSON:

TEXT:
${text}

RETURN ONLY VALID JSON (no markdown, no explanation):
{
  "company": "company name",
  "position": "job title",
  "applicationDeadline": "deadline date (date month , year) or null",
  "eligibility": {
    "minGPA": "GPA requirement or null",
    "degree":"degree requirements or null" ,
    "branches": ["list of branches"],
    "year": "year requirement or null",
    "skills": ["list of required skills"],
    "experience": "experience requirement or null"
  },
  "salary": "salary/stipend or null",
  "jobType": "full-time/part-time/internship",
  "portalLink": "link if mentioned or null",
  "applicationLink": "application URL or null"
}`

}
function buildResumePrompt(resume = "") {
  return `Extract structured information from this resume.
  Resume : ${resume}
  Return JSON:
    {
      "skills": [],
        "projects": [],
          "experience": [],
            "education": []
    }

    Rules:
    - skills should be lowercase
      - avoid duplicates
        - be concise
          `;
}


function cleanJSON(text) {
  return text
    .replace(/```json\n ?/g, "")
    .replace(/```\n?/g, "")
    .trim();
}

async function extractFromText(data) {
  try {
    const prompt = buildPrompt(data.text);

    const result = await client.responses.create({
      model: "openai/gpt-oss-20b",
      input: prompt,
    });
    const responseText = result.output_text
    return JSON.parse(cleanJSON(responseText));


  }
  catch (err) {
    console.error("Gemini Text Extraction Error:", err);
    throw new Error("Failed to extract data from text");
  }
}

//agar pdf parse zyada text nhi de paya toh poori file ka buffer bana kr gemini ko bhj do 
async function extractFromFile(filePath, mimeType = "application/pdf") {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const base64File = fileBuffer.toString("base64");



    const result = await client.responses.create({
      model: "openai/gpt-oss-20b",
      input: [
        {
          inlineData: {
            mimeType,
            data: base64File,
          },
        },
        buildPrompt(),
      ],
    });

    const responseText = result.output_text;
    return JSON.parse(cleanJSON(responseText));

  } catch (err) {
    console.error("Gemini File Extraction Error:", err);
    throw new Error("Failed to extract data from file");
  }

}

// get required information from resume
async function extractFromResume(data) {
  try {
    const prompt = buildResumePrompt(data.text);
    const result = await client.responses.create({
      model: "openai/gpt-oss-20b",
      input: prompt
    });
    const responseText = result.output_text;
    return JSON.parse(cleanJSON(responseText));

  }
  catch (err) {
    console.error("Gemini Text Extraction Error:", err);
    throw new Error("Failed to extract data from text");
  }
}

async function analyseMatchResume(resumeJSON, jobJSON) {
  const prompt = `
You are an AI system that evaluates how well a candidate matches a job.

RESUME:
${JSON.stringify(resumeJSON)}

JOB:
${JSON.stringify(jobJSON)}

TASK:
Compare the resume with the job requirements and return a structured evaluation.

RULES:
- Focus mainly on skills, experience, and degree
- Be strict but fair
- skills comparison is most important
- consider partial matches
- return only JSON (no explanation)

OUTPUT FORMAT:
{
  "matchScore": number (0-100),
  "eligible": true/false,
  "strengths": [],
  "missingSkills": [],
  "summary": "",
  "suggestions": []
}
`;

  const result = await client.responses.create({
    model: "openai/gpt-oss-20b",
    input: prompt,
  });
  const text = result.output_text;

  return JSON.parse(cleanJSON(text));
}
module.exports = {
  extractFromFile,
  extractFromText,
  extractFromResume,
  analyseMatchResume
}










