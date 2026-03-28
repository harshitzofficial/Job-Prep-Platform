const { getJobSearchQueryFromResume, fetchLiveJobs } = require("../services/job.service");
const interviewReportModel = require("../models/interviewReport.model");

async function searchJobsController(req, res) {
    try {
        const { location } = req.query;

        if (!location) {
            return res.status(400).json({ message: "Location is required." });
        }

        // 1. Get user's latest resume from their most recent report
        const latestReport = await interviewReportModel.findOne({ user: req.user.id })
            .sort({ createdAt: -1 })
            .select("resume");

        if (!latestReport) {
            return res.status(404).json({ message: "Please generate an interview report first so we can analyze your resume." });
        }

        // 2. Process with AI and Job API
        const searchQuery = await getJobSearchQueryFromResume(latestReport.resume);
        const jobs = await fetchLiveJobs(searchQuery, location);

        res.status(200).json({
            message: "Jobs fetched successfully",
            searchQuery,
            jobs
        });

    } catch (error) {
        res.status(500).json({ message: "Server error while searching jobs." });
    }
}

module.exports = { searchJobsController };