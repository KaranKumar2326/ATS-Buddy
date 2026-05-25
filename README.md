# 🚀 ATS Resume Checker & Optimizer

A premium, AI-powered Applicant Tracking System (ATS) scoring engine designed to help candidates optimize their resumes for specific job descriptions and roles.

## 🏗️ Technical Architecture

The platform is built with a modern, high-performance stack:

### 🎨 Frontend (Next.js)
- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with a "Premium Enterprise" aesthetic.
- **Animations**: Framer Motion for smooth transitions and interactive elements.
- **Icons**: Lucide React.
- **State Management**: React Hooks + Local Storage (for 24h history).

### ⚙️ Backend (FastAPI)
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python)
- **LLM Engine**: [LangChain](https://www.langchain.com/) + [Groq](https://groq.com/) (Llama 3.3 70B) for near-instant analysis.
- **Parsing**: 
  - `PyMuPDF` for high-fidelity PDF text extraction.
  - `python-docx` for Word document processing.
- **Scoring Heuristics**: Custom Python engine that extracts signals like keyword density, formatting quality, and quantified achievements.

## 🧠 Core Features

- **JD & Role Alignment**: Tailors the ATS score based on a specific job description and target role.
- **Keyword Gap Analysis**: Identifies critical missing skills and tools that recruiters look for.
- **Immediate Fixes**: Provides actionable, high-impact recommendations to improve parsing.
- **Formatting Validation**: Checks for ATS-unfriendly structures (tables, multi-column layouts, etc.).
- **Privacy First**: No signup required. All data is processed in-session with local history.

## 🛠️ How it Works

1. **Extraction**: The system extracts raw text from PDF or DOCX files.
2. **Heuristic Analysis**: A preliminary scan calculates objective metrics (word count, bullet points, contact info presence).
3. **AI Comparison**: The LLM compares the extracted text against the provided Job Description and Role.
4. **Structured Feedback**: The AI generates a validated JSON response containing the score, strengths, and specific missing keywords.

## 📈 Advanced Scoring Engine

We use a **Strict AI Auditor** model (Llama 3.3 70B) with a rigorous 100-point rubric:

- **JD Match (40%)**: Intense scrutiny of skill alignment. Missing core skills = heavy deductions.
- **Quantified Impact (25%)**: Penalizes "fluff" and rewards measurable metrics (%, $, numbers).
- **Formatting (20%)**: Validates section headers and ATS-readability.
- **Contact (15%)**: Ensures professional links (LinkedIn/GitHub) and contact info are present.

The system is designed to be a **harsh critic**, ensuring that only truly optimized resumes achieve scores above 80.

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- Groq API Key

### Installation

1. **Backend**:
   ```bash
   cd backend
   pip install -r requirements.txt
   # Create .env with GROQ_API_KEY
   python -m uvicorn app.main:app --reload
   ```

2. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## 📄 License
MIT
