'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Scale, UserPlus, CheckCircle, AlertCircle, Lock, ShieldCheck } from 'lucide-react'

export function RegisterForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }
    if (!/[a-zA-Z]/.test(formData.password) || !/[0-9]/.test(formData.password)) {
      setError('Password must contain at least one letter and one number')
      return
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Registration failed')
        return
      }

      setSuccess(true)
      setTimeout(() => { router.push('/auth/login') }, 2000)
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const inputStyle = {
    background: '#0F1629',
    border: '1px solid rgba(201, 168, 76, 0.2)',
    color: '#E2E8F0',
  }

  const labelStyle = { color: '#CBD5E1', fontSize: '13px', fontWeight: 600 as const }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4" style={{ background: '#0A0E1A' }}>
        <div className="w-full max-w-md text-center space-y-6 animate-fade-in-up">
          <div className="flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl gold-glow"
              style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
              <CheckCircle className="h-10 w-10" style={{ color: '#22C55E' }} />
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-black" style={{ color: '#C9A84C', fontFamily: 'Playfair Display, serif' }}>
              Account Created
            </h2>
            <p className="mt-2 text-sm" style={{ color: '#64748B' }}>
              Your LexAxiom profile is ready. Redirecting to login…
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen" style={{ background: '#0A0E1A' }}>

      {/* ── Left panel ── */}
      <div className="hidden lg:flex lg:w-5/12 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #0D1220 0%, #0A0E1A 100%)', borderRight: '1px solid rgba(201,168,76,0.12)' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 30% 40%, rgba(201,168,76,0.08) 0%, transparent 60%)' }} />

        <div className="flex items-center gap-3 relative z-10">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl gold-glow"
            style={{ background: 'linear-gradient(135deg, #C9A84C, #E8C87A)' }}>
            <Scale className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-black" style={{ color: '#C9A84C', fontFamily: 'Playfair Display, serif' }}>
            LEX AXIOM
          </span>
        </div>

        <div className="relative z-10 space-y-6">
          <div className="space-y-2">
            <h2 className="text-4xl font-black leading-tight" style={{ color: '#E2E8F0', fontFamily: 'Playfair Display, serif' }}>
              Join the Future<br />
              <span style={{ color: '#C9A84C' }}>of Legal Verification.</span>
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: '#64748B' }}>
              Verify legal documents in seconds with mathematically proven verdicts and zero-knowledge privacy.
            </p>
          </div>
          <div className="space-y-3">
            {[
              { icon: ShieldCheck, label: 'Zero-knowledge proof privacy' },
              { icon: Lock,        label: 'Military-grade AES-256 encryption' },
              { icon: UserPlus,    label: 'TOTP multi-factor authentication' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg"
                  style={{ background: 'rgba(201, 168, 76, 0.12)', border: '1px solid rgba(201, 168, 76, 0.2)' }}>
                  <Icon className="h-3.5 w-3.5" style={{ color: '#C9A84C' }} />
                </div>
                <span className="text-sm" style={{ color: '#94A3B8' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-[11px] relative z-10" style={{ color: '#334155' }}>
          © 2026 LexAxiom · Secure Legal Verification
        </p>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-8">

          {/* Mobile logo */}
          <div className="flex items-center gap-3 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl gold-glow"
              style={{ background: 'linear-gradient(135deg, #C9A84C, #E8C87A)' }}>
              <Scale className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-black" style={{ color: '#C9A84C', fontFamily: 'Playfair Display, serif' }}>
              LEX AXIOM
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-black" style={{ color: '#E2E8F0', fontFamily: 'Playfair Display, serif' }}>
              Create account
            </h1>
            <p className="text-sm" style={{ color: '#64748B' }}>
              Start verifying legal documents with AI.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                <AlertCircle className="h-4 w-4" style={{ color: '#EF4444' }} />
                <AlertDescription style={{ color: '#FCA5A5' }}>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="name" style={labelStyle}>Full Name</Label>
              <Input id="name" name="name" type="text" placeholder="Jane Smith"
                value={formData.name} onChange={handleChange} className="h-11" style={inputStyle} required />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" style={labelStyle}>Email Address</Label>
              <Input id="email" name="email" type="email" placeholder="you@lexaxiom.com"
                value={formData.email} onChange={handleChange} className="h-11" style={inputStyle} required />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" style={labelStyle}>Password</Label>
              <Input id="password" name="password" type="password" placeholder="Min. 8 chars, include a number"
                value={formData.password} onChange={handleChange} className="h-11"
                style={inputStyle} required minLength={8} />
              <p className="text-[11px]" style={{ color: '#64748B' }}>
                At least 8 characters with one letter and one number
              </p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword" style={labelStyle}>Confirm Password</Label>
              <Input id="confirmPassword" name="confirmPassword" type="password" placeholder="Re-enter your password"
                value={formData.confirmPassword} onChange={handleChange} className="h-11" style={inputStyle} required />
            </div>

            <Button type="submit" disabled={isLoading} className="w-full h-11 font-bold text-sm mt-2 transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #C9A84C, #E8C87A)', color: '#0A0E1A' }}>
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Creating account…
                </span>
              ) : 'Create Account'}
            </Button>

            <p className="text-center text-sm" style={{ color: '#64748B' }}>
              Already have an account?{' '}
              <a href="/auth/login" style={{ color: '#C9A84C', fontWeight: 600 }}>Sign in</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
