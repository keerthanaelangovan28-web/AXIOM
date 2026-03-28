'use client'

import { useEffect, useRef, useState } from 'react'
import { Upload, Search, Award, X, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const STEPS = [
  {
    icon: Upload,
    step: '01',
    title: 'Upload Your Document',
    description: 'Paste legal text or upload a PDF/TXT file. Our engine supports contracts, NDAs, agreements, and policies.',
    highlight: 'Try the sample NDA to see the engine in action.',
    color: '#C9A84C',
  },
  {
    icon: Search,
    step: '02',
    title: 'Enter a Claim to Verify',
    description: 'Type any claim or question you want verified against your document — e.g. "Does this contract include a non-compete clause?"',
    highlight: 'Sample queries are available in the dropdown.',
    color: '#10B981',
  },
  {
    icon: Award,
    step: '03',
    title: 'Get Your Certificate',
    description: 'A 5-layer AI pipeline runs in real-time and produces a mathematically proven verdict with a downloadable JSON certificate.',
    highlight: 'Zero-knowledge proofs protect your document\'s privacy.',
    color: '#7C3AED',
  },
]

const ONBOARDING_KEY = 'lexaxiom_onboarding_done'

export function OnboardingTour() {
  const [show, setShow] = useState(false)
  const [step, setStep] = useState(0)
  const [animating, setAnimating] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Show only on first visit
    if (!localStorage.getItem(ONBOARDING_KEY)) setShow(true)
  }, [])

  function dismiss() {
    localStorage.setItem(ONBOARDING_KEY, '1')
    setShow(false)
  }

  function next() {
    if (step < STEPS.length - 1) {
      setAnimating(true)
      setTimeout(() => { setStep(s => s + 1); setAnimating(false) }, 200)
    } else {
      dismiss()
    }
  }

  if (!show) return null

  const current = STEPS[step]
  const Icon    = current.icon

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={dismiss} />

      {/* Panel */}
      <div
        ref={panelRef}
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border p-8 shadow-2xl"
        style={{ background: '#0F1629', borderColor: 'rgba(201,168,76,0.3)' }}
      >
        {/* Close */}
        <button onClick={dismiss} className="absolute right-4 top-4 opacity-40 hover:opacity-100 transition-opacity">
          <X className="h-4 w-4" style={{ color: '#94A3B8' }} />
        </button>

        {/* Progress dots */}
        <div className="flex gap-1.5 mb-6">
          {STEPS.map((_, i) => (
            <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300"
              style={{ background: i <= step ? '#C9A84C' : 'rgba(201,168,76,0.2)' }} />
          ))}
        </div>

        {/* Step content */}
        <div className={`transition-opacity duration-200 ${animating ? 'opacity-0' : 'opacity-100'}`}>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl mb-5 gold-glow"
            style={{ background: `${current.color}18`, border: `1px solid ${current.color}40` }}>
            <Icon className="h-7 w-7" style={{ color: current.color }} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#64748B' }}>
            Step {current.step} of {STEPS.length}
          </span>
          <h3 className="text-xl font-black mt-1 mb-3" style={{ color: '#E2E8F0', fontFamily: 'Playfair Display, serif' }}>
            {current.title}
          </h3>
          <p className="text-sm leading-relaxed mb-3" style={{ color: '#94A3B8' }}>{current.description}</p>
          <div className="rounded-xl px-4 py-3 text-sm" style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.15)', color: '#C9A84C' }}>
            💡 {current.highlight}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-between mt-6">
          <button onClick={dismiss} className="text-xs underline" style={{ color: '#475569' }}>
            Skip tour
          </button>
          <Button onClick={next} className="gap-2 font-bold"
            style={{ background: 'linear-gradient(135deg, #C9A84C, #E8C87A)', color: '#0A0E1A' }}>
            {step < STEPS.length - 1 ? (
              <><ChevronRight className="h-4 w-4" /> Next</>
            ) : (
              <><Award className="h-4 w-4" /> Get Started</>
            )}
          </Button>
        </div>
      </div>
    </>
  )
}
