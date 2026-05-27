"use client"

import { useCallback, useMemo, useState } from "react"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

type ResumeDropzoneProps = {
  onAnalyze: (file: File) => Promise<void>
  disabled?: boolean
  accepted?: string[]
  maxBytes?: number
  onPickedFile?: (file: File) => void
}

export function ResumeDropzone({
  onAnalyze,
  disabled = false,
  accepted = [".pdf", ".docx"],
  maxBytes = 10 * 1024 * 1024,
  onPickedFile,
}: ResumeDropzoneProps) {
  const acceptedLabel = useMemo(() => accepted.join(", ").toUpperCase(), [accepted])

  const [isDragging, setIsDragging] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const validate = useCallback(
    (file: File) => {
      const fileName = file.name.toLowerCase()
      const isAccepted = accepted.some((ext) => fileName.endsWith(ext.toLowerCase()))
      if (!isAccepted) {
        return `Unsupported file type. Please upload a ${acceptedLabel}.`
      }
      if (file.size > maxBytes) {
        return `File too large. Max size is ${Math.round(maxBytes / 1024 / 1024)}MB.`
      }
      return null
    },
    [accepted, acceptedLabel, maxBytes]
  )

  const handleFile = useCallback(
    async (file: File) => {
      if (disabled) return
      setError(null)

      const validationError = validate(file)
      if (validationError) {
        setError(validationError)
        return
      }

      onPickedFile?.(file)

      setIsAnalyzing(true)
      try {
        await onAnalyze(file)
      } catch (e) {
        setError(e instanceof Error ? e.message : "Analysis failed.")
      } finally {
        setIsAnalyzing(false)
      }
    },
    [disabled, onAnalyze, onPickedFile, validate]
  )

  const onDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)

      const file = e.dataTransfer.files?.[0]
      if (file) await handleFile(file)
    },
    [handleFile]
  )

  const onBrowse = useCallback(() => {
    const el = document.getElementById("resume-file-picker") as HTMLInputElement | null
    el?.click()
  }, [])

  return (
    <Card
      className={[
        "relative overflow-hidden rounded-2xl border bg-white/70 p-6 shadow-sm backdrop-blur-md transition-all duration-300",
        isDragging && !disabled ? "border-indigo-500 ring-1 ring-indigo-500/20" : "border-slate-200/70",
        disabled ? "opacity-60 bg-slate-50/50 cursor-not-allowed select-none" : "hover:border-slate-300",
      ].join(" ")}
      onDragEnter={(e) => {
        if (disabled) return
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(true)
      }}
      onDragOver={(e) => {
        if (disabled) return
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(true)
      }}
      onDragLeave={(e) => {
        if (disabled) return
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
      }}
      onDrop={(e) => {
        if (disabled) return
        onDrop(e)
      }}
    >
      <input
        id="resume-file-picker"
        name="resume-file"
        type="file"
        accept={accepted.map((ext) => `.${ext.replace(".", "")}`).join(",")}
        className="hidden"
        aria-label="Upload resume file"
        disabled={disabled || isAnalyzing}
        onChange={async (e) => {
          const file = e.target.files?.[0]
          if (file) await handleFile(file)
        }}
      />

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className={`text-base font-semibold ${disabled ? "text-slate-400" : "text-slate-900"}`}>
            Step 2: Upload your resume
          </div>
          <div className="text-sm text-slate-500">
            {disabled ? (
              <span className="text-amber-600/90 font-medium flex items-center gap-1.5 animate-pulse">
                ⚠️ Fill in Step 1 (Target Job Details) to unlock upload.
              </span>
            ) : (
              <>Drag and drop a <span className="font-medium">{acceptedLabel}</span> file, or click Browse.</>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            type="button"
            onClick={onBrowse}
            disabled={disabled || isAnalyzing}
            className="bg-slate-900 text-white hover:bg-slate-800"
          >
            {isAnalyzing ? "Analyzing..." : "Browse file"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setError(null)}
            disabled={disabled || isAnalyzing}
          >
            Reset
          </Button>
        </div>

        {error ? (
          <Alert variant="destructive" className="mt-2">
            <AlertTitle>Upload problem</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        <div className="text-xs text-muted-foreground">
          No signup. Everything is processed in-session.
        </div>
      </div>
    </Card>
  )
}

