'use client'

import { useI18n } from '@/i18n/context'
import type { Client } from '@/types'

const DEMO_NAMES = [
  'Park Hyatt Bangkok', 'Rosewood Bangkok', 'Siam Piwat', 'Central Group',
  'MQDC', 'Ananda Development', 'Pruksa Real Estate', 'SC Asset',
  'Origin Property', 'Magnolia Quality', 'Minor International', 'Asset Five',
]

interface Props { clients: Client[] }

export default function PartnersSlideshow({ clients }: Props) {
  const { t } = useI18n()
  const names = clients.length > 0 ? clients.map(c => c.name) : DEMO_NAMES
  const doubled = [...names, ...names]

  return (
    <section className="py-20 overflow-hidden border-t border-b" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 mb-12 text-center">
        <div className="gold-line justify-center mb-5">{t.partners.label}</div>
        <h2 className="font-display font-light text-3xl sm:text-4xl" style={{ color: 'var(--text-primary)' }}>
          {t.partners.title}
        </h2>
      </div>

      {/* Marquee strip */}
      <div className="relative">
        <div className="absolute left-0 inset-y-0 w-24 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to right, var(--bg-secondary), transparent)' }} />
        <div className="absolute right-0 inset-y-0 w-24 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to left, var(--bg-secondary), transparent)' }} />

        <div className="flex animate-marquee w-max">
          {doubled.map((name, i) => (
            <div key={i} className="flex items-center shrink-0 px-10 py-3">
              <span className="w-1.5 h-1.5 rotate-45 mr-8 shrink-0" style={{ background: 'var(--accent)', display: 'inline-block' }} />
              <span className="text-sm font-medium tracking-[0.18em] uppercase whitespace-nowrap"
                style={{ color: 'var(--text-muted)' }}>
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
