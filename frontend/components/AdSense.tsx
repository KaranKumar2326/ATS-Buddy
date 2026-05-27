"use client"

import { useEffect, useState } from "react"

type AdSenseProps = {
  adSlot: string
  style?: React.CSSProperties
  adFormat?: string
  responsive?: boolean
}

export function AdSense({
  adSlot,
  style = { display: "block" },
  adFormat = "auto",
  responsive = true,
}: AdSenseProps) {
  const [hasError, setHasError] = useState(false)
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID

  useEffect(() => {
    if (!client) return

    // Introduce a short timeout to let the DOM layout complete and calculate available width
    const timer = setTimeout(() => {
      try {
        const adsbygoogle = (window as any).adsbygoogle || []
        adsbygoogle.push({})
      } catch (err) {
        console.warn("AdSense push warning:", err)
        setHasError(true)
      }
    }, 150)

    return () => clearTimeout(timer)
  }, [client])

  if (!client) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-4 text-center text-[10px] font-medium tracking-wide uppercase text-slate-400 select-none">
        ✨ Google AdSense Slot (Ready for ca-pub-id)
      </div>
    )
  }

  if (hasError) return null

  return (
    <div className="adsense-wrapper w-full overflow-hidden flex justify-center py-2 min-h-[90px]">
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client={client}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={responsive ? "true" : "false"}
      />
    </div>
  )
}
