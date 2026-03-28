'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch — only render after mount
  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return <div className="h-10 w-10" />

  const isDark = theme === 'dark' || theme === 'system'

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="h-10 w-10 rounded-full transition-all duration-200"
      style={{
        color: '#F97316',
        background: 'transparent',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.background = isDark
          ? 'rgba(249, 115, 22, 0.12)'
          : '#FFF7ED'
        ;(e.currentTarget as HTMLElement).style.boxShadow = isDark
          ? '0 0 12px rgba(249, 115, 22, 0.2)'
          : 'none'
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background = 'transparent'
        ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
      }}
    >
      {isDark ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </Button>
  )
}
