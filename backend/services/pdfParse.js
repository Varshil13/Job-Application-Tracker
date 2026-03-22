// buffer denge fir uss se ye text nikaldega 

const pdf = require("pdf-parse");

async function extractText(pdfBuffer) {

    try{
        const data = await pdf(pdfBuffer);
        return  {
            text: data.text,
            pages: data.numpages,
            textLength : data.text.length
        }
    }

    catch (err){
        console.error("PDF PARSE ERROR:", err)
        throw new Error("Failed to parse PDF text")
    }
}

function isProbablyScanned(extractedData){
    const textLines = extractedData.text.split("\n").filter(line => line.trim().length > 0)
    return textLines.length < 5;
}

module.exports={
    extractText,
    isProbablyScanned
}
