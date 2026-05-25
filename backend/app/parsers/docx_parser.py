from __future__ import annotations

import io
import os
from typing import Optional

from docx import Document


def extract_docx_text(file_bytes: bytes, *, max_paragraphs: Optional[int] = None) -> str:
    """
    Extract readable text from a DOCX using python-docx.

    We currently focus on paragraph text (tables/headers/footers are intentionally
    omitted for speed and because many ATS checkers primarily ingest body text).
    """

    max_paragraphs = max_paragraphs or int(os.getenv("MAX_DOCX_PARAGRAPHS", "250"))

    document = Document(io.BytesIO(file_bytes))
    paragraphs: list[str] = []

    for i, para in enumerate(document.paragraphs):
        if i >= max_paragraphs:
            break
        text = para.text.strip()
        if text:
            paragraphs.append(text)

    return "\n".join(paragraphs).strip()

