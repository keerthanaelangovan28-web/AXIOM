"use client"

import { Scale } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export function LexcryptumHeader() {
  return (
    <header
      className="flex items-center justify-between border-b px-6 py-4 transition-colors duration-300"
      style={{ borderColor: 'rgba(201, 168, 76, 0.18)', background: '#080C18' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl gold-glow"
          style={{ background: 'linear-gradient(135deg, #C9A84C, #E8C87A)' }}
        >
          <Scale className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1
            className="text-xl font-black tracking-tighter leading-tight"
            style={{ color: '#C9A84C', fontFamily: 'Playfair Display, serif' }}
          >
            LEX AXIOM
          </h1>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Verification Engine
          </p>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-4">
        <div
          className="hidden items-center gap-2 rounded-full border bg-secondary/50 px-4 py-1.5 sm:flex"
          style={{ borderColor: 'rgba(201, 168, 76, 0.25)', background: 'rgba(201, 168, 76, 0.05)' }}
        >
          <span
            className="h-2 w-2 rounded-full animate-pulse"
            style={{ backgroundColor: '#22C55E', boxShadow: '0 0 6px rgba(34,197,94,0.5)' }}
          />
          <span
            className="text-xs font-bold uppercase tracking-wide"
            style={{ color: '#C9A84C' }}
          >
            5 Layers Active
          </span>
        </div>
        <span className="text-[10px] font-mono font-bold text-muted-foreground">
          v1.0.4-BETA
        </span>
        <ThemeToggle />
      </div>
    </header>
  )
}
