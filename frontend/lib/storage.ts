import type { AnalysisResponse } from "./api"

const STORAGE_KEY = "ats_resume_checker_recent_analysis_v1"
const TTL_MS = 24 * 60 * 60 * 1000

type StoredAnalysis = {
  expiresAt: number
  analysis: AnalysisResponse
}

export function saveRecentAnalysis(analysis: AnalysisResponse) {
  if (typeof window === "undefined") return
  const payload: StoredAnalysis = {
    expiresAt: Date.now() + TTL_MS,
    analysis,
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
}

export function getRecentAnalysis(): AnalysisResponse | null {
  if (typeof window === "undefined") return null
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null

  try {
    const payload = JSON.parse(raw) as StoredAnalysis
    if (!payload?.expiresAt || !payload?.analysis) return null
    if (Date.now() > payload.expiresAt) {
      localStorage.removeItem(STORAGE_KEY)
      return null
    }
    return payload.analysis
  } catch {
    return null
  }
}

