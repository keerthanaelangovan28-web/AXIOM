'use client'

import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/dashboard/layout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Statistics } from '@/components/dashboard/statistics'
import { ActivityFeed } from '@/components/dashboard/activity-feed'
import { SecurityAlerts, RecentActivity } from '@/components/dashboard/alerts'
import { DashboardCharts } from '@/components/dashboard/charts'
import { FileText, TrendingUp, Clock, Lock, Scale } from 'lucide-react'

interface VerificationStats {
  verifications: number
  trend: string
}

export default function DashboardPage() {
  const [verStats, setVerStats] = useState<VerificationStats | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)

  useEffect(() => {
    fetch('/api/stats')
      .then((r) => r.json())
      .then((data) => setVerStats(data))
      .catch(() => setVerStats({ verifications: 0, trend: 'No verifications yet' }))
      .finally(() => setStatsLoading(false))
  }, [])

  const stats = [
    {
      title: 'Verifications',
      value: statsLoading ? '—' : verStats ? verStats.verifications.toLocaleString() : '0',
      description: 'Total verified documents',
      icon: FileText,
      trend: statsLoading ? 'Loading…' : verStats?.trend ?? 'No verifications yet',
      color: '#C9A84C',
    },
    {
      title: 'Success Rate',
      value: '99.8%',
      description: 'Average verification accuracy',
      icon: TrendingUp,
      trend: '+0.2% improvement',
      color: '#22C55E',
    },
    {
      title: 'Avg. Time',
      value: '2.3s',
      description: '5-layer pipeline duration',
      icon: Clock,
      trend: '-0.5s faster this week',
      color: '#E8C87A',
    },
    {
      title: 'Security Score',
      value: '100/100',
      description: 'Account security rating',
      icon: Lock,
      trend: 'All systems secure',
      color: '#22C55E',
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in duration-700">

        {/* Welcome Banner */}
        <div className="rounded-2xl p-8 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #0F1629 0%, #0A0E1A 100%)',
            border: '1px solid rgba(201, 168, 76, 0.25)',
          }}>
          {/* Ambient glow */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at 0% 50%, rgba(201,168,76,0.07) 0%, transparent 60%)' }} />
          <div className="relative z-10 flex items-start gap-4">
            <div className="hidden sm:flex h-12 w-12 shrink-0 items-center justify-center rounded-xl gold-glow"
              style={{ background: 'linear-gradient(135deg, #C9A84C, #E8C87A)' }}>
              <Scale className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-black mb-1" style={{ color: '#C9A84C', fontFamily: 'Playfair Display, serif' }}>
                Welcome to LexAxiom
              </h2>
              <p className="text-sm leading-relaxed max-w-2xl" style={{ color: '#64748B' }}>
                Your 5-layer AI legal document verification platform. All documents are encrypted using AES-256-GCM and verified via neuro-symbolic reasoning, constitutional AI, multi-agent debate, zero-knowledge proofs, and conformal prediction.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat) => (
            <Card key={stat.title}
              className="hover:scale-[1.02] transition-transform duration-300"
              style={{ background: '#0F1629', border: '1px solid rgba(201, 168, 76, 0.15)' }}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#64748B' }}>
                    {stat.title}
                  </CardTitle>
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg"
                    style={{ background: `${stat.color}18`, border: `1px solid ${stat.color}30` }}>
                    <stat.icon className="h-4 w-4" style={{ color: stat.color }} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-black transition-opacity duration-300 ${statsLoading && stat.title === 'Verifications' ? 'opacity-40 animate-pulse' : ''}`}
                  style={{ color: '#E2E8F0', fontFamily: 'Playfair Display, serif' }}>
                  {stat.value}
                </div>
                <p className="text-xs mt-1" style={{ color: '#64748B' }}>{stat.description}</p>
                <p className="text-xs mt-3 flex items-center gap-1.5 font-semibold" style={{ color: '#22C55E' }}>
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: '#22C55E' }} />
                  {stat.trend}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Feature #2 — Recharts Charts */}
        <DashboardCharts />

        {/* Statistics Chart */}
        <Statistics />

        {/* Activity Feed */}
        <ActivityFeed />

        {/* Security Alerts */}
        <div>
          <h3 className="text-lg font-black mb-4 uppercase tracking-tight"
            style={{ color: '#C9A84C', fontFamily: 'Playfair Display, serif' }}>
            Security Status
          </h3>
          <SecurityAlerts />
        </div>

        {/* Recent Activity */}
        <RecentActivity />

        {/* Security Protocol Card */}
        <Card style={{ background: '#0F1629', border: '1px solid rgba(201, 168, 76, 0.15)' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-black"
              style={{ color: '#C9A84C', fontFamily: 'Playfair Display, serif' }}>
              <Lock className="h-5 w-5" />
              Security Protocol
            </CardTitle>
            <CardDescription style={{ color: '#64748B' }}>
              Six-layer enterprise security stack
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'TLS 1.3 Transport', desc: 'Encrypted data stream', color: '#22C55E' },
                { label: 'AES-256-GCM', desc: 'Military-grade storage encryption', color: '#C9A84C' },
                { label: 'TOTP / MFA', desc: 'Time-based authenticator tokens', color: '#A855F7' },
                { label: 'RBAC v2.0', desc: 'Granular role-based access control', color: '#E8C87A' },
                { label: 'Audit Chain', desc: 'Immutable, exportable log trail', color: '#EF4444' },
                { label: 'Zero-Knowledge', desc: 'Privacy-preserving verification', color: '#14B8A6' },
              ].map((feature) => (
                <div key={feature.label}
                  className="flex items-start gap-3 p-3 rounded-xl transition-colors duration-200"
                  style={{ background: 'rgba(201, 168, 76, 0.03)' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(201, 168, 76, 0.08)' }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(201, 168, 76, 0.03)' }}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full shrink-0"
                    style={{ background: `${feature.color}18`, border: `1px solid ${feature.color}40` }}>
                    <span className="text-sm font-black" style={{ color: feature.color }}>✓</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: '#E2E8F0' }}>{feature.label}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#64748B' }}>{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
