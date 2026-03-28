'use client'

import { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Shield,
  Users,
  Settings,
  LogOut,
  Home,
  BarChart3,
  MoreHorizontal,
  Scale,
} from 'lucide-react'

interface User {
  id: string
  email: string
  name: string
  role: string
}

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const userCookie = document.cookie
      .split('; ')
      .find((row) => row.startsWith('auth-user='))

    if (!userCookie) {
      router.push('/auth/login')
      return
    }

    try {
      const userData = JSON.parse(decodeURIComponent(userCookie.split('=')[1]))
      setUser(userData)
    } catch {
      router.push('/auth/login')
    } finally {
      setIsLoading(false)
    }
  }, [router])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/auth/login')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: '#0A0E1A' }}>
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-xl flex items-center justify-center animate-glow-gold"
            style={{ background: 'linear-gradient(135deg, #C9A84C, #E8C87A)' }}>
            <Scale className="h-5 w-5 text-white" />
          </div>
          <p className="text-sm font-semibold" style={{ color: '#C9A84C', fontFamily: 'Playfair Display, serif' }}>Loading…</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  const navigationItems = [
    { icon: Home,     label: 'Dashboard',       href: '/dashboard' },
    { icon: Shield,   label: 'Verify Document', href: '/dashboard/verify' },
    { icon: BarChart3,label: 'History',          href: '/dashboard/history' },
    ...(user.role === 'admin' || user.role === 'super-admin'
      ? [
          { icon: Users,    label: 'User Management', href: '/dashboard/admin/users' },
          { icon: Settings, label: 'Audit Logs',      href: '/dashboard/admin/audit-logs' },
        ]
      : []),
    { icon: Settings, label: 'Settings',         href: '/dashboard/settings' },
  ]

  return (
    <SidebarProvider>
      <div className="flex w-full min-h-screen" style={{ background: '#0A0E1A' }}>

        {/* ── Sidebar ── */}
        <Sidebar style={{
          background: '#080C18',
          borderRight: '1px solid rgba(201, 168, 76, 0.18)',
        }}>
          <SidebarHeader style={{ borderBottom: '1px solid rgba(201, 168, 76, 0.12)', padding: '20px 16px' }}>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl gold-glow"
                style={{ background: 'linear-gradient(135deg, #C9A84C, #E8C87A)' }}>
                <Scale className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-base font-black tracking-tight"
                  style={{ color: '#C9A84C', fontFamily: 'Playfair Display, serif' }}>
                  LEX AXIOM
                </span>
                <p className="text-[9px] uppercase tracking-widest font-semibold" style={{ color: '#64748B' }}>
                  Legal Vault
                </p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent style={{ padding: '12px 8px' }}>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild>
                    <a
                      href={item.href}
                      className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200"
                      style={{ color: '#94A3B8' }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget as HTMLElement
                        el.style.background = 'rgba(201, 168, 76, 0.1)'
                        el.style.color = '#C9A84C'
                        el.style.boxShadow = '0 0 12px rgba(201, 168, 76, 0.12)'
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLElement
                        el.style.background = 'transparent'
                        el.style.color = '#94A3B8'
                        el.style.boxShadow = 'none'
                      }}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span>{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter style={{ borderTop: '1px solid rgba(201, 168, 76, 0.12)', padding: '12px 8px' }}>
            <div className="flex items-center gap-3 px-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-black"
                style={{ background: 'rgba(201, 168, 76, 0.15)', color: '#C9A84C', border: '1px solid rgba(201, 168, 76, 0.3)' }}>
                {user.name?.[0]?.toUpperCase() ?? 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold truncate" style={{ color: '#E2E8F0' }}>{user.name}</p>
                <p className="text-[10px] truncate capitalize" style={{ color: '#64748B' }}>{user.role}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-7 w-7 rounded-full p-0">
                    <MoreHorizontal className="h-4 w-4" style={{ color: '#C9A84C' }} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end"
                  style={{ background: '#0F1629', border: '1px solid rgba(201, 168, 76, 0.25)' }}>
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer"
                    style={{ color: '#E2E8F0' }}
                  >
                    <LogOut className="mr-2 h-4 w-4" style={{ color: '#EF4444' }} />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </SidebarFooter>
        </Sidebar>

        {/* ── Main Content ── */}
        <main className="flex-1 overflow-auto" style={{ minWidth: 0 }}>
          {/* Top bar */}
          <div className="sticky top-0 z-10 backdrop-blur-md"
            style={{ background: 'rgba(10, 14, 26, 0.85)', borderBottom: '1px solid rgba(201, 168, 76, 0.15)' }}>
            <div className="flex items-center justify-between px-6 py-3.5">
              <h1 className="text-xl font-black tracking-tight"
                style={{ color: '#C9A84C', fontFamily: 'Playfair Display, serif' }}>
                LEX AXIOM
              </h1>
              <div className="flex items-center gap-2 rounded-full px-3 py-1 border"
                style={{ borderColor: 'rgba(201, 168, 76, 0.25)', background: 'rgba(201, 168, 76, 0.05)' }}>
                <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: '#22C55E' }} />
                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#C9A84C' }}>
                  Secure · Encrypted
                </span>
              </div>
            </div>
          </div>

          <div className="p-6 w-full">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
