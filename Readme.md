
---

<div align="center">

# 🚀 ResumeMatch Pro

**An AI-powered, full-stack interview preparation platform. Upload your resume, paste a job description, and receive a personalized interview strategy.**

[✨ Features](#-features) · [🏗️ Architecture](#%EF%B8%8F-architecture) · [📁 Project Structure](#-structure)

</div>

## 📋 Table of Contents

- [About The Project](#-about-the-project)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#%EF%B8%8F-architecture)
  - [High-Level System Architecture](#high-level-system-architecture)
  - [Backend MVC Architecture](#backend-mvc-architecture)
  - [Frontend Feature Architecture](#frontend-feature-architecture)
  - [Database Schema Architecture](#database-schema-architecture)
  - [Authentication Flow](#authentication-flow)
  - [Interview Report Generation Flow](#interview-report-generation-flow)
  - [Resume PDF Generation Flow](#resume-pdf-generation-flow)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start)
- [Configuration](#%EF%B8%8F-configuration)
- [API Reference](#-api-reference)
- [Key Modules Explained](#-key-modules-explained)
- [Routing](#-routing)

---

## 🎯 About The Project

**Job Prep Platform** is a production-quality, full-stack web application that uses **Google Gemini AI** to generate a complete, personalized interview strategy for any job role. A user uploads their resume (PDF), pastes a job description, and optionally writes a self-description. The AI then outputs:

- A **match score** (0–100) indicating profile-to-job fit
- Role-specific **technical** and **behavioral interview questions**, each with the interviewer's intention and a model answer
- A list of **skill gaps** with severity levels
- A **day-wise preparation roadmap**
- A downloadable, **ATS-optimized, AI-generated resume PDF** tailored to the specific job description

The project was built as part of a YouTube tutorial series by [Harshit Singh](https://github.com/harshitzofficial).

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **User Authentication** | Secure registration, login, and logout with JWT stored in HTTP-only cookies and a token blacklist to prevent reuse after logout |
| 🛡️ **Protected Routes** | All interview features are behind a `Protected` component — unauthenticated users are redirected to `/login` |
| 📄 **Resume Upload** | Upload a PDF resume (max 3 MB); parsed server-side with `pdf-parse` |
| 🧠 **AI Interview Report** | Gemini AI analyzes your resume + job description and returns a fully structured interview strategy |
| 📊 **Match Score** | A 0–100 score showing how well your profile matches the job |
| ❓ **Technical Questions** | Role-specific technical questions with interviewer intention and model answers |
| 🗣️ **Behavioral Questions** | Soft-skill questions with intention and how-to-answer guidance |
| 🔍 **Skill Gap Analysis** | Identified skill gaps, each tagged with `low`, `medium`, or `high` severity |
| 🗺️ **Preparation Roadmap** | A structured, day-wise study plan with daily focus areas and tasks |
| 📥 **AI Resume PDF Download** | Generate and download an ATS-friendly, professional resume PDF tailored to the job, rendered via Puppeteer |
| 📜 **Report History** | All past interview reports are saved and listed on the home dashboard |

---

## 🛠 Tech Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| React | 19.2.0 | UI framework |
| React Router | 7.13.2 | Client-side routing & navigation |
| Vite | 7.x | Build tool & dev server |
| SCSS (Sass) | 1.97.3 | Component-level styling |
| Axios | 1.13.5 | HTTP client for API calls |

### Backend

| Technology | Purpose |
|---|---|
| Node.js + Express | HTTP server & REST API |
| MongoDB + Mongoose | Database & ODM |
| JSON Web Token (JWT) | Stateless authentication |
| `bcryptjs` | Password hashing |
| `multer` | Multipart file upload (resume PDF) |
| `pdf-parse` | Extract text from uploaded PDF resume |
| `@google/genai` | Google Gemini AI SDK |
| `zod` + `zod-to-json-schema` | Structured AI response schema validation |
| `puppeteer` | Headless Chrome for HTML-to-PDF resume generation |
| `cookie-parser` | Parse HTTP cookies |
| `cors` | Cross-origin resource sharing |

---

## 🏗️ Architecture

### High-Level System Architecture

```
┌────────────────────────────────────────────────────────────────────┐
│                          USER BROWSER                              │
│                                                                    │
│   ┌────────────────────────────────────────────────────────────┐   │
│   │        React 19 Frontend (Vite + SCSS)                     │   │
│   │   ┌──────────┐  ┌──────────────┐  ┌────────────────────┐   │   │
│   │   │  Auth    │  │  Interview   │  │  Protected Route   │   │   │
│   │   │ Feature  │  │   Feature    │  │  Guard Component   │   │   │
│   │   └──────────┘  └──────────────┘  └────────────────────┘   │   │
│   │         Context Providers (AuthContext, InterviewContext)  │   │
│   └────────────────────────────┬───────────────────────────────┘   │
│                                │  HTTP / REST (Axios, credentials) │
└────────────────────────────────┼───────────────────────────────────┘
                                 │
                                 ▼
┌────────────────────────────────────────────────────────────────────┐
│            Node.js + Express Backend (:3000)                       │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Middlewares:  cors  │  express.json  │  cookie-parser       │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  ┌────────────────────┐     ┌───────────────────────────────────┐  │
│  │   /api/auth/*      │     │       /api/interview/*            │  │
│  │  auth.routes.js    │     │     interview.routes.js           │  │
│  └────────┬───────────┘     └──────────────┬────────────────────┘  │
│           │                                │                       │
│           ▼                                ▼                       │
│  ┌────────────────────┐     ┌──────────────────────────────────┐   │
│  │ auth.controller.js │     │   interview.controller.js        │   │
│  │  register/login/   │     │  generate / getById /            │   │
│  │  logout / getMe    │     │  getAll / generateResumePdf      │   │
│  └────────┬───────────┘     └──────────────┬───────────────────┘   │
│           │                                │                       │
│           ▼                                ▼                       │
│  ┌────────────────────┐     ┌──────────────────────────────────┐   │
│  │   MongoDB Models   │     │        ai.service.js             │   │
│  │ user / blacklist / │     │  generateInterviewReport()       │   │
│  │  interviewReport   │     │  generateResumePdf()             │   │
│  └────────┬───────────┘     └──────────────┬───────────────────┘   │
└───────────┼────────────────────────────────│ ──────────────────────┘
            │                                │  HTTPS
            ▼                                ▼
   ┌─────────────────┐            ┌────────────────────────┐
   │    MongoDB      │            │  Google Gemini AI API  │
   │  (Mongoose ODM) │            │  gemini-3-flash-preview│
   └─────────────────┘            └────────────────────────┘
```

---

### Backend MVC Architecture

The backend follows a clean **Routes → Middleware → Controller → Service → Model** pattern:

```
Incoming Request
       │
       ▼
  Express Router
  (auth.routes.js / interview.routes.js)
       │
       ▼
  Middlewares
  ┌──────────────────────────┬───────────────────────┐
  │   auth.middleware.js     │  file.middleware.js   │
  │  JWT verify + blacklist  │  multer memoryStorage │
  │  check → sets req.user   │  3 MB PDF limit       │
  └──────────────────────────┴───────────────────────┘
       │
       ▼
  Controllers
  ┌──────────────────────────┬──────────────────────────────┐
  │   auth.controller.js     │   interview.controller.js    │
  │  register / login /      │  generateReport /            │
  │  logout / getMe          │  getById / getAll /          │
  │  (bcrypt + JWT)          │  generateResumePdf           │
  └──────────────────────────┴──────────────┬───────────────┘
                                            │
                                            ▼
                                    ai.service.js
                                  (Google Gemini SDK)
                                  generateInterviewReport()
                                  generateResumePdf()
                                  generatePdfFromHtml()  [Puppeteer]
       │
       ▼
  Mongoose Models
  ┌──────────────┬───────────────────┬────────────────────┐
  │  user.model  │ blacklist.model   │ interviewReport    │
  │  username /  │ invalidated JWT   │      .model        │
  │  email /     │ tokens            │ matchScore /       │
  │  password    │                   │ technicalQuestions │
  │  (hashed)    │                   │ behavioralQuestions│
  └──────────────┴───────────────────│ skillGaps /        │
                                     │ preparationPlan /  │
                                     │ resume / title     │
                                     └────────────────────┘
```

---

### Frontend Feature Architecture

The frontend uses a **feature-based** folder structure. Each feature encapsulates its own pages, components, hooks, services, contexts, and styles.

```
src/
 ├── main.jsx                    ← Vite entry point
 ├── App.jsx                     ← Wraps everything in AuthProvider + InterviewProvider + RouterProvider
 ├── app.routes.jsx              ← All client-side routes (React Router v7)
 │
 └── features/
      ├── auth/
      │    ├── auth.context.jsx       ← AuthContext: { user, setUser, loading, setLoading }
      │    ├── auth.form.scss         ← Shared form styles for login/register
      │    ├── components/
      │    │    └── Protected.jsx     ← HOC: redirects to /login if !user
      │    ├── hooks/
      │    │    └── useAuth.js        ← handleLogin / handleRegister / handleLogout + auto getMe on mount
      │    ├── pages/
      │    │    ├── Login.jsx         ← Login form page
      │    │    └── Register.jsx      ← Register form page
      │    └── services/
      │         └── auth.api.js       ← Axios calls: register / login / logout / getMe
      │
      └── interview/
           ├── interview.context.jsx  ← InterviewContext: { loading, report, reports }
           ├── hooks/
           │    └── useInterview.js   ← generateReport / getReportById / getReports / getResumePdf
           ├── pages/
           │    ├── Home.jsx          ← Input form + recent reports list
           │    └── Interview.jsx     ← Report viewer: Technical / Behavioral / Roadmap tabs + Skill Gap sidebar
           ├── services/
           │    └── interview.api.js  ← Axios calls: generateReport / getById / getAll / generateResumePdf
           └── style/
                ├── home.scss         ← Styles for the Home page
                └── interview.scss    ← Styles for the Interview report page
```

---

### Database Schema Architecture

Three MongoDB collections power the platform:

```
┌────────────────────────────────┐
│         users collection       │
│  _id, username, email,         │
│  password (bcrypt hash)        │
└────────────────────┬───────────┘
                     │ ref: "users"
                     ▼
┌──────────────────────────────────────────────────────────────┐
│               interviewReports collection                    │
│  _id, user (ObjectId ref)                                    │
│  title (string)                                              │
│  jobDescription, resume, selfDescription                     │
│  matchScore (0–100)                                          │
│  technicalQuestions: [{ question, intention, answer }]       │
│  behavioralQuestions:[{ question, intention, answer }]       │
│  skillGaps:          [{ skill, severity: low|medium|high }]  │
│  preparationPlan:    [{ day, focus, tasks: [string] }]       │
│  createdAt, updatedAt (timestamps)                           │
└──────────────────────────────────────────────────────────────┘

┌────────────────────────────────┐
│     blacklistTokens collection │
│  _id, token (string),          │
│  createdAt, updatedAt          │
│  (JWT tokens invalidated on    │
│   logout — checked on every    │
│   protected request)           │
└────────────────────────────────┘
```

---

### Authentication Flow

```
Register / Login
      │
      ▼
  Auth Controller
  ├─ bcrypt.hash(password, 10)   ← on register
  ├─ bcrypt.compare(pw, hash)    ← on login
  └─ jwt.sign({ id, username }, JWT_SECRET, { expiresIn: "1d" })
      │
      ▼
  JWT stored in HTTP-only cookie ("token")
  → Returned to browser with credentials: true

Every Protected Request
      │
      ▼
  auth.middleware.js
  ├─ Read token from req.cookies.token
  ├─ Check blacklistTokens collection → reject if found
  └─ jwt.verify(token, JWT_SECRET) → attach req.user

Logout
  ├─ Add token to blacklistTokens collection
  └─ res.clearCookie("token")
```

---

### Interview Report Generation Flow

```
User (Browser)
  1. Fills in Job Description (text)
  2. Uploads Resume PDF (≤ 3 MB)
  3. Optionally adds Self Description
  4. Clicks "Generate My Interview Strategy"
      │
      ▼  POST /api/interview/  (multipart/form-data)
      │  [authMiddleware] → [multer memoryStorage]
      │
      ▼
  interview.controller.js → generateInterViewReportController()
  ├─ pdf-parse extracts text from req.file.buffer
  ├─ Calls ai.service.generateInterviewReport({ resume, selfDescription, jobDescription })
  │     └─ Gemini prompt → structured JSON (Zod schema) → returns:
  │           matchScore, technicalQuestions, behavioralQuestions,
  │           skillGaps, preparationPlan, title
  └─ Saves interviewReportModel.create({ user, ...aiOutput })
      │
      ▼  201 { interviewReport }
      │
      ▼
  Frontend navigates to /interview/:id
  Interview.jsx renders tabs: Technical | Behavioral | Roadmap
  Sidebar shows matchScore ring + skill gap tags
```

---

### Resume PDF Generation Flow

```
User clicks "Download Resume" on Interview page
      │
      ▼  POST /api/interview/resume/pdf/:interviewReportId
      │  [authMiddleware]
      │
      ▼
  interview.controller.js → generateResumePdfController()
  ├─ Fetch interviewReport from DB (resume, jobDescription, selfDescription)
  └─ Calls ai.service.generateResumePdf({ resume, jobDescription, selfDescription })
        ├─ Gemini generates HTML string (ATS-friendly, professional)
        └─ generatePdfFromHtml(html)
              └─ Puppeteer: launch browser → setContent → page.pdf({ format: "A4" })
      │
      ▼  Response: application/pdf blob
      │
      ▼
  Frontend: window.URL.createObjectURL(blob) → auto-downloads as resume_{id}.pdf
```

---

## 📁 Project Structure

```
Job-Prep-Platform/
│
├── 📂 Backend/
│   ├── server.js                        ← Entry point: loads .env, connects DB, starts server on :3000
│   └── src/
│       ├── app.js                       ← Express app: JSON, cookieParser, CORS, route mounting
│       ├── config/
│       │   └── database.js              ← Mongoose connection (MONGO_URI from env)
│       ├── controllers/
│       │   ├── auth.controller.js       ← register / login / logout / getMe
│       │   └── interview.controller.js  ← generateReport / getById / getAll / generateResumePdf
│       ├── middlewares/
│       │   ├── auth.middleware.js       ← JWT verification + blacklist check
│       │   └── file.middleware.js       ← Multer (memoryStorage, 3 MB limit)
│       ├── models/
│       │   ├── user.model.js            ← username, email, password (hashed)
│       │   ├── blacklist.model.js       ← Invalidated JWT tokens
│       │   └── interviewReport.model.js ← Full report schema with nested sub-docs
│       ├── routes/
│       │   ├── auth.routes.js           ← POST /register, POST /login, GET /logout, GET /get-me
│       │   └── interview.routes.js      ← POST /, GET /report/:id, GET /, POST /resume/pdf/:id
│       └── services/
│           └── ai.service.js            ← Gemini AI: generateInterviewReport() + generateResumePdf() + generatePdfFromHtml()
│
└── 📂 Frontend/
    ├── index.html
    ├── vite.config.js                   ← @vitejs/plugin-react
    ├── package.json
    └── src/
        ├── main.jsx                     ← ReactDOM.createRoot + global style.scss
        ├── App.jsx                      ← AuthProvider > InterviewProvider > RouterProvider
        ├── app.routes.jsx               ← /login, /register, / (Protected), /interview/:id (Protected)
        └── features/
            ├── auth/
            │   ├── auth.context.jsx     ← AuthContext
            │   ├── auth.form.scss
            │   ├── components/
            │   │   └── Protected.jsx    ← Route guard
            │   ├── hooks/
            │   │   └── useAuth.js       ← Auth actions + auto-restore session on mount
            │   ├── pages/
            │   │   ├── Login.jsx
            │   │   └── Register.jsx
            │   └── services/
            │       └── auth.api.js      ← Axios (baseURL :3000, withCredentials: true)
            └── interview/
                ├── interview.context.jsx← InterviewContext
                ├── hooks/
                │   └── useInterview.js  ← All interview data actions
                ├── pages/
                │   ├── Home.jsx         ← Form + recent reports
                │   └── Interview.jsx    ← Tabbed report viewer
                ├── services/
                │   └── interview.api.js ← Axios calls (multipart for report, blob for PDF)
                └── style/
                    ├── home.scss
                    └── interview.scss
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher
- **MongoDB** instance (local or Atlas)
- **Google Gemini API Key** → [Get one free](https://ai.google.dev/)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/harshitzofficial/Job-Prep-Platform.git
cd Job-Prep-Platform

# 2. Setup the Backend
cd Backend
npm install

# 3. Create your environment file
cp .env.example .env
# Fill in your values (see Configuration section below)

# 4. Start the backend
npm run dev
# ✅ Running at http://localhost:3000

# 5. In a new terminal, setup the Frontend
cd ../Frontend
npm install

# 6. Start the frontend
npm run dev
# ✅ Running at http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173) — you should see the registration/login screen.

---

## ⚙️ Configuration

Create a `.env` file in the `Backend/` directory:

```env
# ── Database ────────────────────────────────────────────
MONGO_URI=mongodb://localhost:27017/job-prep-platform
# or your MongoDB Atlas connection string

# ── Authentication ──────────────────────────────────────
JWT_SECRET=your_super_secret_jwt_key_here

# ── AI Provider ─────────────────────────────────────────
GOOGLE_GENAI_API_KEY=your_google_gemini_api_key_here

# ── Server ──────────────────────────────────────────────
PORT=3000
```

> ⚠️ **Never commit your `.env` file.** Add it to `.gitignore`.

| Variable | Required | Description |
|---|---|---|
| `MONGO_URI` | ✅ | MongoDB connection string |
| `JWT_SECRET` | ✅ | Secret key for signing JWTs (use a long random string) |
| `GOOGLE_GENAI_API_KEY` | ✅ | Google Gemini API key |
| `PORT` | Optional | Defaults to `3000` |

---

## 📖 API Reference

All endpoints are prefixed with `/api`. The server runs at `http://localhost:3000`.

### Auth Routes — `/api/auth`

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | ❌ | Register a new user (`username`, `email`, `password`) |
| `POST` | `/api/auth/login` | ❌ | Login with `email` + `password` |
| `GET` | `/api/auth/logout` | ❌ | Clears cookie and blacklists JWT |
| `GET` | `/api/auth/get-me` | ✅ | Returns currently authenticated user |

#### POST `/api/auth/register`
```json
// Request Body
{ "username": "harshit", "email": "h@example.com", "password": "secret123" }

// Response 201
{ "message": "User registered successfully", "user": { "id": "...", "username": "harshit", "email": "h@example.com" } }
```

#### POST `/api/auth/login`
```json
// Request Body
{ "email": "h@example.com", "password": "secret123" }

// Response 200
{ "message": "User loggedIn successfully.", "user": { "id": "...", "username": "harshit", "email": "h@example.com" } }
```

---

### Interview Routes — `/api/interview`

> All interview routes require authentication (JWT cookie).

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/interview/` | Generate a new interview report (multipart/form-data) |
| `GET` | `/api/interview/` | Get all interview reports for the logged-in user |
| `GET` | `/api/interview/report/:interviewId` | Get a single report by ID |
| `POST` | `/api/interview/resume/pdf/:interviewReportId` | Generate and download an AI resume PDF |

#### POST `/api/interview/`
```
Content-Type: multipart/form-data

Fields:
  - jobDescription  (string, required)
  - selfDescription (string, optional)
  - resume          (file, PDF, max 3 MB)

Response 201:
{
  "message": "Interview report generated successfully.",
  "interviewReport": {
    "_id": "...",
    "title": "Senior Frontend Engineer",
    "matchScore": 78,
    "technicalQuestions": [{ "question": "...", "intention": "...", "answer": "..." }],
    "behavioralQuestions": [{ "question": "...", "intention": "...", "answer": "..." }],
    "skillGaps": [{ "skill": "TypeScript", "severity": "medium" }],
    "preparationPlan": [{ "day": 1, "focus": "React Hooks", "tasks": ["..."] }],
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

#### GET `/api/interview/`
Returns all reports for the current user. The list view **excludes** `resume`, `selfDescription`, `jobDescription`, `technicalQuestions`, `behavioralQuestions`, `skillGaps`, and `preparationPlan` for performance — only `_id`, `title`, `matchScore`, `user`, and timestamps are returned.

#### GET `/api/interview/report/:interviewId`
Returns the **full** report including all questions, skill gaps, and preparation plan.

#### POST `/api/interview/resume/pdf/:interviewReportId`
Returns a binary `application/pdf` blob. The frontend creates a download link automatically.

---

## 🔑 Key Modules Explained

### `ai.service.js` — The AI Brain

The AI service uses the `@google/genai` SDK with `gemini-3-flash-preview`. It leverages **Zod schemas** converted to JSON Schema to enforce a strict, structured response from the model — eliminating the need for manual parsing or validation.

**`generateInterviewReport()`**
- Accepts `resume` (text), `selfDescription`, `jobDescription`
- Returns a fully typed object: `matchScore`, `technicalQuestions`, `behavioralQuestions`, `skillGaps`, `preparationPlan`, `title`

**`generateResumePdf()`**
- Accepts the same three inputs
- Asks Gemini to produce an HTML resume string optimized for ATS and visual quality
- Passes that HTML to `generatePdfFromHtml()` → Puppeteer renders it headlessly on A4 format

### `auth.middleware.js` — Dual-Layer Token Security
1. Reads the JWT from the `token` cookie
2. Checks the `blacklistTokens` collection — rejects if the token was invalidated at logout
3. Verifies the token signature with `jwt.verify(token, JWT_SECRET)`
4. Attaches `req.user` for downstream controllers

### `file.middleware.js` — Resume Upload
- Uses `multer` with `memoryStorage` (no disk writes)
- Enforces a **3 MB** file size limit
- File buffer is passed directly to `pdf-parse` in the controller

### `Protected.jsx` — Frontend Route Guard
- Consumes `useAuth()` to read the current user
- If `loading`, shows a loading screen
- If `!user`, redirects to `/login` via React Router's `<Navigate>`
- Otherwise, renders the protected child

---

##  Routing

### Frontend Routes (`app.routes.jsx`)

| Path | Component | Protected |
|---|---|---|
| `/login` | `Login.jsx` | ❌ |
| `/register` | `Register.jsx` | ❌ |
| `/` | `Home.jsx` | ✅ |
| `/interview/:interviewId` | `Interview.jsx` | ✅ |

### Backend Routes

| Prefix | Router File |
|---|---|
| `/api/auth` | `auth.routes.js` |
| `/api/interview` | `interview.routes.js` |

## Documentation

For a deeper dive into the codebase, indexing, and comprehensive project wiki, visit our official documentation:

👉 **[View Job Prep Platform on DeepWiki](https://deepwiki.com/harshitzofficial/Job-Prep-Platform)**
