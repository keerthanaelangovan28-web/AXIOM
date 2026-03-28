"use client"

import { Brain, Tag } from "lucide-react"
import type { Layer1Result } from "@/lib/types"

interface Layer1PanelProps {
  result: Layer1Result
}

const GOLD = '#C9A84C'
const GOLD_LIGHT = '#E8C87A'

export function Layer1Panel({ result }: Layer1PanelProps) {
  return (
    <div className="animate-fade-in-up rounded-2xl border p-6" style={{ background: '#0F1629', borderColor: 'rgba(201, 168, 76, 0.2)' }}>
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl gold-glow" style={{ background: 'rgba(201, 168, 76, 0.12)' }}>
          <Brain className="h-6 w-6" style={{ color: GOLD }} />
        </div>
        <h3 className="text-base font-black tracking-tight" style={{ color: '#E2E8F0', fontFamily: 'Playfair Display, serif' }}>
          Layer 1: Neuro-Symbolic Verification
        </h3>
        <span className={`ml-auto rounded-full px-3 py-1 text-[10px] font-black tracking-wider shadow-sm ${
          result.z3Result.status === "SAT"
            ? "bg-success/20 text-success border border-success/30"
            : "bg-destructive/20 text-destructive border border-destructive/30"
        }`}>
          Z3: {result.z3Result.status}
        </span>
      </div>

      {result.relevantClause && (
        <div className="mb-6 rounded-xl p-4" style={{ background: 'rgba(201, 168, 76, 0.05)', border: `1px solid rgba(201, 168, 76, 0.2)` }}>
          <p className="mb-2 text-[10px] font-black uppercase tracking-widest" style={{ color: GOLD }}>Primary Citation</p>
          <p className="text-sm font-medium italic border-l-4 pl-4" style={{ color: '#E2E8F0', borderColor: GOLD }}>
            &ldquo;{result.relevantClause}&rdquo;
          </p>
        </div>
      )}

      <div className="flex flex-col gap-6">
        {/* Deontic Logic */}
        <div>
          <p className="mb-3 text-[10px] font-black uppercase tracking-widest" style={{ color: '#64748B' }}>Deontic Logic Expansion</p>
          <div className="flex flex-col gap-2">
            {result.deonticParses.map((dp, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl px-4 py-3 border" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}>
                <span className={`rounded-lg px-2 py-1 font-mono text-xs font-black ${
                  dp.operator === "O" ? "bg-info/20 text-info"
                  : dp.operator === "P" ? "bg-success/20 text-success"
                  : "bg-destructive/20 text-destructive"
                }`}>
                  {dp.operator}()
                </span>
                <span className="text-xs font-bold" style={{ color: '#64748B' }}>{dp.label}:</span>
                <code className="text-xs font-mono font-bold" style={{ color: '#E2E8F0' }}>{dp.expression}</code>
              </div>
            ))}
          </div>
        </div>

        {/* Z3 Proof Tree */}
        <div>
          <p className="mb-3 text-[10px] font-black uppercase tracking-widest" style={{ color: '#64748B' }}>Inference Proof Tree</p>
          <div className="rounded-xl p-4 border" style={{ background: '#080C18', borderColor: 'rgba(255,255,255,0.05)' }}>
            <pre className="text-[10px] font-mono font-medium leading-relaxed" style={{ color: GOLD_LIGHT }}>
              {result.z3Result.proof_tree.join("\n")}
            </pre>
          </div>
        </div>

        {/* Entities */}
        <div>
          <p className="mb-3 text-[10px] font-black uppercase tracking-widest" style={{ color: '#64748B' }}>Ontological Mappings</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Parties",     items: result.entities.parties,          color: GOLD },
              { label: "Obligations", items: result.entities.obligations,       color: '#22C55E' },
              { label: "Conditions",  items: result.entities.conditions,        color: '#A855F7' },
              { label: "Temporal",    items: result.entities.temporalMarkers,   color: '#E8C87A' },
            ].map(({ label, items, color }) => (
              <div key={label} className="rounded-xl p-3 border transition-colors" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.05)' }}>
                <p className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest" style={{ color: '#64748B' }}>
                  <Tag className="h-3 w-3" style={{ color }} /> {label}
                </p>
                {items.length > 0 ? items.map((item, idx) => (
                  <p key={idx} className="text-[11px] font-medium mb-1" style={{ color: '#E2E8F0' }}>{item}</p>
                )) : <p className="text-[11px] italic" style={{ color: '#475569' }}>none detected</p>}
              </div>
            ))}
          </div>
        </div>

        {/* Z3 Trace */}
        <div>
          <p className="mb-3 text-[10px] font-black uppercase tracking-widest" style={{ color: '#64748B' }}>Low-Level Solver Pulse</p>
          <div className="rounded-xl p-4 border" style={{ background: 'rgba(255,255,255,0.01)', borderColor: 'rgba(255,255,255,0.04)' }}>
            <pre className="text-[10px] font-mono truncate" style={{ color: '#475569' }}>{result.z3Result.trace}</pre>
          </div>
        </div>
      </div>
    </div>
  )
}
