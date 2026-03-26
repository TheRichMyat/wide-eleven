'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useI18n } from '@/i18n/context'
import type { Project } from '@/types'

const DEMO: Array<{ title: string; category: string; year: number; job: string; img: string }> = [
  { title: 'Park Hyatt Ploenchit — Suite Renovation', category: 'Hospitality', year: 2024, job: 'Interior Fit-Out', img: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80' },
  { title: 'Silom Corporate HQ', category: 'Commercial', year: 2024, job: 'Full Fit-Out', img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80' },
  { title: 'Sukhumvit 39 Penthouse', category: 'Residential', year: 2023, job: 'Full Renovation', img: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80' },
  { title: 'Rosewood Bangkok — Maintenance Works', category: 'Hospitality', year: 2024, job: 'MEP & Maintenance', img: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80' },
  { title: 'Thonglor Boutique Office', category: 'Commercial', year: 2023, job: 'Design & Build', img: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80' },
  { title: 'Bangna Warehouse Fit-Out', category: 'Industrial', year: 2022, job: 'Construction', img: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80' },
]

interface Props { projects: Project[] }

export default function FeaturedProjects({ projects }: Props) {
  const { t } = useI18n()
  const useDemo = projects.length === 0

  return (
    <section id="portfolio" className="section" style={{ background: 'var(--bg-secondary)' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
          <div>
            <div className="gold-line mb-6">{t.featured.label}</div>
            <h2 className="font-display font-light" style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)', color: 'var(--text-primary)' }}>
              {t.featured.title}
            </h2>
          </div>
          <Link href="/portfolio"
            className="inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.15em] uppercase pb-1 border-b transition-all hover:text-[var(--accent)] hover:border-[var(--accent)] shrink-0"
            style={{ color: 'var(--text-secondary)', borderColor: 'var(--border)' }}>
            {t.featured.view_all} <ArrowRight size={12} />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {(useDemo ? DEMO : projects.slice(0,6).map(p => ({
            title: p.title, category: p.category, year: p.year, job: p.job_info, img: ''
          }))).map((item, i) => (
            <Link key={i} href={useDemo ? '/portfolio' : `/portfolio/${(projects[i] as Project)?.id}`}
              className="group block project-card">
              <div className="relative overflow-hidden mb-5" style={{ aspectRatio: '4/3', background: 'var(--bg-primary)' }}>
                <img src={item.img || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80'}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                  style={{ background: 'rgba(0,0,0,0.35)' }}>
                  <div className="w-11 h-11 border border-white/70 flex items-center justify-center">
                    <ArrowRight size={16} className="text-white" />
                  </div>
                </div>
                <div className="absolute top-4 left-4">
                  <span className="text-[10px] font-medium tracking-[0.15em] uppercase px-3 py-1.5"
                    style={{ background: 'var(--accent)', color: '#fff' }}>
                    {item.category}
                  </span>
                </div>
              </div>
              {/* Meta */}
              <div className="pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                <h3 className="font-display text-lg font-light leading-snug group-hover:text-[var(--accent)] transition-colors mb-3"
                  style={{ color: 'var(--text-primary)' }}>
                  {item.title}
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { lbl: 'Category', val: item.category },
                    { lbl: 'Year', val: String(item.year) },
                    { lbl: 'Scope', val: item.job },
                  ].map(m => (
                    <div key={m.lbl}>
                      <span className="block tracking-wider uppercase mb-0.5" style={{ fontSize: '9px', color: 'var(--accent)' }}>{m.lbl}</span>
                      <span className="text-xs truncate block" style={{ color: 'var(--text-muted)' }}>{m.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
