"use client"

import { useMemo } from "react"
import type { VerdictType } from "@/lib/types"

interface ConfidenceGaugeProps {
  cfiScore: number           // 0–1
  verdict: VerdictType
}

/** Feature #3 – SVG arc confidence gauge */
export function ConfidenceGauge({ cfiScore, verdict }: ConfidenceGaugeProps) {
  const R = 70
  const cx = 90
  const cy = 90
  const startAngle = 200
  const endAngle   = 340

  function polarToXY(angleDeg: number, radius: number) {
    const rad = ((angleDeg - 90) * Math.PI) / 180
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) }
  }

  function describeArc(from: number, to: number, r: number) {
    const s = polarToXY(from, r)
    const e = polarToXY(to, r)
    const large = to - from > 180 ? 1 : 0
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`
  }

  // total sweep = 280°
  const totalSweep = 280
  const fillAngle  = startAngle + cfiScore * totalSweep

  const gaugeColor = verdict === "VERIFIED" ? '#22C55E' : verdict === "UNCERTAIN" ? '#F59E0B' : '#EF4444'
  const bgTrack    = 'rgba(255,255,255,0.07)'

  const zones = useMemo(() => [
    { from: startAngle,       to: startAngle + totalSweep * 0.45, color: '#EF4444' },
    { from: startAngle + totalSweep * 0.45, to: startAngle + totalSweep * 0.70, color: '#F59E0B' },
    { from: startAngle + totalSweep * 0.70, to: startAngle + totalSweep,         color: '#22C55E' },
  ], [])

  const needle = polarToXY(fillAngle, R - 8)

  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border p-5" style={{ background: '#0F1629', borderColor: 'rgba(201,168,76,0.2)' }}>
      <h3 className="text-sm font-black uppercase tracking-widest self-start" style={{ color: '#C9A84C', fontFamily: 'Playfair Display, serif' }}>
        Confidence Gauge
      </h3>

      <svg width="180" height="110" viewBox="0 0 180 110">
        {/* Background track */}
        <path d={describeArc(startAngle, startAngle + totalSweep, R)} fill="none" stroke={bgTrack} strokeWidth="14" strokeLinecap="round" />

        {/* Coloured zones */}
        {zones.map((z, i) => (
          <path key={i} d={describeArc(z.from, z.to, R)} fill="none" stroke={`${z.color}35`} strokeWidth="14" />
        ))}

        {/* Fill arc */}
        <path
          d={describeArc(startAngle, fillAngle, R)}
          fill="none"
          stroke={gaugeColor}
          strokeWidth="12"
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 6px ${gaugeColor}80)`, transition: 'all 0.8s ease-out' }}
        />

        {/* Zone labels */}
        {[
          { angle: startAngle + totalSweep * 0.22, label: 'REJECT', color: '#EF4444' },
          { angle: startAngle + totalSweep * 0.58, label: 'UNCERTAIN', color: '#F59E0B' },
          { angle: startAngle + totalSweep * 0.85, label: 'VERIFIED', color: '#22C55E' },
        ].map(({ angle, label, color }) => {
          const p = polarToXY(angle, R - 28)
          return <text key={label} x={p.x} y={p.y} textAnchor="middle" fontSize="7" fill={color} fontWeight="bold" fontFamily="Inter, sans-serif">{label}</text>
        })}

        {/* Needle dot */}
        <circle cx={needle.x} cy={needle.y} r="5" fill={gaugeColor} style={{ filter: `drop-shadow(0 0 8px ${gaugeColor})` }} />

        {/* Center score */}
        <text x={cx} y={cy + 10} textAnchor="middle" fontSize="22" fontWeight="900" fill="#E2E8F0" fontFamily="Playfair Display, serif">
          {(cfiScore * 100).toFixed(0)}
        </text>
        <text x={cx} y={cy + 24} textAnchor="middle" fontSize="8" fill="#64748B">CFI SCORE</text>
      </svg>

      {/* Verdict label */}
      <div className="rounded-full px-4 py-1 text-sm font-black"
        style={{ background: `${gaugeColor}15`, color: gaugeColor, border: `1px solid ${gaugeColor}40`, fontFamily: 'Playfair Display, serif' }}>
        {verdict}
      </div>
    </div>
  )
}
