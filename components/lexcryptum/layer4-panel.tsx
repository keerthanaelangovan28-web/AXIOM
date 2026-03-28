"use client"

import { Lock, Copy, Check } from "lucide-react"
import { useState } from "react"
import type { Layer4Result } from "@/lib/types"

interface Layer4PanelProps {
  result: Layer4Result
}

const VIOLET = '#7C3AED'
const VIOLET_BG = 'rgba(124, 58, 237, '

export function Layer4Panel({ result }: Layer4PanelProps) {
  const [copied, setCopied] = useState(false)

  function copyHash() {
    navigator.clipboard.writeText(result.zkProofHash)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const cellStyle = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }

  return (
    <div className="animate-fade-in-up rounded-xl border p-5" style={{ background: '#0F1629', borderColor: `${VIOLET_BG}0.2)` }}>
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: `${VIOLET_BG}0.12)`, border: `1px solid ${VIOLET_BG}0.3)` }}>
          <Lock className="h-5 w-5" style={{ color: VIOLET }} />
        </div>
        <h3 className="text-sm font-black tracking-tight" style={{ color: '#E2E8F0', fontFamily: 'Playfair Display, serif' }}>
          Layer 4: Zero-Knowledge Proofs
        </h3>
        <span className="ml-auto rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-bold text-success">
          Proof Generated
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {/* Proof Hash */}
        <div className="rounded-lg p-3" style={{ background: `${VIOLET_BG}0.05)`, border: `1px solid ${VIOLET_BG}0.2)` }}>
          <p className="mb-1 text-[10px] font-medium" style={{ color: '#64748B' }}>ZK-SNARK Proof Hash</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 truncate text-[10px] font-mono" style={{ color: VIOLET }}>{result.zkProofHash}</code>
            <button type="button" onClick={copyHash} className="shrink-0 opacity-60 hover:opacity-100 transition-opacity">
              {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" style={{ color: '#64748B' }} />}
            </button>
          </div>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Circuit Hash', value: `${result.circuitHash.slice(0, 20)}...` },
            { label: 'Proof Size',   value: `${result.proofSizeBytes} bytes` },
            { label: 'Verification', value: `${result.verificationTimeMs}ms` },
            { label: 'Protocol',     value: 'ZK-SNARK (Groth16)' },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-lg p-2.5" style={cellStyle}>
              <p className="text-[10px] text-muted-foreground">{label}</p>
              <p className="font-mono text-[10px]" style={{ color: '#E2E8F0' }}>{value}</p>
            </div>
          ))}
        </div>

        {/* QR visual */}
        <div className="flex items-center justify-center rounded-lg border border-dashed p-4" style={{ borderColor: `${VIOLET_BG}0.25)`, background: `${VIOLET_BG}0.04)` }}>
          <div className="flex flex-col items-center gap-2">
            <div className="grid h-20 w-20 grid-cols-5 grid-rows-5 gap-0.5">
              {Array(25).fill(0).map((_, i) => (
                <div key={i} className="rounded-sm" style={{ background: Math.random() > 0.4 ? VIOLET : 'rgba(124,58,237,0.1)' }} />
              ))}
            </div>
            <p className="text-[9px]" style={{ color: '#64748B' }}>LexAxiom Verification QR</p>
          </div>
        </div>
      </div>
    </div>
  )
}
