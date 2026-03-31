const express = require("express")
const authMiddleware = require("../middlewares/auth.middleware")
const interviewController = require("../controllers/interview.controller")
const upload = require("../middlewares/file.middleware")

// --- RATE LIMITING IMPORTS ---
const rateLimit = require("express-rate-limit");
const { RedisStore } = require("rate-limit-redis");
const redisClient = require("../config/redis");

const interviewRouter = express.Router()

// --- Define the AI Rate Limiter ---
const aiRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 requests per 15 minutes (adjust for production)
    standardHeaders: true,
    legacyHeaders: false,
    store: new RedisStore({
        sendCommand: (...args) => redisClient.sendCommand(args),
    }),
    message: { 
        message: "You have reached your AI generation limit. Please try again in 15 minutes." 
    }
});

/**
 * @route POST /api/interview/
 * @description generate new interview report on the basis of user self description,resume pdf and job description.
 * @access private
 */
// 🚨 Applied aiRateLimiter here!
interviewRouter.post("/", authMiddleware.authUser, aiRateLimiter, upload.single("resume"), interviewController.generateInterViewReportController)

/**
 * @route GET /api/interview/report/:interviewId
 * @description get interview report by interviewId.
 * @access private
 */
// ✅ No rate limiter! Users can view old reports freely.
interviewRouter.get("/report/:interviewId", authMiddleware.authUser, interviewController.getInterviewReportByIdController)

/**
 * @route GET /api/interview/
 * @description get all interview reports of logged in user.
 * @access private
 */
// ✅ No rate limiter! Users can view their dashboard freely.
interviewRouter.get("/", authMiddleware.authUser, interviewController.getAllInterviewReportsController)

/**
 * @route POST /api/interview/resume/pdf/:interviewReportId
 * @description generate resume pdf on the basis of user self description, resume content and job description.
 * @access private
 */
// 🚨 Applied aiRateLimiter here too, since generating the HTML uses Gemini!
interviewRouter.post("/resume/pdf/:interviewReportId", authMiddleware.authUser, aiRateLimiter, interviewController.generateResumePdfController)

/**
 * @route POST /api/interview/live/questions
 * @description Generate 3 questions for the live audio interview
 */
interviewRouter.post("/live/questions", authMiddleware.authUser, interviewController.getLiveQuestionsController);

/**
 * @route POST /api/interview/live/evaluate
 * @description Grade the final Q&A transcript
 */
interviewRouter.post("/live/evaluate", authMiddleware.authUser, interviewController.evaluateInterviewController);

/**
 * @route POST /api/interview/live/questions
 * @description Generate 3 questions for the live audio interview
 */
// 🚨 Added aiRateLimiter here!
interviewRouter.post("/live/questions", authMiddleware.authUser, aiRateLimiter, interviewController.getLiveQuestionsController);

/**
 * @route POST /api/interview/live/evaluate
 * @description Grade the final Q&A transcript
 */
// 🚨 Added aiRateLimiter here too!
interviewRouter.post("/live/evaluate", authMiddleware.authUser, aiRateLimiter, interviewController.evaluateInterviewController);

module.exports = interviewRouter