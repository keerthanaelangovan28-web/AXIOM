'use client'

import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/dashboard/layout'
import { History, ShieldCheck, ShieldAlert, ShieldQuestion, RotateCcw, Trash2, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

interface HistoryEntry {
  id: number
  timestamp: string
  query: string
  verdict: 'VERIFIED' | 'UNCERTAIN' | 'HALLUCINATION'
  cfiScore: number
  constitutionalScore: number
  coverage: number
}

const verdictConfig = {
  VERIFIED:      { icon: ShieldCheck, color: '#22C55E', bg: 'rgba(34,197,94,0.1)',   border: 'rgba(34,197,94,0.25)' },
  UNCERTAIN:     { icon: ShieldQuestion, color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)' },
  HALLUCINATION: { icon: ShieldAlert, color: '#EF4444', bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.25)' },
}

export default function HistoryPage() {
  const router = useRouter()
  const [entries, setEntries] = useState<HistoryEntry[]>([])

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('lexaxiom_history') || '[]')
      setEntries(stored)
    } catch { setEntries([]) }
  }, [])

  function clearAll() {
    localStorage.removeItem('lexaxiom_history')
    setEntries([])
  }

  function formatTime(iso: string) {
    try { return new Date(iso).toLocaleString() } catch { return iso }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in fade-in duration-700">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gold-glow"
              style={{ background: 'linear-gradient(135deg, #C9A84C, #E8C87A)' }}>
              <History className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black" style={{ color: '#C9A84C', fontFamily: 'Playfair Display, serif' }}>
                Verification History
              </h1>
              <p className="text-xs" style={{ color: '#64748B' }}>{entries.length} past verification{entries.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
          {entries.length > 0 && (
            <Button variant="outline" size="sm" onClick={clearAll} className="gap-2 bg-transparent text-xs"
              style={{ borderColor: 'rgba(239,68,68,0.3)', color: '#EF4444' }}>
              <Trash2 className="h-3.5 w-3.5" /> Clear All
            </Button>
          )}
        </div>

        {entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 rounded-2xl border border-dashed"
            style={{ borderColor: 'rgba(201,168,76,0.2)', background: '#0F1629' }}>
            <History className="h-10 w-10 mb-4" style={{ color: '#334155' }} />
            <h3 className="text-base font-bold mb-1" style={{ color: '#E2E8F0' }}>No verifications yet</h3>
            <p className="text-sm mb-4" style={{ color: '#64748B' }}>
              Run a verification on the Verify page and it will appear here.
            </p>
            <Button onClick={() => router.push('/dashboard/verify')}
              className="font-bold" style={{ background: 'linear-gradient(135deg, #C9A84C, #E8C87A)', color: '#0A0E1A' }}>
              Go to Verify
            </Button>
          </div>
        ) : (
          <div className="rounded-2xl border overflow-hidden" style={{ background: '#0F1629', borderColor: 'rgba(201,168,76,0.2)' }}>
            {/* Table header */}
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3 text-[10px] font-black uppercase tracking-widest"
              style={{ background: 'rgba(201,168,76,0.06)', color: '#64748B', borderBottom: '1px solid rgba(201,168,76,0.1)' }}>
              <span>Query</span>
              <span>Verdict</span>
              <span>CFI</span>
              <span>Constitutional</span>
              <span>Coverage</span>
              <span>Time</span>
            </div>

            {entries.map((entry, i) => {
              const cfg = verdictConfig[entry.verdict] ?? verdictConfig.UNCERTAIN
              const Icon = cfg.icon
              return (
                <div key={entry.id}
                  className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-4 items-center px-5 py-3.5 border-b transition-colors hover:bg-white/[0.02] cursor-pointer"
                  style={{ borderColor: 'rgba(255,255,255,0.04)' }}
                  onClick={() => router.push('/dashboard/verify')}>
                  <p className="truncate text-sm font-medium" style={{ color: '#E2E8F0' }}>{entry.query}</p>
                  <div className="flex items-center gap-1.5 rounded-full px-2.5 py-1 w-fit"
                    style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}>
                    <Icon className="h-3.5 w-3.5" style={{ color: cfg.color }} />
                    <span className="text-[10px] font-black" style={{ color: cfg.color }}>
                      {entry.verdict.slice(0, 7)}
                    </span>
                  </div>
                  <span className="font-mono text-sm font-bold" style={{ color: cfg.color }}>{entry.cfiScore.toFixed(3)}</span>
                  <span className="font-mono text-sm" style={{ color: '#C9A84C' }}>{entry.constitutionalScore}/10</span>
                  <span className="font-mono text-sm" style={{ color: '#14B8A6' }}>{(entry.coverage * 100).toFixed(0)}%</span>
                  <div className="flex items-center gap-1 text-[10px]" style={{ color: '#475569' }}>
                    <Clock className="h-3 w-3" />
                    <span className="whitespace-nowrap">{formatTime(entry.timestamp)}</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Re-verify CTA */}
        {entries.length > 0 && (
          <div className="flex justify-end">
            <Button onClick={() => router.push('/dashboard/verify')}
              className="gap-2 font-bold" style={{ background: 'linear-gradient(135deg, #C9A84C, #E8C87A)', color: '#0A0E1A' }}>
              <RotateCcw className="h-4 w-4" />
              New Verification
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
