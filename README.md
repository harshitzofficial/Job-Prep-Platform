<div align="center">

# 🤖 Interview AI

<br/>

**Practice job interviews with an intelligent AI that asks real questions, evaluates your answers, and gives you actionable feedback — all for free.**

<br/>

[🚀 Quick Start](#-quick-start) · [✨ Features](#-features) · [🏗️ Architecture](#️-architecture) · [📖 Documentation](#-api-documentation) · [🤝 Contributing](#-contributing)

<br/>

![Interview AI Demo](<img width="1919" height="919" alt="image" src="https://github.com/user-attachments/assets/d5aa1741-3133-4eb1-b9ff-16eb2d63dc08" />)

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
- [API Documentation](#-api-documentation)
- [How It Works](#-how-it-works)
- [Contributing](#-contributing)
- [Roadmap](#️-roadmap)
- [License](#-license)

---

## 🎯 About The Project

**Interview AI** is a full-stack web application that simulates real job interviews using large language models (LLMs). Built with **React + Vite** on the frontend and **Node.js + Express** on the backend, it lets you:

- Select a job role and interview topic
- Receive AI-generated, role-specific interview questions
- Submit your answers and get the next question — just like a real interview
- Receive comprehensive AI feedback and a performance summary at the end

This project was created as part of a **YouTube tutorial series** to teach developers how to build production-quality AI applications from scratch. It's a perfect learning resource covering React, Express, SCSS, and LLM API integration all in one place.

> 💡 **Tutorial Series:** Follow along on YouTube with [Ankur Prajapati](https://github.com/ankurdotio) to build this project step by step.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🧠 **AI Interview Simulation** | Multi-turn interview conversations powered by Google Gemini or OpenAI GPT |
| 🎯 **Role-Specific Questions** | Tailored questions for Software Engineer, Data Analyst, Product Manager, and more |
| 📊 **Real-Time Evaluation** | Your answers are instantly evaluated; the AI adapts its follow-up questions |
| 💬 **Chat-Style Interface** | Clean, intuitive chat UI that mirrors real interview messaging apps |
| 📝 **End-of-Session Feedback** | Detailed AI summary covering strengths, weaknesses, and improvement tips |
| 🎨 **Polished SCSS UI** | Responsive, dark-themed design with smooth animations |
| 🔒 **Secure API Proxy** | All AI calls go through the backend — your API key is never exposed to the browser |
| ⚡ **Vite-Powered Frontend** | Lightning-fast hot module replacement for a smooth development experience |

---

## 🛠 Tech Stack

### Frontend
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-Latest-646CFF?style=flat-square&logo=vite&logoColor=white)
![SCSS](https://img.shields.io/badge/SCSS-CC6699?style=flat-square&logo=sass&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat-square&logo=javascript&logoColor=black)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-LTS-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat-square&logo=express&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google_Gemini-AI-4285F4?style=flat-square&logo=google&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI_GPT-412991?style=flat-square&logo=openai&logoColor=white)

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                            │
│                                                                 │
│   ┌──────────────────────────────────────────────────────────┐  │
│   │            React Frontend  (Vite + SCSS)                 │  │
│   │   Components / Pages / Services / SCSS Styles            │  │
│   └────────────────────────┬─────────────────────────────────┘  │
│                            │  HTTP / REST API                   │
└────────────────────────────┼────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              Node.js + Express Backend                          │
│                                                                 │
│   ┌──────────────┐  ┌───────────────┐  ┌──────────────────┐     │
│   │    Routes    │→ │  Controllers  │→ │   AI Service     │     │
│   │  /api/inter  │  │  Business     │  │  ai.service.js   │     │
│   │   view/*     │  │  Logic        │  │  (Gemini/OpenAI) │     │
│   └──────────────┘  └───────────────┘  └────────┬─────────┘     │
└──────────────────────────────────────────────── │───────────────┘
                                                  │  HTTPS
                                                  ▼
                             ┌─────────────────────────────────┐
                             │      AI Provider (LLM)          │
                             │  Google Gemini  /  OpenAI GPT   │
                             └─────────────────────────────────┘
```

### Data Flow

1. User configures interview settings in the React UI
2. Frontend sends `POST /api/interview/start` to the Express backend
3. Backend constructs a prompt and calls the AI provider API
4. AI returns a generated interview question
5. Backend forwards it as a JSON response to the frontend
6. User types their answer and submits it
7. Answer is sent to backend → forwarded to AI for evaluation
8. AI returns feedback + next question; loop continues
9. Session ends with a full AI-generated feedback summary

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18 or higher — [Download](https://nodejs.org/)
- **npm** v9 or higher (bundled with Node.js)
- A **Google Gemini API key** (free) → [Get one here](https://ai.google.dev/) ← Recommended
- OR an **OpenAI API key** → [Get one here](https://platform.openai.com/api-keys)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/ankurdotio/interview-ai-yt.git
cd interview-ai-yt

# 2. Set up the Backend
cd Backend
npm install

# 3. Configure your environment variables
cp .env.example .env
# Open .env and add your API key (see Configuration section below)

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

Open [http://localhost:5173](http://localhost:5173) in your browser. You should see the Interview AI home screen.

Test the backend health endpoint:
```bash
curl http://localhost:3000/api/health
# → {"status":"ok"}
```

---

## 📁 Project Structure

```
interview-ai-yt/
│
├── 📂 Backend/
│   ├── src/
│   │   ├── services/
│   │   │   └── ai.service.js       # 🧠 Core AI integration (Gemini / OpenAI)
│   │   ├── routes/
│   │   │   └── interview.routes.js # API route definitions
│   │   ├── controllers/
│   │   │   └── interview.controller.js  # Business logic
│   │   ├── middleware/
│   │   │   └── errorHandler.js     # Global error handler
│   │   └── index.js                # Express app entry point
│   ├── .env               # Environment variable template
│   └── package.json
│
└── 📂 Frontend/
    ├── src/
    │   ├── components/             # Reusable UI components
    │   │   ├── ChatInterface/      # Main interview chat window
    │   │   ├── MessageBubble/      # Individual Q&A message bubbles
    │   │   ├── InterviewSetup/     # Role & topic selection form
    │   │   └── FeedbackPanel/      # End-of-session AI feedback display
    │   ├── pages/
    │   │   ├── Home.jsx            # Landing / welcome page
    │   │   └── Interview.jsx       # Active interview page
    │   ├── services/
    │   │   └── api.js              # HTTP helper functions (fetch/axios)
    │   ├── styles/                 # SCSS files (~30% of codebase)
    │   │   ├── _variables.scss     # Color palette & spacing tokens
    │   │   ├── _mixins.scss        # Reusable SCSS mixins
    │   │   └── main.scss           # Global styles
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
# ── AI Provider (choose one) ────────────────────────────────
# Option A: Google Gemini (recommended — has a generous free tier)
GEMINI_API_KEY=your_google_gemini_api_key_here

# Option B: OpenAI GPT
# OPENAI_API_KEY=your_openai_api_key_here

# ── Server ──────────────────────────────────────────────────
PORT=3000
NODE_ENV=development

# ── CORS ────────────────────────────────────────────────────
CORS_ORIGIN=http://localhost:5173
```

> ⚠️ **Never commit your `.env` file.** It is already listed in `.gitignore`.

### Getting a Free Gemini API Key

1. Go to [https://ai.google.dev/](https://ai.google.dev/)
2. Click **"Get API key"**
3. Create a new project (or use an existing one)
4. Copy the key and paste it into your `.env` file

---

## 📖 API Documentation

All endpoints are prefixed with `/api`.

### `POST /api/interview/start`
Start a new interview session.

**Request body:**
```json
{
  "role": "Software Engineer",
  "topic": "React",
  "level": "mid"
}
```

**Response:**
```json
{
  "sessionId": "abc123xyz",
  "question": "Can you explain the difference between useEffect and useLayoutEffect in React?"
}
```

---

### `POST /api/interview/answer`
Submit an answer and receive the next question.

**Request body:**
```json
{
  "sessionId": "abc123xyz",
  "answer": "useEffect runs asynchronously after the browser paint, whereas useLayoutEffect..."
}
```

**Response:**
```json
{
  "nextQuestion": "Great explanation! Now, how would you handle side effects that depend on DOM measurements?",
  "evaluation": "Accurate and well-structured."
}
```

---

### `GET /api/interview/feedback?sessionId=abc123xyz`
Retrieve the full feedback summary for a completed session.

**Response:**
```json
{
  "score": 82,
  "summary": "You demonstrated strong knowledge of React hooks...",
  "strengths": ["Clear explanations", "Good use of examples"],
  "improvements": ["Consider mentioning concurrent features"]
}
```

---

### `GET /api/health`
Server health check.

**Response:** `{"status": "ok"}`

---

## 🧠 How It Works

### AI Service (`ai.service.js`)

The backend's AI service is the core of the application. It abstracts the AI provider behind a clean interface so you can swap between Gemini and OpenAI without touching any other file.

```js
// Simplified example of the AI service
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateQuestion = async (role, topic, history) => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `
    You are a senior ${role} interviewer at a top tech company.
    Topic: ${topic}.
    Conversation so far: ${JSON.stringify(history)}
    Ask ONE concise, relevant interview question. Do not repeat previous questions.
  `;

  const result = await model.generateContent(prompt);
  return result.response.text();
};
```

### Prompt Engineering

The project uses a structured prompting strategy to ensure high-quality interview simulations:

- **System persona** — Sets the AI as an experienced interviewer for the chosen role
- **Context injection** — Passes job role, topic, and experience level into every prompt
- **Conversation history** — Full chat history is sent on each request to maintain continuity
- **Output constraints** — Instructs the AI to ask exactly one question per turn
- **Evaluation mode** — Separate prompt template for generating end-of-session feedback

---

## 🤝 Contributing

Contributions are what make the open-source community great. Any contribution you make is **hugely appreciated**!

1. **Fork** the repository
2. Create your feature branch: `git checkout -b feature/add-voice-support`
3. Commit your changes: `git commit -m 'feat: add Web Speech API for voice input'`
4. Push to the branch: `git push origin feature/add-voice-support`
5. Open a **Pull Request**

### Contribution Ideas

- 🗣️ Add voice input/output using the Web Speech API
- 💾 Add session persistence with MongoDB or SQLite
- 🔐 Implement user authentication (JWT / OAuth)
- 🌍 Add multi-language support
- 🐳 Create a Docker setup for one-command deployment
- 📱 Improve mobile responsiveness

Please read [CONTRIBUTING.md](CONTRIBUTING.md) before submitting a PR.

---

## 🗺️ Roadmap

- [x] Core AI interview simulation
- [x] Role & topic selection
- [x] Chat-style UI with SCSS styling
- [x] AI feedback at end of session
- [ ] User authentication & session history
- [ ] Voice interaction (Web Speech API)
- [ ] Resume upload & parsing
- [ ] Multiple interview modes (Behavioral, Coding, System Design)
- [ ] AI scoring rubric & leaderboard
- [ ] Docker + GitHub Actions CI/CD
- [ ] Mobile app (React Native)

---

## 🐛 Troubleshooting

**Backend won't start?**
```bash
# Check your Node.js version (must be v18+)
node --version

# Ensure .env exists with a valid API key
cat Backend/.env
```

**AI not responding / 500 errors?**
- Verify your `GEMINI_API_KEY` or `OPENAI_API_KEY` is correct and active
- Check that your API key has quota remaining
- Look at the backend terminal for the full error message

**CORS error in the browser?**
- Ensure the backend is running on port `3000`
- Ensure `CORS_ORIGIN=http://localhost:5173` is set in your `.env`

---

## 📄 License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for more information.

---

## 🙏 Acknowledgements

- [Google Gemini API](https://ai.google.dev/) — Primary AI provider
- [OpenAI API](https://platform.openai.com/) — Alternative AI provider
- [React](https://react.dev/) — Frontend framework
- [Vite](https://vitejs.dev/) — Build tool
- [Express.js](https://expressjs.com/) — Backend framework
- [Shields.io](https://shields.io/) — Badge generation

---

<div align="center">

Made with ❤️ by Harshit Singh

⭐ If this project helped you, please give it a star — it really helps!

</div>
