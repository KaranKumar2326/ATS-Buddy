import { Card } from "@/components/ui/card"
import { AdSense } from "./AdSense"

export function AdSensePlaceholder({ label }: { label?: string }) {
  return (
    <Card className="bg-white/70 p-5 ring-1 ring-slate-200/70 backdrop-blur-md flex flex-col justify-center">
      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 select-none">
        {label ?? "Sponsored Advertisement"}
      </div>
      <AdSense adSlot="default-slot" />
    </Card>
  )
}

