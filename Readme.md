<div align="center">

# 🤖 Interview AI Pro

<br/>

**Elevate your career with AI. Instantly generate bespoke interview strategies, targeted questions, and actionable preparation roadmaps based on your resume and target job description.**

<br/>

[🚀 Quick Start](#-quick-start) · [✨ Features](#-features) · [🏗️ Architecture](#️-architecture) · [📖 How It Works](#-how-it-works) · [🤝 Contributing](#-contributing)

<br/>

<img width="1919" height="917" alt="image" src="https://github.com/user-attachments/assets/b00a0ea7-cce3-4be0-a9b3-2cda5ab55978" />


</div>

---

## 📋 Table of Contents

- [About The Project](#-about-the-project)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#️-architecture)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Configuration](#️-configuration)
- [How It Works](#-how-it-works)
- [Contributing](#-contributing)
- [Roadmap](#️-roadmap)
- [License](#-license)

---

## 🎯 About The Project

**Interview AI Pro** is an advanced, full-stack application that acts as your personal interview coach. Built with **React + Vite** on the frontend and **Node.js + Express** on the backend, it bridges the gap between your career history and the job you want. 

By simply uploading your resume and pasting a job description, the application uses **Google's Gemini AI** to logically map your skills to the requirements, generate a match score, formulate targeted technical and behavioral questions, and instantly build a day-by-day study roadmap.

This project is a perfect showcase of combining modern frontend glassmorphism design with powerful backend AI schemas and PDF generation.

---

## ✨ Features

| Feature | Description |
|---|---|
| 📄 **Smart Resume Parsing** | Extracts and analyzes text directly from uploaded PDF and DOCX files. |
| 🎯 **Targeted Strategy** | Generates custom technical and behavioral questions specifically relevant to the candidate and role. |
| 📊 **Match Scoring** | Instantly evaluates how well your profile aligns with the job description. |
| ⚡ **Actionable Roadmaps** | Creates comprehensive, day-by-day preparation plans based on identified skill gaps. |
| 🖨️ **AI Resume Builder** | Re-formats and generates ATS-friendly, highly professional resumes exported as PDFs via Puppeteer. |
| 🎨 **Premium Glassmorphism UI** | A sleek, responsive, dark-themed design built with modern SCSS techniques. |
| 🛡️ **Structured Output** | Uses Zod schemas to ensure the AI always returns exact, predictable JSON responses. |

---

## 🛠 Tech Stack

### Frontend
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-Latest-646CFF?style=flat-square&logo=vite&logoColor=white)
![SCSS](https://img.shields.io/badge/SCSS-CC6699?style=flat-square&logo=sass&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat-square&logo=javascript&logoColor=black)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-LTS-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.x-000000?style=flat-square&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google_GenAI-API-4285F4?style=flat-square&logo=google&logoColor=white)
![Puppeteer](https://img.shields.io/badge/Puppeteer-PDFs-40B5A4?style=flat-square&logo=puppeteer&logoColor=white)

---

## 🏗️ Architecture

```
┌───────────────────────────────────────────────────────────────┐
│                         USER BROWSER                          │
│                                                               │
│   ┌────────────────────────────────────────────────────────┐  │
│   │            React Frontend  (Vite + SCSS)               │  │
│   │   Provides Job Description, Resume & Self Description  │  │
│   └───────────────────────┬────────────────────────────────┘  │
│                           │  HTTP / REST API (Axios)          │
└───────────────────────────┼───────────────────────────────────┘
                            │
                            ▼
┌───────────────────────────────────────────────────────────────┐
│              Node.js + Express Backend                        │
│                                                               │
│   ┌───────────────┐  ┌───────────────┐  ┌─────────────────┐   │
│   │ Multer + PDF  │  │  Controllers  │  │   AI Service    │   │
│   │ Parser        │→ │  Business     │→ │  ai.service.js  │   │
│   │ (Uploads)     │  │  Logic        │  │  (Zod + Gemini) │   │
│   └───────────────┘  └───────┬───────┘  └───────┬─────────┘   │
└─────────────────────────────── │─────────────── │─────────────┘
                                 │                │  HTTPS
                                 ▼                ▼
                     ┌──────────────────┐ ┌─────────────────────────┐
                     │   MongoDB        │ │   Google Gemini API     │
                     │   (DB Storage)   │ │  gemini-3-flash-preview │
                     └──────────────────┘ └─────────────────────────┘
```

### Data Flow

1. User uploads a Resume (`.pdf` / `.docx`) and inputs a Target Job Description in the React UI.
2. Frontend sends a `POST` request with the configuration to the Express backend.
3. Backend extracts the text from the uploaded file using `pdf-parse`.
4. The `ai.service.js` constructs a prompt with the parsed details alongside strict **Zod** schema instructions.
5. The Gemini API analyzes the profile vs. job description and returns a validated JSON response.
6. The Backend stores the response in MongoDB and sends it back to the Frontend.
7. The Frontend dynamically renders the preparation plan, skill gaps, and custom questions.

1. User Input
   ├─ Upload Resume (PDF/DOCX)
   ├─ Enter Job Description
   └─ Provide Self Assessment
        │
        ▼
2. Frontend Processing
   └─ Validate inputs
   └─ Create FormData
        │
        ▼
3. Backend Processing
   ├─ Receive and validate file
   ├─ Parse resume text
   ├─ Extract information
        │
        ▼
4. AI Processing (Gemini)
   ├─ Send structured prompt
   ├─ Apply Zod schema validation
   ├─ Get guaranteed JSON response
        │
        ▼
5. Data Generation
   ├─ Match Score Calculation
   ├─ Skill Gap Analysis
   ├─ Question Generation
   ├─ Roadmap Creation
        │
        ▼
6. Storage & Response
   ├─ Store in MongoDB
   ├─ Generate PDF Resume
   ├─ Return to Frontend
        │
        ▼
7. User Display
   └─ Dashboard Results Visualization

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18 or higher — [Download](https://nodejs.org/)
- **npm** v9 or higher (bundled with Node.js)
- A **Google Gemini API key** (free) → [Get one here](https://aistudio.google.com/app/apikey)
- A **MongoDB URI** (free cluster via MongoDB Atlas)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/harshitzofficial/Job-Prep-Platform.git
cd interview-ai-yt-main

# 2. Set up the Backend
cd Backend
npm install

# 3. Configure your environment variables
# Create a .env file and add your credentials (see Configuration section below)
cp .env.example .env

# 4. Start the backend server
npm run dev
# ✅ Backend running at http://localhost:3000

# 5. Open a new terminal — set up the Frontend
cd ../Frontend
npm install

# 6. Start the frontend dev server
npm run dev
# ✅ Frontend running at http://localhost:5173
```

### Verify It's Working

Open [http://localhost:5173](http://localhost:5173) in your browser. You should see the Interview AI Pro home screen.

---

## 📁 Project Structure

```
interview-ai-yt-main/
│
├── 📂 Backend/
│   ├── src/
│   │   ├── config/                 # Database configuration
│   │   ├── controllers/            # API Route logic
│   │   ├── middleware/             # Auth & Error handling
│   │   ├── models/                 # Mongoose Schemas (User, Blacklist, etc.)
│   │   ├── routes/                 # Express Router configs
│   │   └── services/
│   │       └── ai.service.js       # 🧠 Core AI & schema integration
│   ├── server.js                   # Express application entry point
│   ├── .env                        # Environment variable configuration
│   └── package.json
│
└── 📂 Frontend/
    ├── src/
    │   ├── features/               # Modularized feature directories (Auth, Interview, Public)
    │   │   ├── auth/
    │   │   ├── interview/          # Home/Dashboard & Interview results views
    │   │   └── public/             # Landing page components
    │   ├── style/                  # Global SCSS style definitions
    │   ├── components/             # Reusable global components (Navbar, Footer, etc.)
    │   ├── app.routes.jsx          # React Router configurations
    │   ├── App.jsx                 # Main layout & context providers
    │   └── main.jsx                # Vite entry point
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## ⚙️ Configuration

### Backend — `.env`

Create a `.env` file inside the `Backend/` directory:

```env
# ── Server ──────────────────────────────────────────────────
PORT=3000
NODE_ENV=development

# ── Database ────────────────────────────────────────────────
MONGODB_URI=your_mongodb_connection_string

# ── Authentication ──────────────────────────────────────────
JWT_SECRET=your_jwt_secret_key

# ── AI Provider ─────────────────────────────────────────────
GOOGLE_GENAI_API_KEY=your_google_gemini_api_key_here
```

> ⚠️ **Never commit your `.env` file.**

---

## 🧠 How It Works

### Structured AI Outputs with Zod (`ai.service.js`)

Unlike standard AI text generation, **Interview AI Pro** ensures 100% predictable integration by combining the `@google/genai` library with **Zod** schema translation to enforce strict JSON output formatting:

```javascript
const interviewReportSchema = z.object({
    matchScore: z.number(),
    technicalQuestions: z.array(z.object({
        question: z.string(),
        intention: z.string(),
        answer: z.string()
    })),
    // ... Additional schema definitions
});

const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
        responseMimeType: "application/json",
        responseSchema: zodToJsonSchema(interviewReportSchema),
    }
});
```
This powerful configuration guarantees your React frontend never breaks due to invalidly formatted strings.

---

## 🤝 Contributing

Contributions are what make the open-source community great. Any contribution you make is **hugely appreciated**!

1. **Fork** the repository
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add some AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a **Pull Request**

---

## 🗺️ Roadmap

- [x] Integrate Google Gemini Flash for Interview Generation
- [x] Setup Zod Schema Validation for AI Outputs
- [x] Complete the Glassmorphism Frontend Layout
- [x] Resume Parsing via PDF-parse
- [x] Automated Resume Generation via Puppeteer
- [ ] Add Mock Audio/Video Interviews
- [ ] Implement LeetCode-style Code Execution environments
- [ ] Add real-time WebSocket integrations for peer interviews

---

## 📄 License

Distributed under the ISC License. 

---

<div align="center">

Made with ❤️ by Harshit Singh

⭐ If this project helped you, please give it a star — it really helps!

</div>
