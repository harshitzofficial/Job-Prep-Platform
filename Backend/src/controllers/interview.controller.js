const pdfParse = require("pdf-parse");
const { generateInterviewReport, generateResumePdf } = require("../services/ai.service");
const interviewReportModel = require("../models/interviewReport.model");
const { generateLiveQuestions, evaluateLiveInterview } = require("../services/ai.service");

// 🚀 Redis & Crypto for Caching
const redisClient = require("../config/redis");
const crypto = require("crypto"); 

/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */
async function generateInterViewReportController(req, res) {
    try {
        let resumeText = "";
        
        // Safely extract PDF text if a file was uploaded
        if (req.file && req.file.buffer) {
            const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText();
            resumeText = resumeContent.text;
        }

        const { selfDescription, jobDescription } = req.body;
        const userId = req.user.id;

        // 1. Create a unique "fingerprint" (hash) of this exact request
        const rawData = String(userId) + (resumeText || "") + (jobDescription || "") + (selfDescription || "");
        const cacheKey = `report_cache:${crypto.createHash('sha256').update(rawData).digest('hex')}`;

        // 2. CHECK REDIS FIRST (The Cost Saver!)
        const cachedData = await redisClient.get(cacheKey);
        
        if (cachedData) {
            console.log("⚡ CACHE HIT: Serving from Redis, saved Gemini API cost!");
            // Return early! Skips the AI call and the MongoDB save.
            return res.status(200).json({
                message: "Interview report fetched from cache instantly.",
                interviewReport: JSON.parse(cachedData)
            });
        }

        console.log("🐢 CACHE MISS: Calling Gemini API...");

        // 3. Call AI because Redis didn't have it
        const interViewReportByAi = await generateInterviewReport({
            resume: resumeText,
            selfDescription,
            jobDescription
        });

        // 4. Save the brand new report to MongoDB
        const interviewReport = await interviewReportModel.create({
            user: userId,
            resume: resumeText,
            selfDescription,
            jobDescription,
            ...interViewReportByAi
        });

        // 5. SAVE TO REDIS WITH 24-HOUR TTL (86400 seconds)
        // Next time they request this exact data, it hits Step 2!
        await redisClient.setEx(cacheKey, 86400, JSON.stringify(interviewReport));

        res.status(201).json({
            message: "Interview report generated successfully.",
            interviewReport
        });

    } catch (error) {
        console.error("Report Generation Error:", error);
        res.status(500).json({ message: "Failed to generate interview report." });
    }
}

/**
 * @description Controller to get interview report by interviewId.
 */
async function getInterviewReportByIdController(req, res) {
    const { interviewId } = req.params;

    const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id });

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        });
    }

    res.status(200).json({
        message: "Interview report fetched successfully.",
        interviewReport
    });
}

/** * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterviewReportsController(req, res) {
    const interviewReports = await interviewReportModel.find({ user: req.user.id })
        .sort({ createdAt: -1 })
        .select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan");

    res.status(200).json({
        message: "Interview reports fetched successfully.",
        interviewReports
    });
}

/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */
async function generateResumePdfController(req, res) {
    const { interviewReportId } = req.params;

    const interviewReport = await interviewReportModel.findById(interviewReportId);

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        });
    }

    const { resume, jobDescription, selfDescription } = interviewReport;

    const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription });

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
    });

    res.send(pdfBuffer);
}

/**
 * @description Controller to generate live interview questions based on user self description, resume and job description.
 */
const getLiveQuestionsController = async (req, res) => {
    try {
        const { jobDescription, selfDescription, resumeText, userCommand } = req.body; 
        
        const data = await generateLiveQuestions({ 
            jobDescription, 
            selfDescription, 
            resumeText, 
            userCommand
        });
        
        res.status(200).json(data);
    } catch (error) {
        console.error("Live Questions Error:", error); 
        res.status(500).json({ message: "Failed to generate live questions." });
    }
};

const evaluateInterviewController = async (req, res) => {
    try {
        const { transcript, jobDescription } = req.body;
        
        const data = await evaluateLiveInterview({ transcript, jobDescription });
        res.status(200).json(data);
    } catch (error) {
        console.error("Evaluation Error:", error);
        res.status(500).json({ message: "Failed to evaluate interview." });
    }
};

module.exports = { 
    generateInterViewReportController, 
    getInterviewReportByIdController, 
    getAllInterviewReportsController, 
    generateResumePdfController, 
    getLiveQuestionsController, 
    evaluateInterviewController 
};