"use client"

import { Card } from "@/components/ui/card"
import type { AnalysisResponse } from "@/lib/api"

type FeedbackSectionProps = {
  analysis: AnalysisResponse
}

export function FeedbackSection({ analysis }: FeedbackSectionProps) {
  const criticalCount = analysis.feedback.critical.length
  const warningCount = analysis.feedback.warning.length
  const goodCount = analysis.feedback.good.length

  return (
    <section className="grid gap-4 md:grid-cols-2">
      <Card className="bg-white/70 p-4 ring-1 ring-slate-200/70 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-slate-900">What can be improved</div>
          <div className="rounded-full bg-slate-50 px-3 py-1 text-xs ring-1 ring-slate-200/80 text-slate-700">
            {criticalCount + warningCount} items
          </div>
        </div>

        <div className="mt-3 space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-slate-900">Critical</div>
              <div className="rounded-full bg-rose-50 px-3 py-1 text-xs ring-1 ring-rose-200 text-rose-800">
                {criticalCount} items
              </div>
            </div>
            {analysis.feedback.critical.length === 0 ? (
              <div className="mt-3 text-sm text-slate-600">No critical issues detected.</div>
            ) : (
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-800">
                {analysis.feedback.critical.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-slate-900">Warning</div>
              <div className="rounded-full bg-amber-50 px-3 py-1 text-xs ring-1 ring-amber-200 text-amber-800">
                {warningCount} items
              </div>
            </div>
            {analysis.feedback.warning.length === 0 ? (
              <div className="mt-3 text-sm text-slate-600">No warnings detected.</div>
            ) : (
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-800">
                {analysis.feedback.warning.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </Card>

      <Card className="bg-white/70 p-4 ring-1 ring-slate-200/70 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-slate-900">What’s good</div>
          <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs ring-1 ring-emerald-200 text-emerald-800">
            {goodCount} items
          </div>
        </div>
        {analysis.feedback.good.length === 0 ? (
          <div className="mt-3 text-sm text-slate-600">No strengths were reported.</div>
        ) : (
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-800">
            {analysis.feedback.good.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        )}
      </Card>
    </section>
  )
}

