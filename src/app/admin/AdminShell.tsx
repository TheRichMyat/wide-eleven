'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { Session } from 'next-auth'
import { useTheme } from 'next-themes'
import { LayoutDashboard, FolderOpen, Users, LogOut, Menu, X, Sun, Moon, ChevronRight, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/dashboard/projects', label: 'Projects', icon: FolderOpen },
  { href: '/admin/dashboard/clients', label: 'Clients', icon: Users },
]

export default function AdminShell({ children, session }: { children: React.ReactNode; session: Session | null }) {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [open, setOpen] = useState(false)

  const isAuthPage = pathname === '/admin/login' || pathname === '/admin/invite'
  if (isAuthPage) return <>{children}</>

  const Sidebar = ({ mobile = false }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-5 border-b shrink-0" style={{ borderColor: 'var(--border)' }}>
        <span className="font-display text-lg font-light" style={{ color: 'var(--text-primary)' }}>
          Wide<span style={{ color: 'var(--accent)' }}>-</span>Eleven
        </span>
        {mobile && (
          <button onClick={() => setOpen(false)} style={{ color: 'var(--text-muted)' }}><X size={16} /></button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link key={href} href={href} onClick={() => setOpen(false)}
              className={cn('flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors', active ? 'text-white' : 'hover:bg-[var(--bg-secondary)]')}
              style={active ? { background: 'var(--accent)', color: '#fff' } : { color: 'var(--text-secondary)' }}>
              <Icon size={15} />
              {label}
              {active && <ChevronRight size={12} className="ml-auto" />}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t space-y-1 shrink-0" style={{ borderColor: 'var(--border)' }}>
        <p className="text-xs px-3 pb-2 truncate" style={{ color: 'var(--text-muted)' }}>{session?.user?.email}</p>
        <Link href="/" target="_blank"
          className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-sm transition-colors hover:bg-[var(--bg-secondary)]"
          style={{ color: 'var(--text-muted)' }}>
          <ExternalLink size={13} /> View Site
        </Link>
        <button onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-sm transition-colors hover:bg-[var(--bg-secondary)]"
          style={{ color: 'var(--text-muted)' }}>
          <LogOut size={13} /> Sign out
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-primary)' }}>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col fixed inset-y-0 left-0 w-56 border-r z-40"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
        <Sidebar />
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 inset-y-0 w-64 border-r"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
            <Sidebar mobile />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 md:ml-56 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="h-16 flex items-center px-4 sm:px-6 border-b sticky top-0 z-30"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
          <button className="md:hidden mr-3 p-1.5" onClick={() => setOpen(true)} style={{ color: 'var(--text-primary)' }}>
            <Menu size={18} />
          </button>
          {/* Breadcrumb */}
          <div className="flex-1">
            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              {navItems.find(n => pathname === n.href || pathname.startsWith(n.href + '/'))?.label || 'Admin'}
            </p>
          </div>
          {/* Theme */}
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 border rounded-lg transition-colors hover:border-[var(--accent)]"
            style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
            {theme === 'dark' ? <Sun size={13} /> : <Moon size={13} />}
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  )
}
