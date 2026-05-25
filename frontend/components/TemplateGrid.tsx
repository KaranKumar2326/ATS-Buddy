"use client"

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { templateCatalog } from "@/lib/templateCatalog"

export function TemplateGrid({ industry }: { industry: string }) {
  const templates =
    templateCatalog[industry] ?? templateCatalog["General"] ?? []

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {templates.map((t) => (
        <Card
          key={t.id}
          className="bg-white/70 p-5 ring-1 ring-slate-200/70 backdrop-blur-md"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm font-semibold">{t.title}</div>
              <div className="mt-1 text-xs text-slate-600">{t.description}</div>
            </div>
            <Badge className="bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200">
              ATS-Friendly
            </Badge>
          </div>

          <div className="mt-3">
            <div className="text-xs font-medium text-slate-700">Why it works</div>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-slate-700">
              {t.atsReasons.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <a
              href={t.affiliateUrl}
              target="_blank"
              rel="noreferrer"
              className="pointer-events-none rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-700 ring-1 ring-slate-200 opacity-80"
            >
              Affiliate link placeholder
            </a>
          </div>
        </Card>
      ))}
    </div>
  )
}

