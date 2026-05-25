"use client"

import { useMemo } from "react"

type ScoreRingProps = {
  score: number
  size?: number
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

export function ScoreRing({ score, size = 160 }: ScoreRingProps) {
  const { pct, r, circumference, colorClass } = useMemo(() => {
    const pct = clamp(score, 0, 100)
    const strokeWidth = 10
    const r = (size - strokeWidth) / 2
    const circumference = 2 * Math.PI * r

    const colorClass =
      pct >= 80
        ? "text-emerald-400"
        : pct >= 60
          ? "text-cyan-400"
          : pct >= 40
            ? "text-amber-300"
            : "text-rose-400"

    return { pct, r, circumference, colorClass }
  }, [score, size])

  const dashOffset = circumference * (1 - pct / 100)

  return (
    <div className="flex flex-col items-center justify-center gap-1">
      <div className="relative">
        <svg width={size} height={size} className="block">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke="rgba(15,23,42,0.10)"
            strokeWidth={10}
            fill="transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke="currentColor"
            strokeWidth={10}
            strokeLinecap="round"
            fill="transparent"
            className={colorClass}
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-3xl font-semibold text-slate-900">{Math.round(pct)}</div>
          <div className="text-xs text-slate-600">ATS</div>
        </div>
      </div>
    </div>
  )
}

