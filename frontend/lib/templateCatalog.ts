export type TemplateRecommendation = {
  id: string
  title: string
  description: string
  atsReasons: string[]
  affiliateUrl: string
}

export const templateCatalog: Record<string, TemplateRecommendation[]> = {
  "Software Engineering": [
    {
      id: "reverse-chron-tech",
      title: "Reverse-Chron Tech",
      description: "Technical skills up top + project highlights mapped to impact.",
      atsReasons: ["Skills section is keyword-forward", "Bullets for projects", "Clean headings"],
      affiliateUrl: "#",
    },
    {
      id: "projects-first",
      title: "Projects-First Builder",
      description: "Project summaries lead with measurable outcomes and tech stack.",
      atsReasons: ["Consistent project headings", "Metrics/bullets emphasized", "ATS-safe formatting"],
      affiliateUrl: "#",
    },
  ],
  "Data Science": [
    {
      id: "metrics-research",
      title: "Metrics Research",
      description: "Research framing with quantified experiments and tooling.",
      atsReasons: ["Keywords for ML stack", "Quantified results encouraged", "Readable layout"],
      affiliateUrl: "#",
    },
    {
      id: "analyst-structured",
      title: "Analyst Structured",
      description: "Clear role-to-impact mapping with datasets and outcomes.",
      atsReasons: ["Consistent experience headings", "Outcome-driven bullets", "ATS-safe sections"],
      affiliateUrl: "#",
    },
  ],
  Marketing: [
    {
      id: "campaign-brand",
      title: "Campaign + Brand Story",
      description: "Campaign-first structure with KPIs and channels.",
      atsReasons: ["KPI-driven bullet layout", "Clear sections for ATS parsing", "Metrics-first"],
      affiliateUrl: "#",
    },
  ],
  Sales: [
    {
      id: "pipeline-results",
      title: "Pipeline Results",
      description: "Outcome-forward sales bullets with quota/territory indicators.",
      atsReasons: ["Numbers and achievements highlighted", "ATS-friendly headings", "Bullet-heavy experience"],
      affiliateUrl: "#",
    },
  ],
  Design: [
    {
      id: "portfolio-impact",
      title: "Portfolio Impact",
      description: "Design process + impact metrics with ATS-compatible structure.",
      atsReasons: ["Skills and tools section", "Experience in bullets", "Clean, simple typography"],
      affiliateUrl: "#",
    },
  ],
  Operations: [
    {
      id: "process-ops",
      title: "Process + Ops",
      description: "Operational systems, process improvements, and measurable efficiency wins.",
      atsReasons: ["Section headers clearly separated", "Quantifiable achievements encouraged", "No complex tables"],
      affiliateUrl: "#",
    },
  ],
  Finance: [
    {
      id: "financial-structured",
      title: "Financial Structured",
      description: "Finance keywords and quantified outcomes with a clean layout.",
      atsReasons: ["ATS-safe spacing + headings", "Metrics-first bullets", "Reduced formatting complexity"],
      affiliateUrl: "#",
    },
  ],
  Healthcare: [
    {
      id: "clinical-summary",
      title: "Clinical Summary",
      description: "Clinical experience with certifications and structured summaries.",
      atsReasons: ["Certifications section visible", "Readable bullet points", "Consistent headers"],
      affiliateUrl: "#",
    },
  ],
  Education: [
    {
      id: "teaching-structured",
      title: "Teaching Structured",
      description: "Teaching highlights, curriculum keywords, and achievements.",
      atsReasons: ["Education + experience clearly separated", "Bullets for accomplishments", "ATS-friendly formatting"],
      affiliateUrl: "#",
    },
  ],
  General: [
    {
      id: "general-ats",
      title: "General ATS",
      description: "A clean, ATS-optimized template that keeps sections predictable.",
      atsReasons: ["Simple headings", "Bullet-first experience", "No columns that break parsing"],
      affiliateUrl: "#",
    },
  ],
}

