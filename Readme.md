# Interview AI Pro

Interview AI Pro is an advanced, AI-powered interview preparation platform. It allows candidates to upload their resumes and input target job descriptions to instantly receive tailored, bespoke preparation strategies designed to help them ace their upcoming interviews.

## 🌟 Features

- **Deep Resume Analysis**: The system extracts text from PDF/DOCX resumes and maps the user's skills directly to the requirements of the job description.
- **Targeted Strategy Generation**: Uses Google's state-of-the-art **Gemini** generative AI models to provide specific behavioral and technical questions, identifying their intentions and how to answer them optimally.
- **Instant Preparation Roadmaps**: Automatically generates day-by-day preparation plans tailored perfectly to the candidate's skill gaps and the job's requirements.
- **AI Resume Builder**: Capabilities to regenerate and transform raw resume data into highly professional, ATS-friendly HTML/PDF resumes explicitly tailored for the target role.
- **Interactive UI**: A modern, sleek glassmorphism UI offering a premium user experience.

---

## 🏗️ Architecture & Tech Stack

This project follows a decoupled Client-Server architecture.

### Frontend
Built with modern web technologies, prioritizing speed, aesthetics, and user experience.
- **Framework**: React 19 bootstrapped with Vite
- **Routing**: React Router v7
- **Styling**: SCSS (Sass) featuring a custom CSS-variable-based glassmorphism design system
- **State/API Handling**: React Context API & Axios

### Backend
A robust RESTful API that handles authentication, file parsing, and AI integrations.
- **Core Runtime**: Node.js & Express.js
- **Database**: MongoDB (managed via Mongoose)
- **Authentication**: JWT (JSON Web Tokens) via HTTP-only cookies
- **AI Integration**: `@google/genai` (utilizing `gemini-3-flash-preview`)
- **Validation**: Zod (Ensures the AI output strictly adheres to expected JSON structures)
- **File Parsing**: `multer` for upload handling and `pdf-parse` to extract text from candidate resumes
- **PDF Generation**: `puppeteer` to render AI-generated HTML resumes into downloadable A4 PDFs

---

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (Local instance or MongoDB Atlas)
- Google Gemini API Key

### 1. Backend Setup
Navigate into the backend directory and install dependencies:
```bash
cd Backend
npm install
```

Create a `.env` file in the `Backend` directory and define your environment variables:
```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GOOGLE_GENAI_API_KEY=your_gemini_api_key
```

Start the backend server:
```bash
npm run dev
```
*The server will start on `http://localhost:3000`.*

### 2. Frontend Setup
Open a new terminal, navigate to the frontend directory, and install dependencies:
```bash
cd Frontend
npm install
```

Start the Vite development server:
```bash
npm run dev
```
*The React app will be served on `http://localhost:5173`.*

---

## 🧠 How the AI Engine Works

The core of this application resides in `Backend/src/services/ai.service.js`. 
Instead of relying on unpredictable plain-text responses, the app utilizes **Zod** schema definitions to force the Gemini model to return strongly typed JSON objects through the `responseSchema` configuration parameter.

This guarantees that the generated interview reports will perfectly map to the React frontend components without parsing errors, securely providing:
1. `matchScore`: Percentage rating of candidate vs job description.
2. `technicalQuestions` & `behavioralQuestions`: Arrays of targeted Q&As.
3. `skillGaps`: Identified areas the candidate must improve.
4. `preparationPlan`: A structured timeline to get the candidate interview-ready.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📝 License

This project is licensed under the ISC License.
