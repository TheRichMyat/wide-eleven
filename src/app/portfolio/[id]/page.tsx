'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { notFound, useParams } from 'next/navigation'
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import Lightbox from '@/components/public/Lightbox'
import { getImageUrl, formatCurrency } from '@/lib/utils'
import { ArrowLeft, Calendar, Tag, Briefcase, ZoomIn } from 'lucide-react'
import type { Project } from '@/types'
import { supabase } from '@/lib/supabase'

export default function ProjectDetailPage() {
  const params = useParams()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from('projects')
        .select('*, gallery:project_gallery(*)')
        .eq('id', params.id)
        .single()
      if (error || !data) { setLoading(false); return }
      setProject({ ...data, tags: Array.isArray(data.tags) ? data.tags : (data.tags || '').split(',').map((t: string) => t.trim()).filter(Boolean) })
      setLoading(false)
    }
    load()
  }, [params.id])

  if (loading) return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center pt-20" style={{ background: 'var(--bg-primary)' }}>
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--accent)' }} />
      </div>
      <Footer />
    </>
  )

  if (!project) return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center pt-20" style={{ background: 'var(--bg-primary)' }}>
        <div className="text-center">
          <p className="font-display text-3xl mb-4" style={{ color: 'var(--text-primary)' }}>Project not found</p>
          <Link href="/portfolio" className="text-sm" style={{ color: 'var(--accent)' }}>← Back to Portfolio</Link>
        </div>
      </div>
      <Footer />
    </>
  )

  // Build all gallery images including main
  const allImages = [
    ...(project.main_image ? [getImageUrl(project.main_image)] : []),
    ...(project.gallery || []).sort((a, b) => a.sort_order - b.sort_order).map(g => getImageUrl(g.image)),
  ]

  const openLightbox = (i: number) => setLightboxIndex(i)
  const closeLightbox = () => setLightboxIndex(null)
  const prevImage = () => setLightboxIndex(i => i !== null ? (i - 1 + allImages.length) % allImages.length : 0)
  const nextImage = () => setLightboxIndex(i => i !== null ? (i + 1) % allImages.length : 0)

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-20" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-6xl mx-auto px-6 lg:px-10">

          {/* Back */}
          <Link href="/portfolio"
            className="inline-flex items-center gap-2 text-xs tracking-widest uppercase mb-10 transition-colors hover:text-[var(--accent)]"
            style={{ color: 'var(--text-muted)' }}>
            <ArrowLeft size={13} /> Back to Portfolio
          </Link>

          {/* Header */}
          <div className="mb-10">
            <span className="text-[10px] font-medium tracking-[0.2em] uppercase px-3 py-1.5 inline-block mb-5"
              style={{ background: 'var(--accent)', color: '#fff' }}>
              {project.category}
            </span>
            <h1 className="font-display font-light mb-4"
              style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)', color: 'var(--text-primary)' }}>
              {project.title}
            </h1>
            <p className="text-base max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
              {project.short_description}
            </p>
          </div>

          {/* Main image — clickable */}
          {project.main_image && (
            <div
              className="relative aspect-video overflow-hidden mb-4 cursor-zoom-in group"
              style={{ background: 'var(--bg-secondary)' }}
              onClick={() => openLightbox(0)}
            >
              <img src={getImageUrl(project.main_image)} alt={project.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                style={{ background: 'rgba(0,0,0,0.25)' }}>
                <ZoomIn size={32} className="text-white" />
              </div>
            </div>
          )}

          {/* Gallery grid */}
          {project.gallery && project.gallery.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-14">
              {project.gallery.sort((a, b) => a.sort_order - b.sort_order).map((img, i) => (
                <div
                  key={img.id}
                  className="relative overflow-hidden cursor-zoom-in group"
                  style={{ aspectRatio: '1', background: 'var(--bg-secondary)' }}
                  onClick={() => openLightbox(i + (project.main_image ? 1 : 0))}
                >
                  <img src={getImageUrl(img.image)} alt={`${project.title} ${i + 2}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    style={{ background: 'rgba(0,0,0,0.3)' }}>
                    <ZoomIn size={20} className="text-white" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Meta + description */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>
                {project.description || project.short_description}
              </p>
              {project.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-6">
                  {project.tags.map(tag => (
                    <span key={tag} className="text-xs px-3 py-1 border"
                      style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="rounded-none border p-6 h-fit space-y-5"
              style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}>
              {[
                { icon: Calendar, label: 'Year', value: String(project.year) },
                ...(project.job_info ? [{ icon: Briefcase, label: 'Scope', value: project.job_info }] : []),
                ...(project.value > 0 ? [{ icon: Tag, label: 'Project Value', value: formatCurrency(project.value) }] : []),
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3">
                  <Icon size={13} className="mt-0.5 shrink-0" style={{ color: 'var(--accent)' }} />
                  <div>
                    <p className="text-[10px] tracking-widest uppercase mb-0.5" style={{ color: 'var(--text-muted)' }}>{label}</p>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{value}</p>
                  </div>
                </div>
              ))}
              <div className="pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                <p className="text-[10px] tracking-widest uppercase mb-2" style={{ color: 'var(--text-muted)' }}>Gallery</p>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  {allImages.length} image{allImages.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          images={allImages}
          index={lightboxIndex}
          onClose={closeLightbox}
          onPrev={prevImage}
          onNext={nextImage}
        />
      )}
    </>
  )
}
