"use client"

import { BarChart3 } from "lucide-react"
import type { Layer5Result } from "@/lib/types"

interface Layer5PanelProps {
  result: Layer5Result
}

const TEAL = '#14B8A6'

export function Layer5Panel({ result }: Layer5PanelProps) {
  const entropyColor = result.legalEntropyScore < 0.3 ? '#22C55E'
    : result.legalEntropyScore < 0.6 ? '#F59E0B' : '#EF4444'

  return (
    <div className="animate-fade-in-up rounded-xl border p-5" style={{ background: '#0F1629', borderColor: 'rgba(20, 184, 166, 0.2)' }}>
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: 'rgba(20, 184, 166, 0.12)', border: '1px solid rgba(20, 184, 166, 0.3)' }}>
          <BarChart3 className="h-5 w-5" style={{ color: TEAL }} />
        </div>
        <h3 className="text-sm font-black tracking-tight" style={{ color: '#E2E8F0', fontFamily: 'Playfair Display, serif' }}>
          Layer 5: Conformal Prediction
        </h3>
        <span className="ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold"
          style={{ background: 'rgba(20,184,166,0.12)', color: TEAL, border: '1px solid rgba(20,184,166,0.3)' }}>
          {(result.coverageGuarantee * 100).toFixed(0)}% Coverage
        </span>
      </div>

      <div className="flex flex-col gap-4">
        {/* Prediction Set */}
        <div>
          <p className="mb-2 text-xs font-medium text-muted-foreground">Prediction Set</p>
          <div className="flex flex-wrap gap-1.5">
            {result.predictionSet.map((item, i) => (
              <span key={i} className="rounded-full px-2.5 py-1 text-[10px]"
                style={{ background: 'rgba(20,184,166,0.08)', border: '1px solid rgba(20,184,166,0.2)', color: TEAL }}>
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Legal Entropy */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">Legal Entropy Score</p>
            <span className="font-mono text-xs font-bold" style={{ color: entropyColor }}>
              {result.legalEntropyScore.toFixed(2)}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${result.legalEntropyScore * 100}%`, background: entropyColor }}
            />
          </div>
          <p className="mt-1 text-[9px] text-muted-foreground">
            {result.legalEntropyScore < 0.3 ? "Low ambiguity — precise legal terms"
              : result.legalEntropyScore < 0.6 ? "Moderate ambiguity — some vague terms"
              : "High ambiguity — significant vague language"}
          </p>
        </div>

        {/* Conformal Intervals */}
        <div>
          <p className="mb-2 text-xs font-medium text-muted-foreground">Conformal Intervals</p>
          <div className="flex flex-col gap-2">
            {result.conformalIntervals.map((ci, i) => (
              <div key={i} className="rounded-lg p-2.5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="mb-1 flex items-center justify-between">
                  <p className="text-[10px] font-semibold" style={{ color: '#E2E8F0' }}>{ci.label}</p>
                  <span className="text-[10px] font-mono" style={{ color: TEAL }}>
                    [{ci.lower.toFixed(2)}, {ci.upper.toFixed(2)}]
                  </span>
                </div>
                <div className="relative h-1.5 w-full rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div className="absolute h-full rounded-full" style={{ left: `${ci.lower * 100}%`, width: `${(ci.upper - ci.lower) * 100}%`, background: 'rgba(20,184,166,0.35)' }} />
                  <div className="absolute h-full w-1 rounded-full" style={{ left: `${((ci.lower + ci.upper) / 2) * 100}%`, background: TEAL }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
