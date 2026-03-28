import { DashboardLayout } from '@/components/dashboard/layout'
import { LexcryptumDashboard } from '@/components/lexcryptum/dashboard'
import { OnboardingTour } from '@/components/lexcryptum/onboarding-tour'

export default function VerifyPage() {
  return (
    <DashboardLayout>
      <OnboardingTour />
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-black" style={{ color: '#C9A84C', fontFamily: 'Playfair Display, serif' }}>
            Document Verification
          </h2>
          <p className="text-sm" style={{ color: '#64748B' }}>Upload a legal document for 5-layer AI-powered verification</p>
        </div>
        <LexcryptumDashboard />
      </div>
    </DashboardLayout>
  )
}
