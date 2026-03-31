const { GoogleGenAI } = require("@google/genai");
const axios = require("axios");

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY });

async function getJobSearchQueryFromResume(resumeText) {
    try {
        const prompt = `Analyze this resume and provide exactly ONE highly accurate job search query (e.g., "React Developer" or "Data Scientist"). 
        Return ONLY the job title string. No explanations.
        Resume: ${resumeText}`;

        const response = await ai.getGenerativeModel({ model: "gemini-2.0-flash" })
            .generateContent(prompt);

        return response.response.text().trim();
    } catch (error) {
        console.error("AI Keyword Extraction Error:", error);
        return "Software Engineer"; // Fallback
    }
}

async function fetchLiveJobs(searchQuery, location) {
    try {
        const options = {
            method: 'GET',
            url: 'https://jsearch.p.rapidapi.com/search',
            params: {
                query: `${searchQuery} in ${location}`,
                page: '1',
                num_pages: '1'
            },
            headers: {
                'X-RapidAPI-Key': process.env.RAPIDAPI_KEY, // Set this in your .env!
                'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
            }
        };

        const response = await axios.request(options);
        return response.data.data; 
    } catch (error) {
        console.error("Job API Error:", error);
        throw new Error("External Job API failed");
    }
}

module.exports = { getJobSearchQueryFromResume, fetchLiveJobs };