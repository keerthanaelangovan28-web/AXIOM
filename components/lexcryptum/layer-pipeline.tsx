"use client"

import { useEffect, useRef, useState } from "react"
import { Brain, Scale, Users, Lock, BarChart3, Check, Loader2, AlertCircle, Clock } from "lucide-react"
import type { LayerStatus } from "@/lib/types"

const LAYERS = [
  { id: 1, name: "Neuro-Symbolic",    description: "Z3 SMT Solver",    icon: Brain,     accent: '#C9A84C' },
  { id: 2, name: "Constitutional AI", description: "10 Principles",    icon: Scale,     accent: '#10B981' },
  { id: 3, name: "Multi-Agent Debate",description: "3 Agents + CFI",  icon: Users,     accent: '#F59E0B' },
  { id: 4, name: "ZK Proofs",         description: "Groth16 / BN128",  icon: Lock,      accent: '#7C3AED' },
  { id: 5, name: "Conformal Predict.",description: "95% Coverage",     icon: BarChart3, accent: '#14B8A6' },
]

function StatusIcon({ status }: { status: LayerStatus }) {
  switch (status) {
    case "complete": return <Check className="h-3.5 w-3.5 text-success" />
    case "running":  return <Loader2 className="h-3.5 w-3.5 animate-spin" style={{ color: '#C9A84C' }} />
    case "error":    return <AlertCircle className="h-3.5 w-3.5 text-destructive" />
    default:         return <Clock className="h-3.5 w-3.5 text-muted-foreground" />
  }
}

/** Feature #1 – per-layer elapsed ms timer */
function LayerTimer({ running }: { running: boolean }) {
  const [ms, setMs] = useState(0)
  const startRef = useRef<number | null>(null)
  const rafRef   = useRef<number | null>(null)

  useEffect(() => {
    if (running) {
      startRef.current = Date.now()
      const tick = () => {
        setMs(Date.now() - (startRef.current ?? Date.now()))
        rafRef.current = requestAnimationFrame(tick)
      }
      rafRef.current = requestAnimationFrame(tick)
    } else {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [running])

  if (ms === 0 && !running) return null
  return (
    <span className="font-mono text-[10px] tabular-nums" style={{ color: '#64748B' }}>
      {ms}ms
    </span>
  )
}

/** Feature #1 – animated progress bar */
function LayerProgressBar({ accent, running }: { accent: string; running: boolean }) {
  const [progress, setProgress] = useState(0)
  const rafRef = useRef<number | null>(null)
  const startRef = useRef<number | null>(null)

  useEffect(() => {
    if (running) {
      setProgress(0)
      startRef.current = Date.now()
      const duration = 2800 // typical layer time
      const tick = () => {
        const elapsed = Date.now() - (startRef.current ?? Date.now())
        const p = Math.min((elapsed / duration) * 90, 90) // cap at 90% until done
        setProgress(p)
        if (p < 90) rafRef.current = requestAnimationFrame(tick)
      }
      rafRef.current = requestAnimationFrame(tick)
    } else {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      setProgress(0)
    }
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [running])

  if (!running) return null
  return (
    <div className="absolute bottom-0 left-0 right-0 h-0.5 overflow-hidden rounded-b-xl">
      <div
        className="h-full rounded-full transition-all"
        style={{
          width: `${progress}%`,
          background: `linear-gradient(90deg, ${accent}80, ${accent})`,
          boxShadow: `0 0 8px ${accent}60`,
          transition: 'width 0.1s linear',
        }}
      />
    </div>
  )
}

interface LayerPipelineProps {
  statuses: [LayerStatus, LayerStatus, LayerStatus, LayerStatus, LayerStatus]
}

export function LayerPipeline({ statuses }: LayerPipelineProps) {
  return (
    <div className="rounded-2xl border p-6 transition-all duration-500" style={{ background: '#0F1629', borderColor: 'rgba(201, 168, 76, 0.2)' }}>
      <h3 className="mb-5 text-sm font-black uppercase tracking-widest" style={{ color: '#C9A84C', fontFamily: 'Playfair Display, serif' }}>
        Verification Pipeline
      </h3>
      <div className="flex flex-col gap-2.5">
        {LAYERS.map((layer, idx) => {
          const status    = statuses[idx]
          const Icon      = layer.icon
          const isRunning  = status === "running"
          const isComplete = status === "complete"
          return (
            <div
              key={layer.id}
              className={`relative flex items-center gap-4 rounded-xl border px-4 py-3 overflow-hidden transition-all duration-300 ${isRunning ? "scale-[1.02]" : !isComplete ? "opacity-55" : ""}`}
              style={{
                background: isRunning  ? `${layer.accent}12` : isComplete ? 'rgba(34,197,94,0.05)' : 'rgba(255,255,255,0.02)',
                borderColor: isRunning ? `${layer.accent}50`  : isComplete ? 'rgba(34,197,94,0.25)'  : 'rgba(255,255,255,0.05)',
                boxShadow: isRunning   ? `0 0 16px ${layer.accent}20` : 'none',
              }}
            >
              {/* Layer progress bar (Feature #1) */}
              <LayerProgressBar accent={layer.accent} running={isRunning} />

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{
                background: isComplete ? 'rgba(34,197,94,0.12)' : isRunning ? `${layer.accent}18` : 'rgba(255,255,255,0.04)',
              }}>
                <Icon className="h-5 w-5" style={{ color: isComplete ? '#22C55E' : isRunning ? layer.accent : '#475569' }} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold tracking-tight" style={{ color: isComplete || isRunning ? '#E2E8F0' : '#475569' }}>
                  Layer {layer.id}: {layer.name}
                </p>
                <p className="text-[11px] font-medium mt-0.5" style={{ color: isComplete || isRunning ? '#94A3B8' : '#334155' }}>
                  {layer.description}
                </p>
              </div>
              {/* Timer (Feature #1) */}
              <LayerTimer running={isRunning} />
              <div className="flex h-6 w-6 items-center justify-center">
                <StatusIcon status={status} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
