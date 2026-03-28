const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// --- Import ALL Routes ---
const authRouter = require("./routes/auth.routes");
const interviewRouter = require("./routes/interview.routes");
const jobRouter = require("./routes/job.routes");

const app = express();

// --- Middleware ---
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

// --- Mount ALL Routes ---
app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);
app.use("/api/jobs", jobRouter);

module.exports = app;