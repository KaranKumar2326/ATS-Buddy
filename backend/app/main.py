from __future__ import annotations

import os
from pathlib import Path
from typing import Any

from dotenv import load_dotenv
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from app.llm.langchain_client import score_resume
from app.parsers.docx_parser import extract_docx_text
from app.parsers.pdf_parser import extract_pdf_text
from app.scoring.features import extract_features
from app.schemas import AnalysisResponse, Feedback

load_dotenv()

MAX_UPLOAD_BYTES = int(os.getenv("MAX_UPLOAD_BYTES", str(10 * 1024 * 1024)))  # 10MB default


def _fallback_score(
    features: dict[str, Any],
    job_description: str = "",
    role: str = ""
) -> AnalysisResponse:
    # Simple deterministic scoring to keep the endpoint useful even if the LLM fails.
    keyword_density = float(features.get("keywordDensity", 0.0))
    formatting_signals = float(features.get("formattingSignals", 0.0))
    quantified_count = int(features.get("quantifiedAchievementsCount", 0))
    contact_info = features.get("contactInfo", {})
    contact_presence_count = int(features.get("contactPresenceCount", 0))

    keyword_score = min(keyword_density * 35.0, 35.0)
    formatting_score = min(formatting_signals * 35.0, 35.0)
    quantified_score = min(quantified_count * 4.0, 20.0)
    contact_score = min(contact_presence_count / 4 * 10.0, 10.0)

    score = int(round(keyword_score + formatting_score + quantified_score + contact_score))
    score = max(0, min(100, score))

    critical: list[str] = []
    warning: list[str] = []
    good: list[str] = []
    immediate: list[str] = []
    strengths: list[str] = []

    # Contact info criticality
    email_found = bool(contact_info.get("emailFound", False))
    phone_found = bool(contact_info.get("phoneFound", False))
    linkedin_found = bool(contact_info.get("linkedinFound", False))
    github_found = bool(contact_info.get("githubFound", False))

    if not email_found:
        critical.append("Missing or hard-to-detect email address.")
        immediate.append("Add an email near the top of your resume (e.g., name + contact header).")
    if not phone_found:
        warning.append("Phone number is missing; ATS and recruiters often expect it.")
        immediate.append("Add a phone number in the contact header.")
    if not (linkedin_found or github_found):
        critical.append("Add at least one professional link (LinkedIn and/or GitHub).")
        immediate.append("Include a LinkedIn and/or GitHub URL in the header.")

    # Formatting criticality
    section_headers = int(features.get("sectionHeaderCount", 0))
    bullet_count = int(features.get("bulletCount", 0))
    if section_headers < 2:
        critical.append("Section headers appear missing or unclear, which can hurt ATS parsing.")
        immediate.append("Add clear headers like `Summary`, `Skills`, `Experience`, and `Education`.")
    if bullet_count < 3:
        warning.append("Work experience lacks bullet points; consider converting paragraphs to bullets.")
        immediate.append("Convert responsibilities into 3-6 impact bullets with strong action verbs.")

    # Quantified achievements criticality
    if quantified_count < 1:
        critical.append("Few/no quantifiable achievements detected (metrics, % impact, or dollar values).")
        immediate.append("Rewrite bullets to include measurable outcomes (e.g., reduced time by 25%, managed $120k).")
    else:
        good.append("Quantifiable impact detected in your resume bullets.")
        strengths.append("Measurable outcomes present")

    # Keyword density
    if keyword_density < 0.01:
        warning.append("Keyword density looks low for typical ATS matching.")
        immediate.append("Mirror relevant job keywords in `Skills` and key experience bullets (avoid keyword stuffing).")
    else:
        good.append("Some ATS-relevant keywords detected.")
        strengths.append("Relevant keywords present")

    industry = "General"
    return AnalysisResponse(
        score=score,
        industry=industry,
        immediateFixes=immediate[:10],
        feedback=Feedback(critical=critical[:6], warning=warning[:6], good=good[:6]),
        resumeStrengths=strengths[:5],
    )


app = FastAPI(title="ATS Resume Checker")

allowed_origins_str = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000,http://localhost:3000/,http://127.0.0.1:3000/")
allowed_origins = [origin.strip() for origin in allowed_origins_str.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/healthz")
def healthz() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/analyze", response_model=AnalysisResponse)
async def analyze(
    file: UploadFile = File(...),
    job_description: str = Form(None),
    role: str = Form(None)
) -> AnalysisResponse:
    ext = Path(file.filename).suffix.lower()
    if ext not in {".pdf", ".docx"}:
        raise HTTPException(status_code=400, detail="Unsupported file type. Please upload a .pdf or .docx file.")

    content = await file.read()
    if len(content) > MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=400, detail=f"File too large. Limit is {MAX_UPLOAD_BYTES} bytes.")

    if not role or not role.strip():
        raise HTTPException(status_code=400, detail="Target Role is required to get a tailored ATS score.")
    if not job_description or not job_description.strip():
        raise HTTPException(status_code=400, detail="Job Description is required to perform ATS matching.")

    if ext == ".pdf":
        resume_text = extract_pdf_text(content)
    else:
        resume_text = extract_docx_text(content)

    if not resume_text.strip():
        # Avoid sending empty/near-empty text to the LLM.
        raise HTTPException(status_code=400, detail="Could not extract text from this resume. Please try another file.")

    features = extract_features(resume_text)

    try:
        return score_resume(resume_text, features, job_description or "", role or "")
    except Exception as e:
        import traceback
        traceback.print_exc()
        # The app should still respond with something useful.
        return _fallback_score(features, job_description or "", role or "")

