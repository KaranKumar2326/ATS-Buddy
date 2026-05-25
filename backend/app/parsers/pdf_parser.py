from __future__ import annotations

import os
from typing import Optional

import fitz  # PyMuPDF


def extract_pdf_text(file_bytes: bytes, *, max_pages: Optional[int] = None) -> str:
    """
    Extract readable text from a PDF using PyMuPDF.

    For performance we optionally cap the number of pages processed.
    """

    max_pages = max_pages or int(os.getenv("MAX_PDF_PAGES", "12"))

    doc = fitz.open(stream=file_bytes, filetype="pdf")
    texts: list[str] = []

    # `doc` is iterable over pages.
    for page_index, page in enumerate(doc):
        if page_index >= max_pages:
            break
        # `sort=True` tends to improve reading order for many ATS resumes.
        texts.append(page.get_text(sort=True))

    return "\n\f\n".join(texts).strip()

