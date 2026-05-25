import { Card } from "@/components/ui/card"

export function AdSensePlaceholder({ label }: { label?: string }) {
  return (
    <Card className="bg-white/70 p-5 ring-1 ring-slate-200/70 backdrop-blur-md">
      <div className="text-sm font-semibold text-slate-900">
        {label ?? "Google AdSense (placeholder)"}
      </div>
      <div className="mt-2 text-xs text-slate-600">
        Reserved slot for monetization. Replace with your AdSense code later.
      </div>
      <div className="mt-4 h-24 rounded-xl bg-slate-50 ring-1 ring-slate-200" />
    </Card>
  )
}

