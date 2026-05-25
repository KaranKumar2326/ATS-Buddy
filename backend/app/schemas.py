from __future__ import annotations

from typing import List

from pydantic import BaseModel, Field


class Feedback(BaseModel):
    critical: List[str] = Field(default_factory=list)
    warning: List[str] = Field(default_factory=list)
    good: List[str] = Field(default_factory=list)


class AnalysisResponse(BaseModel):
    """
    Strict contract returned by the `/analyze` endpoint.

    Notes:
    - `score` is an ATS readiness score in the range 0..100.
    - Lists are used by the frontend to render categorized feedback.
    """

    score: int = Field(ge=0, le=100)
    industry: str
    immediateFixes: List[str] = Field(default_factory=list)
    feedback: Feedback = Field(default_factory=Feedback)
    resumeStrengths: List[str] = Field(default_factory=list)
    missingKeywords: List[str] = Field(default_factory=list)
    roleMatchScore: int = Field(default=0, ge=0, le=100)

