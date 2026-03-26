'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search, SlidersHorizontal, ArrowRight } from 'lucide-react'
import { useI18n } from '@/i18n/context'
import { getImageUrl, cn } from '@/lib/utils'
import type { Project } from '@/types'

interface Props {
  projects: Project[]
  categories: string[]
  years: number[]
}

const DEMO: Array<{ id: string; title: string; category: string; year: number; job_info: string; short_description: string; img: string }> = [
  { id: 'd1', title: 'Park Hyatt — Suite Renovation', category: 'Hospitality', year: 2024, job_info: 'Interior Fit-Out', short_description: 'Luxury suite renovation for Park Hyatt Bangkok.', img: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80' },
  { id: 'd2', title: 'Silom Corporate HQ', category: 'Commercial', year: 2024, job_info: 'Full Fit-Out', short_description: 'Modern office fit-out for a leading corporation.', img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80' },
  { id: 'd3', title: 'Sukhumvit 39 Penthouse', category: 'Residential', year: 2023, job_info: 'Full Renovation', short_description: 'Premium penthouse renovation with city views.', img: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80' },
  { id: 'd4', title: 'Rosewood Bangkok — Maintenance', category: 'Hospitality', year: 2024, job_info: 'MEP & Maintenance', short_description: 'Ongoing hotel maintenance for Rosewood Bangkok.', img: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80' },
  { id: 'd5', title: 'Thonglor Boutique Office', category: 'Commercial', year: 2023, job_info: 'Design & Build', short_description: 'Creative office space in Thonglor district.', img: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80' },
  { id: 'd6', title: 'Bangna Warehouse', category: 'Industrial', year: 2022, job_info: 'Construction', short_description: 'Industrial warehouse construction and fit-out.', img: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80' },
  { id: 'd7', title: 'Ari Restaurant Fit-Out', category: 'F&B', year: 2023, job_info: 'Interior Fit-Out', short_description: 'Intimate dining space design in Ari.', img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80' },
  { id: 'd8', title: 'On Nut Condo Renovation', category: 'Residential', year: 2022, job_info: 'Refurnishing', short_description: 'Full refurnishing of a modern condominium.', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80' },
]

export default function PortfolioClient({ projects, categories, years }: Props) {
  const { t } = useI18n()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [year, setYear] = useState('all')

  const useDemo = !projects || projects.length === 0

  const displayProjects = useMemo(() => {
    const source = useDemo ? DEMO : projects.filter(p => p && p.title)
    return source.filter(p => {
      const matchSearch = !search ||
        (p.title || '').toLowerCase().includes(search.toLowerCase()) ||
        (p.category || '').toLowerCase().includes(search.toLowerCase())
      const matchCat = category === 'all' || p.category === category
      const matchYear = year === 'all' || String(p.year) === year
      return matchSearch && matchCat && matchYear
    })
  }, [projects, search, category, year, useDemo])

  const allCategories = useDemo
    ? [...new Set(DEMO.map(d => d.category))]
    : categories

  const allYears = useDemo
    ? [...new Set(DEMO.map(d => d.year))].sort((a, b) => b - a)
    : years

  const pill = (active: boolean) => cn(
    'px-4 py-1.5 text-[10px] font-medium tracking-[0.15em] uppercase border transition-all cursor-pointer',
    active ? 'text-white border-[var(--accent)] bg-[var(--accent)]' : 'hover:border-[var(--accent)] hover:text-[var(--accent)]'
  )

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10">
      {/* Header */}
      <div className="mb-12">
        <div className="gold-line mb-5">Our Work</div>
        <h1 className="font-display font-light mb-3"
          style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', color: 'var(--text-primary)' }}>
          {t.portfolio.title}
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{t.portfolio.subtitle}</p>
      </div>

      {/* Filters */}
      <div className="sticky top-16 z-40 py-4 mb-8 -mx-6 px-6 lg:-mx-10 lg:px-10 border-b"
        style={{ background: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-wrap">
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder={t.portfolio.search}
              className="w-full pl-8 pr-4 py-2 text-xs border outline-none focus:border-[var(--accent)] transition-colors"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
          </div>

          {/* Category pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <SlidersHorizontal size={11} style={{ color: 'var(--text-muted)' }} />
            <button onClick={() => setCategory('all')}
              className={pill(category === 'all')}
              style={category !== 'all' ? { borderColor: 'var(--border)', color: 'var(--text-muted)' } : {}}>
              {t.portfolio.all}
            </button>
            {allCategories.map(c => (
              <button key={c} onClick={() => setCategory(c)}
                className={pill(category === c)}
                style={category !== c ? { borderColor: 'var(--border)', color: 'var(--text-muted)' } : {}}>
                {c}
              </button>
            ))}
          </div>

          {/* Year */}
          <select value={year} onChange={e => setYear(e.target.value)}
            className="text-[10px] px-3 py-2 border outline-none cursor-pointer tracking-wider"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
            <option value="all">All Years</option>
            {allYears.map(y => <option key={y} value={String(y)}>{y}</option>)}
          </select>
        </div>
      </div>

      {/* Count */}
      <p className="text-xs mb-8 tracking-wider" style={{ color: 'var(--text-muted)' }}>
        {displayProjects.length} project{displayProjects.length !== 1 ? 's' : ''}
        {useDemo && ' (demo)'}
      </p>

      {/* Grid */}
      {displayProjects.length === 0 ? (
        <div className="text-center py-24 border" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
          <p className="font-display text-2xl italic">{t.portfolio.no_results}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayProjects.map((item, i) => {
            const isDemo = useDemo
            const imgSrc = isDemo
              ? (item as typeof DEMO[0]).img
              : getImageUrl((item as Project).main_image)
            const href = isDemo ? '#' : `/portfolio/${(item as Project).id}`

            return (
              <Link key={item.id || i} href={href} className="group block project-card">
                <div className="relative overflow-hidden mb-5"
                  style={{ aspectRatio: '4/3', background: 'var(--bg-secondary)' }}>
                  <img src={imgSrc} alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
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
                <div className="pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                  <h3 className="font-display text-lg font-light leading-snug group-hover:text-[var(--accent)] transition-colors mb-3"
                    style={{ color: 'var(--text-primary)' }}>
                    {item.title}
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { lbl: 'Category', val: item.category },
                      { lbl: 'Year', val: String(item.year) },
                      { lbl: 'Scope', val: item.job_info },
                    ].map(m => (
                      <div key={m.lbl}>
                        <span className="block tracking-wider uppercase mb-0.5"
                          style={{ fontSize: '9px', color: 'var(--accent)' }}>{m.lbl}</span>
                        <span className="text-xs truncate block" style={{ color: 'var(--text-muted)' }}>{m.val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
