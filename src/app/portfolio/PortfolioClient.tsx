'use client'

import { useState, useMemo } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import { useI18n } from '@/i18n/context'
import ProjectCard from '@/components/public/ProjectCard'
import type { Project } from '@/types'
import { cn } from '@/lib/utils'

interface Props {
  projects: Project[]
  categories: string[]
  years: number[]
}

export default function PortfolioClient({ projects, categories, years }: Props) {
  const { t } = useI18n()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [year, setYear] = useState('all')

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchSearch =
        !search ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.short_description.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase())
      const matchCategory = category === 'all' || p.category === category
      const matchYear = year === 'all' || String(p.year) === year
      return matchSearch && matchCategory && matchYear
    })
  }, [projects, search, category, year])

  const pillClass = (active: boolean) =>
    cn(
      'px-4 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer',
      active
        ? 'border-[var(--accent)] text-white bg-[var(--accent)]'
        : 'hover:border-[var(--accent)] hover:text-[var(--accent)]'
    )

  return (
    <div className="max-w-7xl mx-auto px-6">
      {/* Header */}
      <div className="mb-12">
        <p
          className="text-xs font-medium uppercase tracking-[0.2em] mb-2"
          style={{ color: 'var(--accent)' }}
        >
          Our Work
        </p>
        <h1
          className="font-display text-6xl sm:text-7xl font-light"
          style={{ color: 'var(--text-primary)' }}
        >
          {t.portfolio.title}
        </h1>
        <p className="mt-3 text-base" style={{ color: 'var(--text-secondary)' }}>
          {t.portfolio.subtitle}
        </p>
      </div>

      {/* Filters */}
      <div
        className="sticky top-16 z-40 py-4 mb-8 -mx-6 px-6 backdrop-blur-md border-b"
        style={{ background: 'var(--bg-primary)/90', borderColor: 'var(--border)' }}
      >
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--text-muted)' }}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.portfolio.search}
              className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border outline-none focus:border-[var(--accent)] transition-colors"
              style={{
                background: 'var(--bg-card)',
                borderColor: 'var(--border)',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          {/* Category filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <SlidersHorizontal size={13} style={{ color: 'var(--text-muted)' }} />
            <button
              onClick={() => setCategory('all')}
              className={pillClass(category === 'all')}
              style={
                category !== 'all'
                  ? { borderColor: 'var(--border)', color: 'var(--text-muted)' }
                  : {}
              }
            >
              {t.portfolio.all}
            </button>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={pillClass(category === c)}
                style={
                  category !== c
                    ? { borderColor: 'var(--border)', color: 'var(--text-muted)' }
                    : {}
                }
              >
                {c}
              </button>
            ))}
          </div>

          {/* Year filter */}
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl border outline-none cursor-pointer"
            style={{
              background: 'var(--bg-card)',
              borderColor: 'var(--border)',
              color: 'var(--text-secondary)',
            }}
          >
            <option value="all">{t.portfolio.filter_year}: {t.portfolio.all}</option>
            {years.map((y) => (
              <option key={y} value={String(y)}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results count */}
      <p className="text-xs mb-6" style={{ color: 'var(--text-muted)' }}>
        {filtered.length} project{filtered.length !== 1 ? 's' : ''}
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div
          className="text-center py-24 rounded-2xl border"
          style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
        >
          <p className="font-display text-2xl italic mb-2">{t.portfolio.no_results}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project, i) => (
            <ProjectCard key={project.id} project={project} priority={i < 6} />
          ))}
        </div>
      )}
    </div>
  )
}
