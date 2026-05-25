"use client"

import { Button } from "@/components/ui/button"

export function BuyCoffeeButton({ url }: { url?: string }) {
  const coffeeUrl = url ?? process.env.NEXT_PUBLIC_BUY_ME_A_COFFEE_URL

  return (
    <Button
      type="button"
      className="w-full rounded-2xl bg-slate-900 text-white hover:bg-slate-800 ring-1 ring-slate-800/40"
      onClick={() => {
        const target = coffeeUrl ?? "https://buymeacoffee.com/"
        window.open(target, "_blank", "noopener,noreferrer")
      }}
    >
      Buy Me a Coffee
    </Button>
  )
}

