// server ko create karna
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors"); // Cross-Origin Resource Sharing (CORS)

// --- RATE LIMITING IMPORTS ---
const rateLimit = require("express-rate-limit");
const { RedisStore } = require("rate-limit-redis");
const redisClient = require("./config/redis"); // Ensure this matches the path where you created redis.js

// --- Import ALL Routes ---
const authRouter = require("./routes/auth.routes");
const interviewRouter = require("./routes/interview.routes");
const jobRouter = require("./routes/job.routes");

const app = express();

// --- Middleware --- (Security Guards and Traffic Directors)
app.use(express.json());  // converts JSON strings to objects
app.use(cookieParser()); // translator for the cookies sent by a user's browser
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true // Allows the browser to send cookies along with those requests
}));

// --- Rate Limiter Configuration ---
const aiRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 requests per 15 minutes (adjust for production)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    
    // Store the request counts in Redis so all backend instances share the same limit
    store: new RedisStore({
        sendCommand: (...args) => redisClient.sendCommand(args),
    }),
    
    // The JSON response sent back when they hit the limit (HTTP 429)
    message: { 
        message: "You have reached your AI generation limit. Please try again in 15 minutes to allow others to use the service." 
    }
});

// --- Mount ALL Routes ---
// Auth does not get the strict AI rate limiter
app.use("/api/auth", authRouter);

app.use("/api/interview", interviewRouter);
app.use("/api/jobs", jobRouter); // Jobs is fine to keep limited if you want, or handle similarly.

module.exports = app;


/*
🧠 Why did we pass aiRateLimiter right inside app.js?
By putting aiRateLimiter right next to the router like 
app.use("/api/interview", aiRateLimiter, interviewRouter);
,Express knows to run the rate limiter first. 
If the user has exceeded their limit, the rate limiter intercepts 
the request, sends the 429 Error, and the request never even reaches
your interviewRouter.
*/