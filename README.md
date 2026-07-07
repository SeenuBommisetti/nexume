<div align="center">

# Nexume

### AI-Powered Resume Analyzer & ATS Optimizer

Upload your resume, receive recruiter-style AI feedback, ATS scoring, identify missing skills, and get actionable recommendations within seconds.

Built with **React**, **FastAPI**, **Google Gemini**, and **PyMuPDF**.

[Live Demo](https://nexumeweb.vercel.app)

</div>

---

## Overview

Nexume is an AI-powered resume analysis platform that helps job seekers improve their resumes before applying.

The application extracts text from uploaded PDF resumes, analyzes the content using Google's Gemini AI, and generates structured recruiter-style feedback including:

- ATS Compatibility Score
- Professional Summary
- Resume Strengths
- Weaknesses
- Missing Skills
- Personalized Recommendations

The project follows a clean, modular architecture where document parsing, AI orchestration, and presentation are separated into independent layers.

---

## Features

- PDF Resume Upload
- Drag & Drop Upload Interface
- Secure File Validation
- PDF Text Extraction using PyMuPDF
- AI Resume Analysis with Google Gemini
- ATS Score Generation
- Missing Skills Detection
- Strength & Weakness Analysis
- Personalized Resume Recommendations
- Responsive Modern UI
- REST API powered by FastAPI
- Deployable on Vercel + Render

---

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- Lucide Icons

### Backend

- FastAPI
- Python
- Pydantic
- PyMuPDF
- Google Gemini API
- Uvicorn

### AI

- Gemini 2.5 Flash
- Structured JSON Responses
- Prompt Engineering

### Deployment

- Vercel
- Render

---

## Architecture

```
                +------------------+
                |     React UI     |
                +--------+---------+
                         |
                         |
                 Upload Resume PDF
                         |
                         ▼
                +------------------+
                | FastAPI Backend  |
                +--------+---------+
                         |
             Validate PDF Upload
                         |
                         ▼
              +------------------+
              |   PDFExtractor   |
              |    (PyMuPDF)     |
              +--------+---------+
                         |
                Extract Resume Text
                         |
                         ▼
             +---------------------+
             | AIAnalysisService   |
             +--------+------------+
                      |
             Google Gemini API
                      |
                      ▼
          Structured Resume Analysis
                      |
                      ▼
              JSON Response
                      |
                      ▼
          Interactive Dashboard UI
```

---

## Project Structure

```
nexume
│
├── backend
│   ├── app
│   │   ├── api
│   │   ├── core
│   │   ├── prompts
│   │   ├── schemas
│   │   ├── services
│   │   ├── utils
│   │   └── main.py
│   │
│   ├── requirements.txt
│   └── .env.example
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── services
│   │   ├── assets
│   │   └── App.tsx
│   │
│   ├── package.json
│   └── .env.example
│
└── README.md
```

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/SeenuBommisetti/nexume.git

cd nexume
```

---

## Backend Setup

Navigate to the backend directory.

```bash
cd backend
```

Create a virtual environment.

```bash
python -m venv .venv
```

Activate it.

Windows

```bash
.venv\Scripts\activate
```

macOS/Linux

```bash
source .venv/bin/activate
```

Install dependencies.

```bash
pip install -r requirements.txt
```

Create a `.env` file.

```env
GEMINI_API_KEY=YOUR_API_KEY
GEMINI_MODEL=gemini-2.5-flash
```

Run the backend.

```bash
uvicorn app.main:app --reload
```

Backend runs at

```
http://localhost:8000
```

---

## Frontend Setup

Navigate to the frontend.

```bash
cd frontend
```

Install dependencies.

```bash
npm install
```

Create `.env`.

```env
VITE_API_BASE_URL=http://localhost:8000
```

Run the application.

```bash
npm run dev
```

Frontend runs at

```
http://localhost:5173
```

---

## Environment Variables

### Backend

| Variable | Description |
|----------|-------------|
| GEMINI_API_KEY | Google Gemini API Key |
| GEMINI_MODEL | Gemini Model Name |

### Frontend

| Variable | Description |
|----------|-------------|
| VITE_API_BASE_URL | Backend API URL |

---

## API Endpoint

### Upload Resume

```
POST /api/v1/resume/upload
```

Accepts

```
multipart/form-data
```

Parameter

```
file
```

Response

```json
{
  "resume": {
    "filename": "resume.pdf",
    "page_count": 1,
    "word_count": 420,
    "text": "..."
  },
  "analysis": {
    "overall_score": 82,
    "summary": "...",
    "strengths": [],
    "weaknesses": [],
    "missing_skills": [],
    "recommendations": []
  }
}
```

---


## Roadmap

- Resume Job Description Matching
- ATS Keyword Heatmap
- AI Resume Rewriting
- Multi-language Resume Support
- Cover Letter Generation
- Resume Version History
- Authentication
- Export AI Report as PDF

---

## Contributing

Contributions, feature suggestions, and bug reports are welcome.

Feel free to fork the repository and submit a pull request.

---

## Author

**Seenu Bommisetti**

GitHub

https://github.com/SeenuBommisetti

LinkedIn

https://www.linkedin.com/in/seenu-bommisetti

---

## License

This project is licensed under the MIT License.
