from __future__ import annotations

import json
import os
from typing import Any

from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import Runnable

from app.schemas import AnalysisResponse


def _truncate_text(text: str, *, max_chars: int) -> str:
    if len(text) <= max_chars:
        return text
    # Keep the beginning (usually headers + skills) and a small tail (sometimes accomplishments).
    head = text[: int(max_chars * 0.75)]
    tail = text[-int(max_chars * 0.25) :]
    return f"{head}\n\n[TRUNCATED_TAIL]\n{tail}"


def build_scoring_prompt() -> ChatPromptTemplate:
    # Keep the instructions explicit so the model doesn't output extra prose.
    system_prompt = (
        "You are an expert ATS (Applicant Tracking System) Auditor with 15+ years of experience in technical recruiting. "
        "Your goal is to provide a STERN, HIGHLY DETAILED, and ACCURATE score. Do not be overly generous.\n"
        "\n"
        "### SCORING RUBRIC (Max 100):\n"
        "1. **JD Match (40 pts)**: Penalize heavily for missing core skills found in the JD. Strictly match the resume contents against the required skills, technologies, and experience levels defined in the JD.\n"
        "2. **Quantified Impact (25 pts)**: Look for numbers, %, $, and metrics. Paragraphs without data get 0 here.\n"
        "3. **Formatting & Structure (20 pts)**: Check for standard sections, clear headers, and ATS-friendly layout.\n"
        "4. **Contact & Professionalism (15 pts)**: Missing email/LinkedIn/phone is an automatic -5 deduction.\n"
        "\n"
        "### CRITICAL RULES FOR HIGHER DEPTH & LENGTH:\n"
        "- **Do not provide generic or short feedback**. Prove that you read and analyzed the specific resume against the target role and JD.\n"
        "- Each item in `immediateFixes`, `feedback.critical`, `feedback.warning`, `feedback.good`, and `resumeStrengths` MUST be a **long, thorough, and highly specific 2-4 sentence explanation**.\n"
        "- When suggesting an immediate fix or identifying a gap, explicitly cite the exact skill or phrase from their resume, compare it to the JD, and provide a concrete 'Before' vs 'After' rewriting example custom-tailored to their actual experience.\n"
        "- If the resume is for a 'Senior' role but only shows 1-2 years of experience, cap 'JD Match' at 10 pts.\n"
        "- If the JD requires 'Python' and it's not present, deduct 10 pts from the total score.\n"
        "- `missingKeywords` MUST be a list of 5-10 key technical skills from the JD that are NOT in the resume.\n"
        "\n"
        "### OUTPUT FORMAT:\n"
        "You must return ONLY valid JSON matching the schema. Do not include markdown or prose.\n"
        "\n"
        "Choose `industry` from this list: "
        "Software Engineering, Data Science, Marketing, Sales, Design, Operations, Finance, Healthcare, Education, General."
    )

    human_prompt = (
        "Extracted resume text (may be truncated):\n"
        "{resume_text}\n"
        "\n"
        "Target Role: {role}\n"
        "Job Description: {job_description}\n"
        "\n"
        "Heuristic features (computed by the server):\n"
        "{features_json}\n"
        "\n"
        "Return the final score and feedback now."
    )

    return ChatPromptTemplate.from_messages(
        [
            ("system", system_prompt),
            ("human", human_prompt),
        ]
    )


def get_llm() -> ChatGroq:
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise RuntimeError("Missing `GROQ_API_KEY` environment variable.")

    model = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
    temperature = float(os.getenv("GROQ_TEMPERATURE", "0.1"))
    timeout = int(os.getenv("GROQ_TIMEOUT_SECONDS", "90"))

    return ChatGroq(api_key=api_key, model=model, temperature=temperature, timeout=timeout)


def score_resume(
    text: str,
    features: dict[str, Any],
    job_description: str = "",
    role: str = ""
) -> AnalysisResponse:
    """
    Call Groq via LangChain and return a validated `AnalysisResponse`.

    Uses structured output to enforce schema-shaped responses.
    """

    llm = get_llm()
    prompt = build_scoring_prompt()

    max_chars = int(os.getenv("LLM_MAX_CHARS", "12000"))
    resume_text = _truncate_text(text, max_chars=max_chars)
    features_json = json.dumps(features, ensure_ascii=False)

    # Use function_calling method which is extremely reliable for Groq models.
    structured = llm.with_structured_output(
        AnalysisResponse, method="function_calling"
    )
    llm_runnable = prompt | structured
    result = llm_runnable.invoke({
        "resume_text": resume_text,
        "features_json": features_json,
        "job_description": job_description or "Not provided",
        "role": role or "Not provided"
    })
    return result

