"use client"

import Image from "next/image"
import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

import { ResumeDropzone } from "@/components/ResumeDropzone"
import { analyzeResume, type AnalysisResponse } from "@/lib/api"
import { getRecentAnalysis, saveRecentAnalysis } from "@/lib/storage"
import { Card } from "@/components/ui/card"
import { AdSensePlaceholder } from "@/components/AdSensePlaceholder"
import { BuyCoffeeButton } from "@/components/BuyCoffeeButton"
import { Briefcase, FileText } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

export default function Home() {
  const router = useRouter()

  const [recent, setRecent] = useState<AnalysisResponse | null>(null)
  const [role, setRole] = useState("")
  const [jobDescription, setJobDescription] = useState("")

  const loadDemoJob = () => {
    setRole("Senior Frontend Engineer")
    setJobDescription(
      "We are looking for a Senior Frontend Engineer with 5+ years of experience.\n\n" +
      "Key Requirements:\n" +
      "- Expert in React, TypeScript, Next.js, and modern CSS frameworks (Tailwind, PostCSS).\n" +
      "- Strong experience with state management, animations (Framer Motion), and responsive design.\n" +
      "- Proven track record of optimizing web applications for performance and accessibility (WCAG).\n" +
      "- Experience working with REST APIs, GraphQL, and server-side rendering."
    )
  }

  useEffect(() => {
    const t = window.setTimeout(() => {
      setRecent(getRecentAnalysis())
    }, 0)
    return () => window.clearTimeout(t)
  }, [])

  const heroStats = useMemo(
    () => [
      { label: "ATS Score", value: recent?.score != null ? `${recent.score}` : "0-100" },
      { label: "Feedback", value: recent ? "Ready" : "Instant" },
      { label: "Private", value: "No signup" },
    ],
    [recent]
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-900">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-300px] h-[650px] w-[650px] -translate-x-1/2 rounded-full bg-indigo-500/15 blur-3xl" />
        <div className="absolute left-[-200px] top-[200px] h-[450px] w-[450px] rounded-full bg-cyan-500/15 blur-3xl" />
      </div>

      <main className="relative mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-14 sm:px-6">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 rounded-2xl bg-white/80 backdrop-blur-sm ring-1 ring-slate-200/70">
              <Image
                src="/icon.svg"
                alt="ATS"
                fill
                className="p-2"
                priority
                sizes="40px"
              />
            </div>
            <div>
              <div className="text-sm font-medium text-slate-700">ATSCHECKER</div>
              <div className="text-lg font-semibold">ATS Resume Checker</div>
            </div>
          </div>
          <div className="hidden md:block text-xs text-slate-600">
            Processed in-session • 24h local history
          </div>
        </header>

        <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col gap-5"
          >
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white/70 px-4 py-1 text-xs text-slate-700 ring-1 ring-slate-200/70 backdrop-blur-md">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
              Instant ATS scoring + fixes
            </div>
            <h1 className="text-balance text-4xl font-semibold leading-tight sm:text-5xl">
              Upload your resume. Get an ATS-ready score and immediate fixes.
            </h1>
            <p className="max-w-xl text-pretty text-slate-600">
              We extract text from your PDF/DOCX, score it across formatting, keywords,
              quantifiable impact, and contact details, then generate a clean list of
              “Immediate Fixes”.
            </p>

            {recent ? (
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <Card className="bg-white/70 ring-1 ring-slate-200/70 backdrop-blur-md px-4 py-3">
                  <div className="text-xs text-slate-600">Recent score (24h)</div>
                  <div className="text-2xl font-semibold">{recent.score}/100</div>
                </Card>
                <button
                  className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
                  onClick={() => router.push("/dashboard")}
                  type="button"
                >
                  Open Dashboard
                </button>
              </div>
            ) : null}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="flex flex-col gap-6"
          >
            <div className="grid grid-cols-3 gap-3">
              {heroStats.map((s) => (
                <Card
                  key={s.label}
                  className="bg-white/70 p-4 ring-1 ring-slate-200/70 backdrop-blur-md"
                >
                  <div className="text-[11px] text-slate-600">{s.label}</div>
                  <div className="text-lg font-semibold">{s.value}</div>
                </Card>
              ))}
            </div>

            <div className="rounded-2xl bg-white/70 p-5 ring-1 ring-slate-200/70 backdrop-blur-md overflow-hidden flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-slate-100/80 pb-3">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-indigo-500" />
                  <span className="font-semibold text-slate-800">Step 1: Target Job Details</span>
                </div>
                <button
                  type="button"
                  onClick={loadDemoJob}
                  className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-100/80 hover:text-indigo-700 active:bg-indigo-200 transition duration-200 cursor-pointer"
                >
                  ✨ Load Demo Job
                </button>
              </div>

              <div className="flex flex-col gap-3">
                <div className="space-y-1.5">
                  <label 
                    htmlFor="target-role-input"
                    className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 ml-1 cursor-pointer"
                  >
                    Target Role <span className="text-rose-500 font-bold">*</span>
                  </label>
                  <Input 
                    id="target-role-input"
                    name="target-role"
                    placeholder="e.g. Senior Frontend Engineer" 
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="bg-white/50 border-slate-200/60 focus:ring-indigo-500/20"
                  />
                </div>
                <div className="space-y-1.5">
                  <label 
                    htmlFor="job-description-input"
                    className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 ml-1 cursor-pointer"
                  >
                    Job Description <span className="text-rose-500 font-bold">*</span>
                  </label>
                  <Textarea 
                    id="job-description-input"
                    name="job-description"
                    placeholder="Paste the job description here for tailored scoring..." 
                    className="min-h-[120px] bg-white/50 border-slate-200/60 focus:ring-indigo-500/20 resize-none"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <ResumeDropzone
              disabled={!role.trim() || !jobDescription.trim()}
              onAnalyze={async (file) => {
                const analysis = await analyzeResume(file, jobDescription, role)
                saveRecentAnalysis(analysis)
                setRecent(analysis)
                router.push("/dashboard")
              }}
            />

            <div className="rounded-2xl bg-white/70 p-4 ring-1 ring-slate-200/70 backdrop-blur-md">
              <div className="text-xs font-medium text-slate-700">ATS-friendly templates</div>
              <div className="mt-2 flex gap-2 text-xs text-slate-600 flex-wrap">
                <span className="rounded-full bg-slate-50 px-3 py-1 ring-1 ring-slate-200/80">
                  Reverse-chronological
                </span>
                <span className="rounded-full bg-slate-50 px-3 py-1 ring-1 ring-slate-200/80">
                  Skills-first
                </span>
                <span className="rounded-full bg-slate-50 px-3 py-1 ring-1 ring-slate-200/80">
                  Project highlights
                </span>
              </div>
            </div>
          </motion.div>
        </section>

        <footer className="mt-6 flex flex-col gap-4 border-t border-slate-200/70 pt-6">
          <div className="grid gap-4 md:grid-cols-2">
            <AdSensePlaceholder />
            <div className="flex flex-col gap-3">
              <div className="text-xs text-slate-600">Support development:</div>
              <BuyCoffeeButton />
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}
