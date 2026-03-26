'use client'

import { useState } from 'react'
import { Plus, Pencil, Trash2, Star, X, Upload, Image as ImageIcon, ChevronDown, ChevronUp } from 'lucide-react'
import { getImageUrl, cn } from '@/lib/utils'
import type { Project, ProjectGallery } from '@/types'

interface Props { initialProjects: Project[] }

const EMPTY: Partial<Project> = {
  title: '', short_description: '', description: '', category: '',
  tags: [], job_info: '', year: new Date().getFullYear(),
  value: 0, status: 'draft', featured: false, main_image: '', sort_order: 0,
}

const CATEGORIES = ['Residential', 'Commercial', 'Hospitality', 'F&B', 'Retail', 'Industrial', 'MEP Works', 'Maintenance', 'Other']

export default function ProjectsClient({ initialProjects }: Props) {
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<Partial<Project>>(EMPTY)
  const [isNew, setIsNew] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [galleryUploading, setGalleryUploading] = useState(false)
  const [gallery, setGallery] = useState<ProjectGallery[]>([])
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const openNew = () => { setEditing({ ...EMPTY }); setIsNew(true); setGallery([]); setModal(true) }
  const openEdit = (p: Project) => {
    setEditing({ ...p })
    setIsNew(false)
    setGallery(p.gallery || [])
    setModal(true)
  }
  const closeModal = () => { setModal(false); setEditing(EMPTY); setGallery([]) }

  const set = (k: string, v: unknown) => setEditing(e => ({ ...e, [k]: v }))

  const uploadMain = async (file: File) => {
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file); fd.append('bucket', 'project-images')
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
    const data = await res.json()
    setUploading(false)
    if (data.path) set('main_image', data.path)
  }

  const uploadGalleryImage = async (file: File) => {
    if (!editing.id && isNew) {
      alert('Please save the project first before adding gallery images.')
      return
    }
    if (gallery.length >= 10) { alert('Maximum 10 gallery images reached.'); return }
    setGalleryUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    fd.append('sort_order', String(gallery.length))
    const projectId = editing.id
    const res = await fetch(`/api/admin/projects/${projectId}/gallery`, { method: 'POST', body: fd })
    const data = await res.json()
    setGalleryUploading(false)
    if (data.id) {
      setGallery(g => [...g, data])
      setProjects(prev => prev.map(p => p.id === projectId ? { ...p, gallery: [...(p.gallery || []), data] } : p))
    }
  }

  const deleteGalleryImage = async (galleryId: string) => {
    const projectId = editing.id
    const res = await fetch(`/api/admin/projects/${projectId}/gallery?galleryId=${galleryId}`, { method: 'DELETE' })
    if (res.ok) {
      setGallery(g => g.filter(i => i.id !== galleryId))
      setProjects(prev => prev.map(p => p.id === projectId ? { ...p, gallery: (p.gallery || []).filter(i => i.id !== galleryId) } : p))
    }
  }

  const handleSave = async () => {
    if (!editing.title?.trim()) { alert('Title is required'); return }
    setSaving(true)
    const method = isNew ? 'POST' : 'PUT'
    const url = isNew ? '/api/admin/projects' : `/api/admin/projects/${editing.id}`
    const res = await fetch(url, {
      method, headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...editing, tags: editing.tags ?? [] }),
    })
    const saved = await res.json()
    setSaving(false)
    if (res.ok) {
      if (isNew) {
        setProjects(prev => [{ ...saved, gallery: [] }, ...prev])
        setEditing(saved)
        setIsNew(false)
      } else {
        setProjects(prev => prev.map(p => p.id === saved.id ? { ...saved, gallery: gallery } : p))
        closeModal()
      }
    }
  }

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' })
    if (res.ok) { setProjects(prev => prev.filter(p => p.id !== id)); setDeleteId(null) }
  }

  const inp = 'w-full px-3 py-2.5 text-sm border outline-none focus:border-[var(--accent)] transition-colors rounded-lg'
  const inpStyle = { background: 'var(--bg-primary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-light" style={{ color: 'var(--text-primary)' }}>Projects</h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{projects.length} total</p>
        </div>
        <button onClick={openNew}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium text-white shrink-0"
          style={{ background: 'var(--accent)' }}>
          <Plus size={13} /> Add Project
        </button>
      </div>

      {/* Mobile card list */}
      <div className="space-y-3 lg:hidden">
        {projects.map(p => (
          <div key={p.id} className="rounded-xl border overflow-hidden" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-3 p-4"
              onClick={() => setExpandedId(expandedId === p.id ? null : p.id)}>
              <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0" style={{ background: 'var(--bg-secondary)' }}>
                {p.main_image
                  ? <img src={getImageUrl(p.main_image)} alt="" className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center"><ImageIcon size={16} style={{ color: 'var(--text-muted)' }} /></div>
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{p.title}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{p.category} · {p.year}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={cn('text-[10px] px-2 py-0.5 rounded-full font-medium',
                  p.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-800')}>
                  {p.status}
                </span>
                {expandedId === p.id ? <ChevronUp size={14} style={{ color: 'var(--text-muted)' }} /> : <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />}
              </div>
            </div>
            {expandedId === p.id && (
              <div className="px-4 pb-4 flex gap-3 border-t pt-3" style={{ borderColor: 'var(--border)' }}>
                <button onClick={() => openEdit(p)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border text-xs font-medium"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                  <Pencil size={12} /> Edit
                </button>
                <button onClick={() => setDeleteId(p.id)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border text-xs font-medium text-red-500 border-red-200 dark:border-red-900">
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            )}
          </div>
        ))}
        {projects.length === 0 && (
          <div className="text-center py-12 text-sm" style={{ color: 'var(--text-muted)' }}>
            No projects yet. Click "Add Project" to start.
          </div>
        )}
      </div>

      {/* Desktop table */}
      <div className="hidden lg:block rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
        <table className="w-full text-sm">
          <thead style={{ background: 'var(--bg-secondary)' }}>
            <tr>
              {['Project', 'Category', 'Year', 'Status', 'Featured', 'Gallery', 'Actions'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-[10px] font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {projects.map((p, i) => (
              <tr key={p.id} className="border-t" style={{ borderColor: 'var(--border)', background: i % 2 === 0 ? 'var(--bg-card)' : 'var(--bg-primary)' }}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0" style={{ background: 'var(--bg-secondary)' }}>
                      {p.main_image
                        ? <img src={getImageUrl(p.main_image)} alt="" className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center"><ImageIcon size={13} style={{ color: 'var(--text-muted)' }} /></div>
                      }
                    </div>
                    <div>
                      <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{p.title}</p>
                      <p className="text-xs truncate max-w-[160px]" style={{ color: 'var(--text-muted)' }}>{p.short_description}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>{p.category}</td>
                <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>{p.year}</td>
                <td className="px-4 py-3">
                  <span className={cn('text-[10px] px-2 py-0.5 rounded-full font-medium',
                    p.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-800')}>
                    {p.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {p.featured ? <Star size={13} className="text-yellow-500" fill="currentColor" /> : <Star size={13} style={{ color: 'var(--border)' }} />}
                </td>
                <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-muted)' }}>
                  {(p.gallery?.length || 0)} / 10
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-[var(--bg-secondary)]" style={{ color: 'var(--text-muted)' }}><Pencil size={12} /></button>
                    <button onClick={() => setDeleteId(p.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 text-red-400"><Trash2 size={12} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-12 text-center text-sm" style={{ color: 'var(--text-muted)' }}>No projects yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4">
          <div className="w-full sm:max-w-2xl rounded-t-2xl sm:rounded-2xl border max-h-[92vh] overflow-y-auto"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>

            {/* Modal header */}
            <div className="flex items-center justify-between p-5 border-b sticky top-0 z-10"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
              <h2 className="font-display text-xl font-light" style={{ color: 'var(--text-primary)' }}>
                {isNew ? 'New Project' : 'Edit Project'}
              </h2>
              <button onClick={closeModal} style={{ color: 'var(--text-muted)' }}><X size={18} /></button>
            </div>

            <div className="p-5 space-y-5">
              {/* Title */}
              <div>
                <label className="block text-[10px] font-medium tracking-widest uppercase mb-1.5" style={{ color: 'var(--text-muted)' }}>Title *</label>
                <input value={editing.title ?? ''} onChange={e => set('title', e.target.value)} className={inp} style={inpStyle} placeholder="Project title" />
              </div>

              {/* Short desc */}
              <div>
                <label className="block text-[10px] font-medium tracking-widest uppercase mb-1.5" style={{ color: 'var(--text-muted)' }}>Short Description *</label>
                <input value={editing.short_description ?? ''} onChange={e => set('short_description', e.target.value)} className={inp} style={inpStyle} placeholder="One-line summary" />
              </div>

              {/* Description */}
              <div>
                <label className="block text-[10px] font-medium tracking-widest uppercase mb-1.5" style={{ color: 'var(--text-muted)' }}>Full Description</label>
                <textarea value={editing.description ?? ''} onChange={e => set('description', e.target.value)} rows={3} className={inp} style={inpStyle} placeholder="Detailed description..." />
              </div>

              {/* Row: category, year, value */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-medium tracking-widest uppercase mb-1.5" style={{ color: 'var(--text-muted)' }}>Category</label>
                  <select value={editing.category ?? ''} onChange={e => set('category', e.target.value)} className={inp} style={inpStyle}>
                    <option value="">Select...</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-medium tracking-widest uppercase mb-1.5" style={{ color: 'var(--text-muted)' }}>Year</label>
                  <input type="number" value={editing.year ?? ''} onChange={e => set('year', Number(e.target.value))} className={inp} style={inpStyle} />
                </div>
                <div>
                  <label className="block text-[10px] font-medium tracking-widest uppercase mb-1.5" style={{ color: 'var(--text-muted)' }}>Value (THB)</label>
                  <input type="number" value={editing.value ?? 0} onChange={e => set('value', Number(e.target.value))} className={inp} style={inpStyle} />
                </div>
              </div>

              {/* Job info + tags */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-medium tracking-widest uppercase mb-1.5" style={{ color: 'var(--text-muted)' }}>Scope / Job Info</label>
                  <input value={editing.job_info ?? ''} onChange={e => set('job_info', e.target.value)} className={inp} style={inpStyle} placeholder="e.g. Full Renovation" />
                </div>
                <div>
                  <label className="block text-[10px] font-medium tracking-widest uppercase mb-1.5" style={{ color: 'var(--text-muted)' }}>Tags (comma-separated)</label>
                  <input
                    value={Array.isArray(editing.tags) ? editing.tags.join(', ') : ''}
                    onChange={e => set('tags', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
                    className={inp} style={inpStyle} placeholder="modern, luxury, hotel" />
                </div>
              </div>

              {/* Status + featured + sort */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 items-end">
                <div>
                  <label className="block text-[10px] font-medium tracking-widest uppercase mb-1.5" style={{ color: 'var(--text-muted)' }}>Status</label>
                  <select value={editing.status ?? 'draft'} onChange={e => set('status', e.target.value)} className={inp} style={inpStyle}>
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-medium tracking-widest uppercase mb-1.5" style={{ color: 'var(--text-muted)' }}>Sort Order</label>
                  <input type="number" value={editing.sort_order ?? 0} onChange={e => set('sort_order', Number(e.target.value))} className={inp} style={inpStyle} />
                </div>
                <label className="flex items-center gap-2 cursor-pointer pb-1">
                  <input type="checkbox" checked={editing.featured ?? false} onChange={e => set('featured', e.target.checked)}
                    className="w-4 h-4 accent-[var(--accent)]" />
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Featured on Home</span>
                </label>
              </div>

              {/* Main image */}
              <div>
                <label className="block text-[10px] font-medium tracking-widest uppercase mb-1.5" style={{ color: 'var(--text-muted)' }}>Main Image (Thumbnail)</label>
                <div className="flex items-center gap-3 flex-wrap">
                  {editing.main_image && (
                    <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                      <img src={getImageUrl(editing.main_image)} alt="preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <label className="flex items-center gap-2 px-4 py-2.5 rounded-lg border cursor-pointer text-xs transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                    style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
                    <Upload size={13} />
                    {uploading ? 'Uploading...' : 'Upload Main Image'}
                    <input type="file" accept="image/*" className="hidden"
                      onChange={e => { const f = e.target.files?.[0]; if (f) uploadMain(f) }} />
                  </label>
                </div>
              </div>

              {/* Save first notice for new project */}
              {isNew && (
                <div className="rounded-xl p-4 text-xs" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
                  💡 Save the project first, then come back to add gallery images.
                </div>
              )}

              {/* Gallery — only shown when editing existing */}
              {!isNew && (
                <div>
                  <label className="block text-[10px] font-medium tracking-widest uppercase mb-3" style={{ color: 'var(--text-muted)' }}>
                    Gallery Images ({gallery.length}/10)
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-3">
                    {gallery.map(img => (
                      <div key={img.id} className="relative group aspect-square rounded-lg overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
                        <img src={getImageUrl(img.image)} alt="" className="w-full h-full object-cover" />
                        <button
                          onClick={() => deleteGalleryImage(img.id)}
                          className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                    {gallery.length < 10 && (
                      <label className="aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors hover:border-[var(--accent)]"
                        style={{ borderColor: 'var(--border)' }}>
                        {galleryUploading
                          ? <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--accent)' }} />
                          : <><Upload size={16} style={{ color: 'var(--text-muted)' }} /><span className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>Add</span></>
                        }
                        <input type="file" accept="image/*" className="hidden"
                          onChange={e => { const f = e.target.files?.[0]; if (f) uploadGalleryImage(f) }} />
                      </label>
                    )}
                  </div>
                  <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Click + to add images. Hover over image and click × to remove.</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
                <button onClick={closeModal} className="px-4 py-2.5 text-sm rounded-xl border"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>Cancel</button>
                <button onClick={handleSave} disabled={saving}
                  className="px-6 py-2.5 text-sm rounded-xl font-medium text-white disabled:opacity-60"
                  style={{ background: 'var(--accent)' }}>
                  {saving ? 'Saving...' : isNew ? 'Create Project' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-sm rounded-2xl border p-6 text-center space-y-4"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
            <p className="font-display text-xl" style={{ color: 'var(--text-primary)' }}>Delete project?</p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>This cannot be undone. All gallery images will be removed.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 text-sm rounded-xl border"
                style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="px-4 py-2 text-sm rounded-xl font-medium text-white bg-red-500">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
