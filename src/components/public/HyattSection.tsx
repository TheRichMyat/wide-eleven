'use client'

import { useI18n } from '@/i18n/context'
import { CheckCircle } from 'lucide-react'

export default function HyattSection() {
  const { t } = useI18n()

  const services = t.nav.home === 'Home' ? [
    'Daily maintenance manpower supply',
    'Yearly spring cleaning for hotel',
    'CAPEX modification & renovation works',
    'Consultation & advice for upgrades',
    'Budget estimation for proposed projects',
  ] : [
    'จัดหาแรงงานบำรุงรักษารายวัน',
    'ทำความสะอาดโรงแรมประจำปี',
    'งานปรับปรุงและรีโนเวทตาม CAPEX',
    'ให้คำปรึกษาและแนะนำการปรับปรุง',
    'ประมาณราคาโครงการที่เสนอ',
  ]

  return (
    <section className="section overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Text */}
          <div>
            <div className="gold-line mb-6">{t.hyatt.label}</div>
            <h2 className="font-display font-light mb-2" style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', color: 'var(--text-primary)' }}>
              {t.hyatt.title}
            </h2>
            <p className="font-display italic text-lg mb-8" style={{ color: 'var(--accent)' }}>
              {t.hyatt.subtitle}
            </p>
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>{t.hyatt.body}</p>
            <p className="text-sm leading-relaxed mb-8" style={{ color: 'var(--text-secondary)' }}>{t.hyatt.body2}</p>

            {/* Services list */}
            <ul className="space-y-3">
              {services.map(s => (
                <li key={s} className="flex items-start gap-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <CheckCircle size={14} className="mt-0.5 shrink-0" style={{ color: 'var(--accent)' }} />
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="aspect-square overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
              <img
                src="https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=900&q=85"
                alt="Park Hyatt Bangkok"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Year badge */}
            <div className="absolute -bottom-5 -left-5 px-6 py-4 shadow-xl"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <p className="font-display text-3xl font-light" style={{ color: 'var(--accent)' }}>2018</p>
              <p className="text-[10px] tracking-widest uppercase mt-0.5" style={{ color: 'var(--text-muted)' }}>
                {t.nav.home === 'Home' ? 'Partnership Since' : 'พันธมิตรตั้งแต่ปี'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
