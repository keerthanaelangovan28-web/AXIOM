'use client'

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'

const verificationData = [
  { day: 'Mon', verified: 12, uncertain: 3, hallucination: 1 },
  { day: 'Tue', verified: 18, uncertain: 4, hallucination: 2 },
  { day: 'Wed', verified: 9,  uncertain: 2, hallucination: 0 },
  { day: 'Thu', verified: 24, uncertain: 5, hallucination: 1 },
  { day: 'Fri', verified: 31, uncertain: 6, hallucination: 2 },
  { day: 'Sat', verified: 15, uncertain: 2, hallucination: 1 },
  { day: 'Sun', verified: 22, uncertain: 4, hallucination: 0 },
]

const pieData = [
  { name: 'Verified',  value: 131, color: '#22C55E' },
  { name: 'Uncertain', value: 26,  color: '#F59E0B' },
  { name: 'Rejected',  value: 7,   color: '#EF4444' },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border p-3 text-xs shadow-xl"
      style={{ background: '#0F1629', borderColor: 'rgba(201,168,76,0.25)' }}>
      <p className="font-bold mb-1" style={{ color: '#C9A84C' }}>{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  )
}

export function DashboardCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* Area chart — verifications over time */}
      <div className="lg:col-span-2 rounded-2xl border p-5" style={{ background: '#0F1629', borderColor: 'rgba(201,168,76,0.2)' }}>
        <h3 className="text-sm font-black uppercase tracking-widest mb-4" style={{ color: '#C9A84C', fontFamily: 'Playfair Display, serif' }}>
          Verifications This Week
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={verificationData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="gradVerified" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#22C55E" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradUncertain" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#F59E0B" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="day" tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="verified"  name="Verified"  stroke="#22C55E" fill="url(#gradVerified)"  strokeWidth={2} dot={false} />
            <Area type="monotone" dataKey="uncertain" name="Uncertain" stroke="#F59E0B" fill="url(#gradUncertain)" strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Donut — verdict distribution */}
      <div className="rounded-2xl border p-5" style={{ background: '#0F1629', borderColor: 'rgba(201,168,76,0.2)' }}>
        <h3 className="text-sm font-black uppercase tracking-widest mb-4" style={{ color: '#C9A84C', fontFamily: 'Playfair Display, serif' }}>
          Verdict Distribution
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={pieData} cx="50%" cy="45%" innerRadius={48} outerRadius={72} dataKey="value" strokeWidth={0}>
              {pieData.map((entry, i) => (
                <Cell key={i} fill={entry.color} opacity={0.85} />
              ))}
            </Pie>
            <Legend
              formatter={(value, entry: any) => (
                <span style={{ color: entry.color, fontSize: 11, fontWeight: 600 }}>{value}</span>
              )}
            />
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
