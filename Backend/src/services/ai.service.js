const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");
const puppeteer = require("puppeteer");
const crypto = require("crypto");
const redisClient = require("../config/redis"); // Make sure you created this file!

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
});

// Helper function to create a unique fingerprint of the user's inputs
function generateCacheKey(prefix, resume, selfDescription, jobDescription) {
    // Combine inputs into one string, then hash it so it's a short, unique string
    const combinedString = `${resume}|${selfDescription}|${jobDescription}`;
    const hash = crypto.createHash('sha256').update(combinedString).digest('hex');
    return `${prefix}:${hash}`;
}

// this is the schema for the interview report
const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job describe"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The behavioral question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum(["low", "medium", "high"]).describe("The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances")
    })).describe("List of skill gaps in the candidate's profile along with their severity"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."),
        tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.")
    })).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively"),
    title: z.string().describe("The title of the job for which the interview report is generated"),
});

const liveQuestionsSchema = z.object({
    questions: z.array(z.string()).length(3)
});

const evaluationSchema = z.object({
    score: z.number().describe("An overall score out of 10 for the user's performance."),
    feedback: z.string().describe("A professional, constructive paragraph summarizing how they did."),
    strengths: z.array(z.string()).describe("1-2 things the user answered well."),
    improvementAreas: z.array(z.string()).describe("1-2 specific technical or behavioral areas to improve.")
});

// SIMPLIFIED: Just call Gemini and return the data. The Controller handles the caching!
async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    console.log("🧠 Calling Gemini AI for Report...");
    
    const prompt = `Generate an interview report for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}`;

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview", // Note: Ensure this model string is still valid in your environment
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(interviewReportSchema),
        }
    });

    return JSON.parse(response.text);
}

async function generatePdfFromHtml(htmlContent) {
    let browser = null;
    try {
        browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        const page = await browser.newPage();
        await page.setContent(htmlContent, { waitUntil: "networkidle0" });

        const pdfBuffer = await page.pdf({
            format: "A4", 
            margin: {
                top: "20mm",
                bottom: "20mm",
                left: "15mm",
                right: "15mm"
            }
        });

        return pdfBuffer;
    } finally {
        // Crucial for preventing memory leaks if PDF generation fails
        if (browser) await browser.close(); 
    }
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
    // Note: We cache the HTML generation, because that's the expensive AI part.
    // We still let Puppeteer generate a fresh PDF buffer from the cached HTML.
    const cacheKey = generateCacheKey("resume_html", resume, selfDescription, jobDescription);
    let jsonContent;

    // 1. Check Redis Cache First
    try {
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
            console.log("⚡ Serving Resume HTML from Redis Cache!");
            jsonContent = JSON.parse(cachedData);
        }
    } catch (err) {
        console.warn("⚠️ Redis Read Error:", err);
    }

    // 2. If not in cache, call AI
    if (!jsonContent) {
        console.log("🧠 Cache Miss: Calling Gemini AI for Resume HTML...");
        const resumePdfSchema = z.object({
            html: z.string().describe("The HTML content of the resume which can be converted to PDF using any library like puppeteer")
        });

        const prompt = `Generate resume for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                        The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                        The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                        you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                        The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                        The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.`;

        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: zodToJsonSchema(resumePdfSchema),
            }
        });

        jsonContent = JSON.parse(response.text);

        // Save AI HTML to Redis
        try {
            await redisClient.setEx(cacheKey, 86400, JSON.stringify(jsonContent));
        } catch (err) {
            console.warn("⚠️ Redis Write Error:", err);
        }
    }

    // 3. Generate the PDF buffer
    const pdfBuffer = await generatePdfFromHtml(jsonContent.html);

    return pdfBuffer;
}

const generateLiveQuestions = async ({ jobDescription, selfDescription, resumeText, userCommand }) => {
    try {
        // Log inputs to make sure they aren't empty
        console.log("Checking inputs...", { hasResume: !!resumeText, hasJob: !!jobDescription });

        const prompt = `You are a professional interviewer. 
        Instruction: "${userCommand || "General interview"}"
        Resume: ${resumeText}
        Job: ${jobDescription}
        Generate exactly 3 questions in JSON format.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash", // 🚀 2026 Stable Model Name
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: zodToJsonSchema(liveQuestionsSchema),
            }
        });

        const text = response.text;
        console.log("AI Response received:", text);

        return JSON.parse(text);

    } catch (error) {
        // This will tell us if it's a Zod error, a Google error, or a Code error
        console.error("DETAILED AI ERROR:", error);
        throw error;
    }
};

const evaluateLiveInterview = async ({ transcript, jobDescription }) => {
    const prompt = `You are a hiring manager evaluating a candidate's live interview. 
    Review the following transcript of Questions and the Candidate's spoken Answers. 
    Be highly critical but constructive. Score them out of 10 based on clarity, technical accuracy, and confidence.
    
    Target Job: ${jobDescription}
    Interview Transcript: ${JSON.stringify(transcript)}`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(evaluationSchema),
        }
    });

    return JSON.parse(response.text);
};

module.exports = { generateInterviewReport, generateResumePdf,generateLiveQuestions,evaluateLiveInterview};


/*
You'll notice I used Redis to cache the HTML output from Gemini, rather than caching the raw PDF file buffer.
Why? Because storing binary files (like PDFs) in Redis can eat up memory very quickly. The AI text generation
is the part that takes 10+ seconds and costs money. Puppeteer is free and takes ~1 second. Caching the HTML is 
the perfect balance of saving money and keeping Redis lightning fast!
*/