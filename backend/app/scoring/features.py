from __future__ import annotations

import re
SECTION_HEADERS = [
    "summary",
    "profile",
    "objective",
    "skills",
    "technical skills",
    "experience",
    "work experience",
    "employment",
    "projects",
    "project",
    "education",
    "certifications",
    "certification",
    "awards",
    "publications",
]


RESUME_KEYWORDS = [
    # Common ATS keywords / skills
    "python",
    "java",
    "javascript",
    "typescript",
    "react",
    "next.js",
    "node",
    "node.js",
    "sql",
    "postgres",
    "mysql",
    "mongodb",
    "aws",
    "gcp",
    "azure",
    "docker",
    "kubernetes",
    "linux",
    "git",
    "ci/cd",
    # Common resume verbs / structures
    "developed",
    "designed",
    "implemented",
    "optimized",
    "led",
    "managed",
    "improved",
    "automated",
    "built",
    "created",
]


EMAIL_RE = re.compile(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}")
PHONE_RE = re.compile(
    r"(?:\+?\d{1,3}[\s\-\.]?)?(?:\(?\d{3}\)?[\s\-\.]?)\d{3}[\s\-\.]?\d{4}"
)
LINKEDIN_RE = re.compile(r"linkedin\.com/in/[\w\-]+", re.IGNORECASE)
GITHUB_RE = re.compile(r"github\.com/[\w\-]+", re.IGNORECASE)

BULLET_RE = re.compile(r"^\s*[-*•·]\s+")
QUANT_DIGIT_RE = re.compile(
    r"(\$\s?\d[\d,\.]*)|(\b\d+%+\b)|(\b\d+(\.\d+)?\s?(x|times)\b)|(\b\d+\s?(years?|months?|weeks?)\b)"
)


def _normalize_text(text: str) -> str:
    # Keep newlines for formatting/bullets detection, but normalize whitespace inside lines.
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    text = "\n".join(line.strip() for line in text.split("\n"))
    return re.sub(r"[ \t]+", " ", text).strip()


def _tokenize(text: str) -> list[str]:
    return re.findall(r"[A-Za-z0-9+#/.\-]+", text.lower())


def _count_section_headers(text: str) -> int:
    count = 0
    for line in text.split("\n"):
        s = line.strip().lower()
        if not s:
            continue
        # Match single-line headers like "SKILLS", "EDUCATION", etc.
        if any(
            s == header
            or (s.startswith(header + ":") if not header.endswith(" ") else False)
            for header in [h.lower() for h in SECTION_HEADERS]
        ):
            count += 1
            continue
        # Also match "Skills:" even if extra whitespace.
        if any(s.startswith(header + ":") for header in SECTION_HEADERS):
            count += 1
    return count


def extract_features(text: str) -> dict:
    """
    Extract heuristic signals for resume quality scoring.

    Returned dict is designed to be stable for LLM prompting and frontend rendering.
    """

    normalized = _normalize_text(text)
    tokens = _tokenize(normalized)
    total_words = len(tokens)

    if total_words == 0:
        return {
            "totalWords": 0,
            "keywordDensity": 0.0,
            "formattingSignals": 0.0,
            "quantifiedAchievementsCount": 0,
            "contactInfo": {
                "emailFound": False,
                "phoneFound": False,
                "linkedinFound": False,
                "githubFound": False,
            },
            "bulletCount": 0,
            "sectionHeaderCount": 0,
        }

    # Contact info detection
    email_found = bool(EMAIL_RE.search(normalized))
    phone_found = bool(PHONE_RE.search(normalized))
    linkedin_found = bool(LINKEDIN_RE.search(normalized))
    github_found = bool(GITHUB_RE.search(normalized))

    contact_presence_count = sum(
        [email_found, phone_found, linkedin_found, github_found]
    )

    # Formatting signals
    lines = normalized.split("\n")
    bullet_count = sum(1 for line in lines if BULLET_RE.match(line))
    section_header_count = _count_section_headers(normalized)

    # Quantifiable achievements signals
    quantified_matches = QUANT_DIGIT_RE.findall(normalized)
    quantified_achievements_count = len([m for m in quantified_matches if any(m)])

    # Keyword density: compute ratio of occurrences of known resume keywords.
    keyword_hits = 0
    for kw in RESUME_KEYWORDS:
        # Simple word-boundary-ish search. Keep it robust for multi-word keywords.
        pattern = r"\b" + re.escape(kw.lower().split()[0]) + r"\b"
        keyword_hits += len(re.findall(pattern, normalized.lower()))
        # For multi-token keywords (e.g., "next.js") rely on substring search.
        if " " in kw or "/" in kw or "." in kw or "+" in kw:
            keyword_hits += normalized.lower().count(kw.lower())

    keyword_density = min(keyword_hits / max(total_words, 1), 1.0)

    # Formatting signals normalized to 0..1 (simple but stable).
    formatting_signals = 0.0
    formatting_signals += min(section_header_count / 8, 1.0) * 0.5
    formatting_signals += min(bullet_count / 12, 1.0) * 0.5

    # Return only what the LLM needs. The LLM will derive final score.
    return {
        "totalWords": total_words,
        "keywordDensity": round(keyword_density, 4),
        "formattingSignals": round(formatting_signals, 4),
        "quantifiedAchievementsCount": quantified_achievements_count,
        "contactInfo": {
            "emailFound": email_found,
            "phoneFound": phone_found,
            "linkedinFound": linkedin_found,
            "githubFound": github_found,
        },
        "bulletCount": bullet_count,
        "sectionHeaderCount": section_header_count,
        "contactPresenceCount": contact_presence_count,
    }

