"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"

import { getRecentAnalysis } from "@/lib/storage"
import type { AnalysisResponse } from "@/lib/api"
import { Card } from "@/components/ui/card"
import { ScoreRing } from "@/components/ScoreRing"
import { FeedbackSection } from "@/components/FeedbackSection"
import { ImmediateFixes } from "@/components/ImmediateFixes"
import { TemplateGrid } from "@/components/TemplateGrid"
import { AdSensePlaceholder } from "@/components/AdSensePlaceholder"
import { BuyCoffeeButton } from "@/components/BuyCoffeeButton"
import { Target, Tag, AlertCircle } from "lucide-react"

export default function DashboardPage() {
  const router = useRouter()
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null)

  useEffect(() => {
    const t = window.setTimeout(() => {
      setAnalysis(getRecentAnalysis())
    }, 0)
    return () => window.clearTimeout(t)
  }, [])

  const meta = useMemo(() => {
    if (!analysis) return null
    return {
      industry: analysis.industry,
      strengths: analysis.resumeStrengths,
    }
  }, [analysis])

  const scoreMessage = useMemo(() => {
    if (!analysis) return null
    if (analysis.score >= 80) return "Strong ATS compatibility. Focus on fine-tuning keywords for the target role."
    if (analysis.score >= 60) return "Good foundation. Prioritize the critical items first, then refine wording and measurable impact."
    return "ATS parsing risk is higher. Fix the critical formatting/structure issues before making smaller edits."
  }, [analysis])

  if (!analysis) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-900">
        <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-14">
          <Card className="bg-white/70 p-6 ring-1 ring-slate-200/70 backdrop-blur-md">
            <div className="text-lg font-semibold text-slate-900">No recent analysis found</div>
            <div className="mt-2 text-sm text-slate-600">
              Upload a resume on the home page to generate your ATS score.
            </div>
            <button
              type="button"
              className="mt-6 rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
              onClick={() => router.push("/")}
            >
              Go to upload
            </button>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-900">
      <main className="relative mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-14 sm:px-6">
        <header className="flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-600">ATS Resume Checker</div>
            <div className="text-2xl font-semibold">Results Dashboard</div>
          </div>
          <button
            type="button"
            className="rounded-xl bg-white/80 px-4 py-3 text-sm font-medium ring-1 ring-slate-200/70 backdrop-blur-md transition hover:bg-white/90"
            onClick={() => router.push("/")}
          >
            Upload another
          </button>
        </header>

        <section className="grid gap-6 lg:grid-cols-[220px_1fr] lg:items-start">
          <Card className="bg-white/70 p-6 ring-1 ring-slate-200/70 backdrop-blur-md">
            <ScoreRing score={analysis.score} />
            <div className="mt-4 text-center text-xs text-slate-600">
              Industry: <span className="text-slate-800 font-medium">{analysis.industry}</span>
            </div>
            {scoreMessage ? (
              <div className="mt-3 text-center text-xs text-slate-600">{scoreMessage}</div>
            ) : null}
          </Card>

          <div className="flex flex-col gap-4">
            {meta?.strengths?.length ? (
              <Card className="bg-white/70 p-4 ring-1 ring-slate-200/70 backdrop-blur-md">
                <div className="text-sm font-semibold text-slate-900">What’s working</div>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-800">
                  {meta.strengths.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </Card>
            ) : null}

            <ImmediateFixes analysis={analysis} />

            {analysis.missingKeywords?.length > 0 && (
              <Card className="bg-white/70 p-5 ring-1 ring-slate-200/70 backdrop-blur-md">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                    <Tag className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900">Missing JD Keywords</div>
                    <div className="text-[11px] text-slate-500">Key terms found in the JD but missing in your resume</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {analysis.missingKeywords.map((kw) => (
                    <span 
                      key={kw} 
                      className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </section>

        {analysis.roleMatchScore > 0 && (
          <section className="mt-2">
            <Card className="bg-indigo-600 p-6 text-white shadow-lg overflow-hidden relative">
              <div className="absolute right-[-20px] top-[-20px] h-32 w-32 rounded-full bg-white/10 blur-2xl" />
              <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-indigo-100">JD Alignment Score</div>
                    <div className="text-2xl font-bold">Your resume is {analysis.roleMatchScore}% ready for this role</div>
                  </div>
                </div>
                <div className="h-2 w-full max-w-[200px] rounded-full bg-white/20">
                  <div 
                    className="h-full rounded-full bg-white" 
                    style={{ width: `${analysis.roleMatchScore}%` }}
                  />
                </div>
              </div>
            </Card>
          </section>
        )}

        <FeedbackSection analysis={analysis} />

        <section className="mt-2">
          <Card className="bg-white/70 p-5 ring-1 ring-slate-200/70 backdrop-blur-md">
            <div className="text-sm font-semibold text-slate-900">ATS next steps</div>
            <div className="mt-1 text-xs text-slate-600">
              Even when your score is good, these changes typically improve parsing and recruiter readability.
            </div>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-800">
              <li>Use a standard, readable font (e.g., Arial/Helvetica/Times) and avoid fancy styling.</li>
              <li>Keep formatting simple: clear section headers and bullet points for responsibilities.</li>
              <li>Avoid tables/columns for critical content (ATS parsers can mis-order them).</li>
              <li>Use consistent job titles and date formats so dates can be extracted reliably.</li>
              <li>Make keywords match the job posting (skills + tool names + recurring role phrases).</li>
              <li>Save/export as a PDF with embedded fonts (and keep the file under a manageable size).</li>
            </ul>
          </Card>
        </section>

        <section className="mt-2">
          <div className="text-sm font-semibold mb-3 text-slate-900">Template Recommendation</div>
          <div className="rounded-2xl bg-white/70 p-5 ring-1 ring-slate-200/70 backdrop-blur-md">
            <TemplateGrid industry={analysis.industry} />
          </div>
        </section>

        <section className="mt-4">
          <div className="text-sm font-semibold mb-3 text-slate-900">Support / Monetization</div>
          <div className="grid gap-4 md:grid-cols-2">
            <AdSensePlaceholder />
            <div className="flex items-start">
              <BuyCoffeeButton />
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

