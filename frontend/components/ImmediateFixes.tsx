"use client"

import { Card } from "@/components/ui/card"
import type { AnalysisResponse } from "@/lib/api"

export function ImmediateFixes({ analysis }: { analysis: AnalysisResponse }) {
  return (
    <Card className="bg-white/70 p-4 ring-1 ring-slate-200/70 backdrop-blur-md">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-slate-900">Immediate Fixes</div>
          <div className="text-xs text-slate-600 mt-1">
            Highest-impact edits to improve ATS parsing.
          </div>
        </div>
        <div className="rounded-full bg-slate-50 px-3 py-1 text-xs ring-1 ring-slate-200 text-slate-700">
          {analysis.immediateFixes.length} suggestions
        </div>
      </div>

      {analysis.immediateFixes.length === 0 ? (
        <div className="mt-3 text-sm text-slate-600">No fixes were generated.</div>
      ) : (
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-800">
          {analysis.immediateFixes.map((fix) => (
            <li key={fix}>{fix}</li>
          ))}
        </ul>
      )}
    </Card>
  )
}

