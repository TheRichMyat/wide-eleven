'use client'

import Image from 'next/image'
import { useI18n } from '@/i18n/context'

export default function About() {
  const { t } = useI18n()

  return (
    <section id="about" className="section" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Image */}
          <div className="relative order-2 lg:order-1">
            <div className="relative overflow-hidden" style={{ aspectRatio: '4/5' }}>
              <img src="/images/hero-bg.jpg" alt="Wide-Eleven interior project" className="w-full h-full object-cover" />
            </div>
            {/* Gold border */}
            <div className="absolute -bottom-4 -right-4 w-4/5 h-4/5 border pointer-events-none"
              style={{ borderColor: 'var(--accent)', opacity: 0.25, zIndex: -1 }} />
            {/* Badge */}
            <div className="absolute top-6 -right-5 w-20 h-20 flex flex-col items-center justify-center shadow-lg"
              style={{ background: 'var(--accent)' }}>
              <span className="font-display text-xl font-semibold text-white leading-none">12+</span>
              <span className="text-white/80 text-[8px] tracking-widest uppercase text-center mt-0.5 leading-tight px-1">Years</span>
            </div>
          </div>

          {/* Text */}
          <div className="order-1 lg:order-2">
            <div className="gold-line mb-7">{t.about.label}</div>
            <h2 className="font-display font-light mb-1" style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)', color: 'var(--text-primary)' }}>
              {t.about.title}
            </h2>
            <p className="font-display italic text-xl mb-8" style={{ color: 'var(--accent)' }}>
              {t.about.subtitle}
            </p>
            <div className="space-y-4 mb-10">
              {[t.about.body1, t.about.body2, t.about.body3].map((p, i) => (
                <p key={i} className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{p}</p>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t" style={{ borderColor: 'var(--border)' }}>
              {[
                { value: t.about.stat1_value, label: t.about.stat1_label },
                { value: t.about.stat2_value, label: t.about.stat2_label },
                { value: t.about.stat3_value, label: t.about.stat3_label },
              ].map(s => (
                <div key={s.label}>
                  <div className="font-display font-light text-3xl sm:text-4xl" style={{ color: 'var(--accent)' }}>{s.value}</div>
                  <div className="text-[10px] mt-1 tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Logo */}
            <div className="mt-10 pt-8 border-t" style={{ borderColor: 'var(--border)' }}>
              <div className="relative h-10 w-52">
                <Image src="/images/logo-full.png" alt="Wide-Eleven Co., Ltd." fill className="object-contain object-left" sizes="208px" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
