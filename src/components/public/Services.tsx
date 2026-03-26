'use client'

import { useI18n } from '@/i18n/context'
import { PenTool, Calculator, Sofa, HardHat, RefreshCw, Wrench, Zap } from 'lucide-react'

const icons = [PenTool, Calculator, Sofa, HardHat, RefreshCw, Wrench, Zap]

export default function Services() {
  const { t, locale } = useI18n()

  return (
    <section id="services" className="section" style={{ background: 'var(--bg-secondary)' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14">
          <div>
            <div className="gold-line mb-6">{t.services.label}</div>
            <h2 className="font-display font-light" style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)', color: 'var(--text-primary)' }}>
              {t.services.title}
            </h2>
          </div>
          <p className="text-sm max-w-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            {locale === 'th' ? 'ครบวงจรตั้งแต่การออกแบบถึงการส่งมอบ' : 'End-to-end solutions from design through delivery.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-l" style={{ borderColor: 'var(--border)' }}>
          {t.services.items.map((item, i) => {
            const Icon = icons[i] || Wrench
            return (
              <div key={item.title}
                className="group p-8 border-b border-r transition-all duration-300 cursor-default hover:bg-[var(--accent)]"
                style={{ borderColor: 'var(--border)' }}>
                <div className="w-10 h-10 border flex items-center justify-center mb-6 transition-all duration-300 group-hover:border-white/40"
                  style={{ borderColor: 'var(--accent)' }}>
                  <Icon size={15} className="transition-colors duration-300 group-hover:text-white" style={{ color: 'var(--accent)' }} />
                </div>
                <div className="text-[10px] font-medium tracking-[0.2em] uppercase mb-3 transition-colors duration-300 group-hover:text-white/50"
                  style={{ color: 'var(--text-muted)' }}>
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h3 className="font-display text-lg mb-3 leading-tight transition-colors duration-300 group-hover:text-white"
                  style={{ color: 'var(--text-primary)' }}>
                  {item.title}
                </h3>
                <p className="text-xs leading-relaxed transition-colors duration-300 group-hover:text-white/70"
                  style={{ color: 'var(--text-muted)' }}>
                  {item.desc}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
