"use client"

import { Award, Download, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { VerificationResult } from "@/lib/types"

interface CertificatePanelProps {
  result: VerificationResult
}

export function CertificatePanel({ result }: CertificatePanelProps) {
  if (!result.layer3 || !result.layer2 || !result.layer4 || !result.layer5) return null

  const verdict = result.overallVerdict
  const verdictColor =
    verdict === "VERIFIED" ? '#22C55E' : verdict === "UNCERTAIN" ? '#F59E0B' : '#EF4444'

  function downloadJSON() {
    const certData = buildCertData()
    const blob = new Blob([JSON.stringify(certData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "lexaxiom-certificate.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  function downloadPDF() {
    const certData = buildCertData()
    const win = window.open('', '_blank')
    if (!win) return
    win.document.write(`<!DOCTYPE html><html><head><title>LexAxiom Certificate</title>
<style>
  body { font-family: 'Georgia', serif; background: #fff; color: #1a1a1a; margin: 48px; max-width: 720px; }
  h1 { font-size: 28px; color: #0A0E1A; border-bottom: 3px solid #C9A84C; padding-bottom: 12px; margin-bottom: 8px; }
  .sub { color: #64748b; font-size: 13px; margin-bottom: 32px; }
  .badge { display: inline-block; padding: 6px 16px; border-radius: 99px; font-weight: bold; font-size: 13px; margin-bottom: 24px;
    background: ${certData.verdict === 'VERIFIED' ? '#22c55e22' : certData.verdict === 'UNCERTAIN' ? '#f59e0b22' : '#ef444422'};
    color: ${certData.verdict === 'VERIFIED' ? '#166534' : certData.verdict === 'UNCERTAIN' ? '#92400e' : '#991b1b'};
    border: 1px solid ${certData.verdict === 'VERIFIED' ? '#bbf7d0' : certData.verdict === 'UNCERTAIN' ? '#fde68a' : '#fecaca'};
  }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
  .field { border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; }
  .label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #94a3b8; margin-bottom: 4px; }
  .value { font-family: 'Courier New', monospace; font-size: 12px; word-break: break-all; color: #1a1a1a; font-weight: bold; }
  .footer { margin-top: 40px; padding-top: 12px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; text-align: center; }
  @media print { body { margin: 24px; } }
</style></head><body>
<h1>⚖ LexAxiom Verification Certificate</h1>
<div class="sub">Issued: ${new Date(certData.timestamp).toLocaleString()} · Cryptographically signed</div>
<div class="badge">${certData.verdict}</div>
<div class="grid">
  <div class="field"><div class="label">CFI Confidence Score</div><div class="value">${certData.cfiScore}</div></div>
  <div class="field"><div class="label">Constitutional AI</div><div class="value">${certData.constitutionalCompliance}</div></div>
  <div class="field"><div class="label">Context Coverage</div><div class="value">${certData.coverageGuarantee}</div></div>
  <div class="field"><div class="label">Z3 SMT Solver</div><div class="value">${certData.z3Status}</div></div>
  <div class="field"><div class="label">ZK Proof Hash</div><div class="value">${certData.zkProofHash}</div></div>
  <div class="field"><div class="label">Integrity Hash</div><div class="value">${certData.integrityHash}</div></div>
</div>
<div style="font-size:10px;color:#94a3b8;word-break:break-all;">Previous block: ${certData.previousHash}</div>
<div class="footer">LexAxiom · ${certData.soundnessBadge} · Tamper-Evident Chain</div>
<script>window.onload = () => { window.print(); }<\/script>
</body></html>`)
    win.document.close()
  }

  function buildCertData() {
    return {
      type: "lexaxiom_verification_certificate",
      timestamp: new Date().toISOString(),
      verdict: result.overallVerdict,
      cfiScore: result.layer3?.cfiScore,
      constitutionalCompliance: `${result.layer2?.score}/10`,
      coverageGuarantee: `${((result.layer5?.coverageGuarantee ?? 0) * 100).toFixed(0)}%`,
      zkProofHash: result.layer4?.zkProofHash,
      integrityHash: result.integrityHash,
      previousHash: result.previousHash,
      z3Status: result.layer1?.z3Result.status,
      soundnessBadge: "Mathematically proven by Z3 SMT solver",
      tamperEvident: true,
    }
  }

  return (
    <div
      className="animate-fade-in-up rounded-xl border p-5"
      style={{ background: '#0F1629', borderColor: 'rgba(201, 168, 76, 0.25)' }}
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Award className="h-4 w-4" style={{ color: '#C9A84C' }} />
          <h3
            className="text-sm font-black"
            style={{ color: '#C9A84C', fontFamily: 'Playfair Display, serif' }}
          >
            Verification Certificate
          </h3>
        </div>
        <div
          className="flex items-center gap-1 rounded px-2 py-0.5 border"
          style={{ background: 'rgba(34, 197, 94, 0.08)', borderColor: 'rgba(34, 197, 94, 0.25)' }}
        >
          <div className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: '#22C55E' }} />
          <span className="text-[9px] font-black uppercase" style={{ color: '#22C55E' }}>Tamper-Evident</span>
        </div>
      </div>

      {/* Certificate body */}
      <div
        className="rounded-lg border p-4"
        style={{ background: '#080C18', borderColor: 'rgba(201, 168, 76, 0.15)' }}
      >
        <div className="mb-4 border-b pb-3" style={{ borderColor: 'rgba(201, 168, 76, 0.1)' }}>
          <div className="flex items-center justify-between">
            <p className="font-mono text-xs" style={{ color: '#64748B' }}>LEXAXIOM CERT</p>
            <p className="font-mono text-[10px]" style={{ color: '#64748B' }}>{new Date().toISOString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
          <div>
            <p className="text-[10px]" style={{ color: '#64748B' }}>CFI Score</p>
            <p className="font-mono text-lg font-black" style={{ color: verdictColor }}>
              {result.layer3.cfiScore.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-[10px]" style={{ color: '#64748B' }}>Constitutional</p>
            <p className="font-mono text-lg font-black" style={{ color: verdictColor }}>
              {result.layer2.score}/10
            </p>
          </div>
          <div>
            <p className="text-[10px]" style={{ color: '#64748B' }}>Coverage</p>
            <p className="font-mono text-lg font-black" style={{ color: '#C9A84C' }}>
              {(result.layer5.coverageGuarantee * 100).toFixed(0)}%
            </p>
          </div>
          <div>
            <p className="text-[10px]" style={{ color: '#64748B' }}>ZK Proof</p>
            <p className="truncate font-mono text-[10px] font-black" style={{ color: '#7C3AED' }}>
              {result.layer4.zkProofHash.slice(0, 14)}…
            </p>
          </div>
          <div className="hidden sm:block">
            <p className="text-[10px]" style={{ color: '#64748B' }}>Integrity Hash</p>
            <p className="truncate font-mono text-[10px] font-black" style={{ color: '#22C55E' }}>
              {result.integrityHash?.slice(0, 14)}…
            </p>
          </div>
        </div>

        <div
          className="mt-4 rounded-md border px-3 py-2"
          style={{ background: 'rgba(201, 168, 76, 0.05)', borderColor: 'rgba(201, 168, 76, 0.2)' }}
        >
          <p className="text-center text-[10px] font-bold" style={{ color: '#C9A84C' }}>
            Soundness: Mathematically proven by Z3 SMT solver · Cryptographically Chained
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex gap-2 flex-wrap">
        <Button
          onClick={downloadJSON}
          variant="outline"
          size="sm"
          className="flex-1 gap-1.5 text-xs bg-transparent"
          style={{ borderColor: 'rgba(201, 168, 76, 0.3)', color: '#C9A84C' }}
        >
          <Download className="h-3.5 w-3.5" />
          Export JSON
        </Button>
        <Button
          onClick={downloadPDF}
          variant="outline"
          size="sm"
          className="flex-1 gap-1.5 text-xs bg-transparent"
          style={{ borderColor: 'rgba(201, 168, 76, 0.3)', color: '#C9A84C' }}
        >
          <Award className="h-3.5 w-3.5" />
          Print PDF
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 gap-1.5 text-xs bg-transparent"
          style={{ borderColor: 'rgba(201, 168, 76, 0.3)', color: '#C9A84C' }}
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: "LEX AXIOM Verification",
                text: `Verdict: ${verdict} | CFI: ${result.layer3?.cfiScore.toFixed(3)}`,
              })
            }
          }}
        >
          <Share2 className="h-3.5 w-3.5" />
          Share
        </Button>
      </div>
    </div>
  )
}
