'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { getImageUrl } from '@/lib/utils'
import type { Project } from '@/types'

interface Props {
  project: Project
  priority?: boolean
  showMeta?: boolean
}

export default function ProjectCard({ project, priority = false, showMeta = true }: Props) {
  return (
    <Link href={`/portfolio/${project.id}`} className="group block project-card">
      {/* Image */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '4/3', background: 'var(--bg-secondary)' }}>
        {project.main_image ? (
          <Image
            src={getImageUrl(project.main_image)}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-108"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={priority}
          />
        ) : (
          <img
            src={`https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80`}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}
        {/* Overlay */}
        <div className="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.4)' }}>
          <div className="w-12 h-12 border border-white flex items-center justify-center">
            <ArrowUpRight size={18} className="text-white" />
          </div>
        </div>
        {/* Category */}
        <div className="absolute top-4 left-4">
          <span className="text-[10px] font-medium tracking-[0.15em] uppercase px-3 py-1.5"
            style={{ background: 'var(--accent)', color: '#fff' }}>
            {project.category}
          </span>
        </div>
      </div>

      {/* Info */}
      {showMeta && (
        <div className="pt-5 border-t mt-0" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-display text-xl font-light group-hover:text-[var(--accent)] transition-colors"
              style={{ color: 'var(--text-primary)' }}>
              {project.title}
            </h3>
            <ArrowUpRight size={14} className="shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ color: 'var(--accent)' }} />
          </div>
          {/* Meta row like reference site */}
          <div className="mt-3 grid grid-cols-3 gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
            <div>
              <span className="block tracking-wider uppercase" style={{ fontSize: '9px', color: 'var(--accent)' }}>Category</span>
              <span>{project.category}</span>
            </div>
            <div>
              <span className="block tracking-wider uppercase" style={{ fontSize: '9px', color: 'var(--accent)' }}>Year</span>
              <span>{project.year}</span>
            </div>
            <div>
              <span className="block tracking-wider uppercase" style={{ fontSize: '9px', color: 'var(--accent)' }}>Scope</span>
              <span className="truncate block">{project.job_info || '—'}</span>
            </div>
          </div>
        </div>
      )}
    </Link>
  )
}
