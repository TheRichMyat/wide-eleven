'use client'

import Link from 'next/link'
import { useI18n } from '@/i18n/context'
import { ArrowDown } from 'lucide-react'

export default function Hero() {
  const { t } = useI18n()

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img src="/images/hero-bg.jpg" alt="Wide-Eleven Project" className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.45) 60%, rgba(0,0,0,0.6) 100%)' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 w-full pt-20">
        {/* Label */}
        <div className="flex items-center gap-3 mb-8 anim-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="h-px w-10" style={{ background: 'var(--accent)' }} />
          <span className="text-[10px] font-medium tracking-[0.3em] uppercase text-white/70">
            Est. 2014 — Bangkok, Thailand
          </span>
        </div>

        {/* Heading */}
        <h1 className="font-display font-light text-white mb-6 anim-fade-up"
          style={{ fontSize: 'clamp(2.8rem, 7vw, 6rem)', lineHeight: 1.08, animationDelay: '0.3s', textShadow: '0 2px 30px rgba(0,0,0,0.2)' }}>
          {t.hero.tagline}
        </h1>

        {/* Subtitle */}
        <p className="text-white/65 font-light max-w-xl mb-10 anim-fade-up"
          style={{ fontSize: '1rem', lineHeight: 1.75, animationDelay: '0.5s' }}>
          {t.hero.subtitle}
        </p>

        {/* CTA buttons */}
        <div className="flex flex-wrap gap-4 anim-fade-up" style={{ animationDelay: '0.7s' }}>
          <Link href="/portfolio"
            className="px-8 py-3.5 text-[11px] font-medium tracking-[0.2em] uppercase transition-all hover:opacity-90"
            style={{ background: 'var(--accent)', color: '#fff' }}>
            {t.hero.cta_primary}
          </Link>
          <Link href="/#contact"
            className="px-8 py-3.5 text-[11px] font-medium tracking-[0.2em] uppercase border border-white/40 text-white transition-all hover:bg-white/10 hover:border-white/70">
            {t.hero.cta_secondary}
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-20 pt-8 border-t border-white/15 grid grid-cols-3 gap-8 max-w-md anim-fade-up"
          style={{ animationDelay: '0.9s' }}>
          {[
            { value: t.about.stat1_value, label: t.about.stat1_label },
            { value: t.about.stat2_value, label: t.about.stat2_label },
            { value: t.about.stat3_value, label: t.about.stat3_label },
          ].map(s => (
            <div key={s.label}>
              <div className="font-display font-light text-3xl" style={{ color: 'var(--accent)' }}>{s.value}</div>
              <div className="text-white/45 text-[10px] tracking-widest uppercase mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-[9px] tracking-[0.25em] uppercase text-white/35">Scroll</span>
        <ArrowDown size={14} className="text-white/35 animate-bounce" />
      </div>
    </section>
  )
}
