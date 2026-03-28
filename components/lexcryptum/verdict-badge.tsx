"use client"

import { ShieldCheck, ShieldAlert, ShieldQuestion } from "lucide-react"
import type { VerdictType } from "@/lib/types"

interface VerdictBadgeProps {
  verdict: VerdictType
  cfiScore?: number
  constitutionalScore?: number
  coverage?: number
}

export function VerdictBadge({ verdict, cfiScore, constitutionalScore, coverage }: VerdictBadgeProps) {
  const config = {
    VERIFIED: {
      icon: ShieldCheck,
      label: "VERIFIED",
      borderColor: 'rgba(34, 197, 94, 0.3)',
      bg: 'rgba(34, 197, 94, 0.05)',
      textColor: '#22C55E',
      glowColor: 'rgba(34, 197, 94, 0.15)',
      description: "Claim is mathematically proven and logically entailed from the source document.",
    },
    UNCERTAIN: {
      icon: ShieldQuestion,
      label: "UNCERTAIN",
      borderColor: 'rgba(245, 158, 11, 0.3)',
      bg: 'rgba(245, 158, 11, 0.05)',
      textColor: '#F59E0B',
      glowColor: 'rgba(245, 158, 11, 0.15)',
      description: "Mixed agent consensus. Additional manual review recommended.",
    },
    HALLUCINATION: {
      icon: ShieldAlert,
      label: "HALLUCINATION DETECTED",
      borderColor: 'rgba(239, 68, 68, 0.3)',
      bg: 'rgba(239, 68, 68, 0.05)',
      textColor: '#EF4444',
      glowColor: 'rgba(239, 68, 68, 0.15)',
      description: "Claim is not logically entailed from the source document. Key elements lack support.",
    },
  }

  const c = config[verdict]
  const Icon = c.icon

  const statBoxStyle = {
    background: 'rgba(15, 22, 41, 0.8)',
    border: '1px solid rgba(201, 168, 76, 0.15)',
  }

  return (
    <div
      className="animate-fade-in-up rounded-xl border p-6"
      style={{
        background: c.bg,
        borderColor: c.borderColor,
        boxShadow: `0 0 24px ${c.glowColor}`,
      }}
    >
      <div className="flex items-start gap-4">
        <div
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border"
          style={{
            background: c.bg,
            borderColor: c.borderColor,
            boxShadow: `0 0 14px ${c.glowColor}`,
          }}
        >
          <Icon className="h-8 w-8" style={{ color: c.textColor }} />
        </div>
        <div className="flex-1">
          <h3
            className="text-xl font-black tracking-tighter"
            style={{ color: c.textColor, fontFamily: 'Playfair Display, serif' }}
          >
            {c.label}
          </h3>
          <p className="mt-1 text-sm font-medium leading-relaxed" style={{ color: '#94A3B8' }}>
            {c.description}
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {cfiScore !== undefined && (
              <div className="rounded-xl px-3 py-2" style={statBoxStyle}>
                <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">CFI Confidence</p>
                <p className="font-mono text-base font-black" style={{ color: c.textColor }}>{cfiScore.toFixed(3)}</p>
              </div>
            )}
            {constitutionalScore !== undefined && (
              <div className="rounded-xl px-3 py-2" style={statBoxStyle}>
                <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Constitutional AI</p>
                <p className="font-mono text-base font-black" style={{ color: c.textColor }}>{constitutionalScore}/10</p>
              </div>
            )}
            {coverage !== undefined && (
              <div className="rounded-xl px-3 py-2" style={statBoxStyle}>
                <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Context Coverage</p>
                <p className="font-mono text-base font-black" style={{ color: c.textColor }}>{(coverage * 100).toFixed(0)}%</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
