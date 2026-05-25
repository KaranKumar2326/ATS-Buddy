export type AnalysisResponse = {
  score: number
  industry: string
  immediateFixes: string[]
  feedback: {
    critical: string[]
    warning: string[]
    good: string[]
  }
  resumeStrengths: string[]
  missingKeywords: string[]
  roleMatchScore: number
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000"

export async function analyzeResume(
  file: File,
  jobDescription?: string,
  role?: string
): Promise<AnalysisResponse> {
  const formData = new FormData()
  formData.append("file", file)
  if (jobDescription) formData.append("job_description", jobDescription)
  if (role) formData.append("role", role)

  const res = await fetch(`${API_BASE_URL}/analyze`, {
    method: "POST",
    body: formData,
  })

  if (!res.ok) {
    let detail = "Upload failed."
    try {
      const data = await res.json()
      detail = data?.detail ?? detail
    } catch {
      // ignore parsing errors
    }
    throw new Error(typeof detail === "string" ? detail : "Upload failed.")
  }

  return (await res.json()) as AnalysisResponse
}

