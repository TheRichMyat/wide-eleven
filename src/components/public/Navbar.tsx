'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import { Sun, Moon, Menu, X } from 'lucide-react'
import { useI18n } from '@/i18n/context'
import { cn } from '@/lib/utils'

export default function Navbar() {
  const { t, locale, setLocale } = useI18n()
  const { theme, setTheme } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const links = [
    { href: '/', label: t.nav.home },
    { href: '/#about', label: t.nav.about },
    { href: '/#services', label: t.nav.services },
    { href: '/portfolio', label: t.nav.portfolio },
    { href: '/#contact', label: t.nav.contact },
  ]

  return (
    <nav className={cn('fixed top-0 inset-x-0 z-50 transition-all duration-500',
      scrolled ? 'shadow-md' : '')}
      style={{ background: scrolled ? 'var(--nav-bg)' : 'transparent', backdropFilter: scrolled ? 'blur(14px)' : 'none', borderBottom: scrolled ? '1px solid var(--border)' : 'none' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="relative w-9 h-9 shrink-0">
            <Image src="/images/logo-icon.jpg" alt="Wide-Eleven" fill className="object-contain" sizes="36px" />
          </div>
          <div className="hidden sm:block leading-tight">
            <span className="block text-sm font-semibold tracking-[0.12em] uppercase" style={{ color: scrolled ? 'var(--text-primary)' : 'white', fontFamily: 'var(--font-body)' }}>Wide-Eleven</span>
            <span className="block text-[9px] tracking-[0.22em] uppercase" style={{ color: 'var(--accent)' }}>Co., Ltd.</span>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-8">
          {links.map(l => (
            <Link key={l.href} href={l.href}
              className="text-[11px] font-medium tracking-[0.16em] uppercase transition-colors hover:text-[var(--accent)]"
              style={{ color: scrolled ? 'var(--text-secondary)' : 'rgba(255,255,255,0.85)' }}>
              {l.label}
            </Link>
          ))}
        </div>

        {/* Controls */}
        <div className="hidden lg:flex items-center gap-2">
          <button onClick={() => setLocale(locale === 'en' ? 'th' : 'en')}
            className="text-[10px] font-medium px-3 py-1.5 border transition-all hover:border-[var(--accent)] hover:text-[var(--accent)]"
            style={{ borderColor: scrolled ? 'var(--border)' : 'rgba(255,255,255,0.35)', color: scrolled ? 'var(--text-muted)' : 'rgba(255,255,255,0.7)', letterSpacing: '0.12em' }}>
            {locale === 'en' ? 'ไทย' : 'EN'}
          </button>
          {mounted && (
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 border transition-all hover:border-[var(--accent)]"
              style={{ borderColor: scrolled ? 'var(--border)' : 'rgba(255,255,255,0.35)', color: scrolled ? 'var(--text-muted)' : 'rgba(255,255,255,0.7)' }}>
              {theme === 'dark' ? <Sun size={12} /> : <Moon size={12} />}
            </button>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="lg:hidden p-2" onClick={() => setOpen(!open)}
          style={{ color: scrolled ? 'var(--text-primary)' : 'white' }}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t" style={{ background: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
          <div className="px-6 py-6 space-y-5">
            {links.map(l => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
                className="block text-[11px] font-medium tracking-[0.16em] uppercase"
                style={{ color: 'var(--text-secondary)' }}>
                {l.label}
              </Link>
            ))}
            <div className="flex items-center gap-3 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
              <button onClick={() => setLocale(locale === 'en' ? 'th' : 'en')}
                className="text-[10px] font-medium px-3 py-1.5 border"
                style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
                {locale === 'en' ? 'ไทย' : 'EN'}
              </button>
              {mounted && (
                <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="p-2 border" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
                  {theme === 'dark' ? <Sun size={12} /> : <Moon size={12} />}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
