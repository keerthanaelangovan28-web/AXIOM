'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Checkbox } from '@/components/ui/checkbox'
import { MFALoginPrompt } from '@/components/auth/mfa-login-prompt'
import { Scale, AlertCircle, Lock, ShieldCheck } from 'lucide-react'

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [mfaRequired, setMfaRequired] = useState(false)

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, rememberMe }),
      })

      const data = await response.json()

      if (response.status === 202) {
        setMfaRequired(true)
        return
      }

      if (!response.ok) {
        setError(data.error || 'Login failed')
        return
      }

      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen" style={{ background: '#0A0E1A' }}>

      {/* ── Left decorative panel ── */}
      <div className="hidden lg:flex lg:w-5/12 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #0D1220 0%, #0A0E1A 100%)', borderRight: '1px solid rgba(201,168,76,0.12)' }}>

        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 30% 40%, rgba(201,168,76,0.08) 0%, transparent 60%)' }} />

        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl gold-glow"
            style={{ background: 'linear-gradient(135deg, #C9A84C, #E8C87A)' }}>
            <Scale className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-black" style={{ color: '#C9A84C', fontFamily: 'Playfair Display, serif' }}>
            LEX AXIOM
          </span>
        </div>

        {/* Centre content */}
        <div className="relative z-10 space-y-6">
          <div className="space-y-2">
            <h2 className="text-4xl font-black leading-tight" style={{ color: '#E2E8F0', fontFamily: 'Playfair Display, serif' }}>
              Legal Intelligence,<br />
              <span style={{ color: '#C9A84C' }}>Mathematically Proven.</span>
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: '#64748B' }}>
              5-layer AI verification with zero-knowledge proofs, constitutional AI, and cryptographically chained certificates.
            </p>
          </div>

          <div className="space-y-3">
            {[
              { icon: ShieldCheck, label: 'Z3 SMT formal logic proofs' },
              { icon: Lock,        label: 'AES-256-GCM encryption at rest' },
              { icon: Scale,       label: 'Multi-agent consensus verdicts' },
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
              {mfaRequired ? 'Two-Factor Auth' : 'Welcome back'}
            </h1>
            <p className="text-sm" style={{ color: '#64748B' }}>
              {mfaRequired ? 'Enter the code from your authenticator app.' : 'Sign in to your LexAxiom account.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <Alert style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                <AlertCircle className="h-4 w-4" style={{ color: '#EF4444' }} />
                <AlertDescription style={{ color: '#FCA5A5' }}>{error}</AlertDescription>
              </Alert>
            )}

            {!mfaRequired ? (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="email" style={{ color: '#CBD5E1', fontSize: '13px', fontWeight: 600 }}>
                    Email address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@lexaxiom.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11"
                    style={{
                      background: '#0F1629',
                      border: '1px solid rgba(201, 168, 76, 0.2)',
                      color: '#E2E8F0',
                    }}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="password" style={{ color: '#CBD5E1', fontSize: '13px', fontWeight: 600 }}>
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Your password"
                    value={password}
                    onChange={handlePasswordChange}
                    className="h-11"
                    style={{
                      background: '#0F1629',
                      border: '1px solid rgba(201, 168, 76, 0.2)',
                      color: '#E2E8F0',
                    }}
                    required
                    minLength={8}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="rememberMe"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked === true)}
                    style={{ borderColor: 'rgba(201, 168, 76, 0.4)' }}
                  />
                  <Label htmlFor="rememberMe" className="text-sm cursor-pointer" style={{ color: '#94A3B8' }}>
                    Remember me for 30 days
                  </Label>
                </div>
              </>
            ) : (
              <MFALoginPrompt onCancel={() => setMfaRequired(false)} />
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 font-bold text-sm transition-all duration-200 hover:opacity-90"
              style={{
                background: 'linear-gradient(135deg, #C9A84C, #E8C87A)',
                color: '#0A0E1A',
              }}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Signing in…
                </span>
              ) : 'Sign In'}
            </Button>

            <p className="text-center text-sm" style={{ color: '#64748B' }}>
              Don&apos;t have an account?{' '}
              <a href="/auth/register" style={{ color: '#C9A84C', fontWeight: 600 }}>
                Create account
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
