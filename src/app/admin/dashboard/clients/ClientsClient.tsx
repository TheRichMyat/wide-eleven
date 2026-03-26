'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Plus, Pencil, Trash2, X, Upload } from 'lucide-react'
import { getImageUrl } from '@/lib/utils'
import type { Client } from '@/types'

interface Props { initialClients: Client[] }

const EMPTY: Partial<Client> = { name: '', logo_image: '', sort_order: 0, link_url: '' }

export default function ClientsClient({ initialClients }: Props) {
  const [clients, setClients] = useState<Client[]>(initialClients)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<Partial<Client>>(EMPTY)
  const [isNew, setIsNew] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const openNew = () => { setEditing({ ...EMPTY }); setIsNew(true); setModal(true) }
  const openEdit = (c: Client) => { setEditing({ ...c }); setIsNew(false); setModal(true) }
  const closeModal = () => { setModal(false); setEditing(EMPTY) }

  const handleUpload = async (file: File) => {
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    fd.append('bucket', 'client-logos')
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
    const data = await res.json()
    setUploading(false)
    if (data.path) setEditing((e) => ({ ...e, logo_image: data.path }))
  }

  const handleSave = async () => {
    setSaving(true)
    const method = isNew ? 'POST' : 'PUT'
    const url = isNew ? '/api/admin/clients' : `/api/admin/clients/${editing.id}`
    const res = await fetch(url, {
      method, headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editing),
    })
    const saved = await res.json()
    setSaving(false)
    if (res.ok) {
      setClients((prev) => isNew ? [...prev, saved] : prev.map((c) => c.id === saved.id ? saved : c))
      closeModal()
    }
  }

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/admin/clients/${id}`, { method: 'DELETE' })
    if (res.ok) { setClients((prev) => prev.filter((c) => c.id !== id)); setDeleteId(null) }
  }

  const inputClass = 'w-full px-3 py-2 text-sm rounded-lg border outline-none focus:border-[var(--accent)] transition-colors'
  const inputStyle = { background: 'var(--bg-primary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-light" style={{ color: 'var(--text-primary)' }}>Clients & Partners</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>{clients.length} total · shown in homepage slideshow</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white" style={{ background: 'var(--accent)' }}>
          <Plus size={14} /> Add Client
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {clients.map((c) => (
          <div key={c.id} className="rounded-2xl border p-4 flex flex-col items-center gap-3 group relative" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
            <div className="w-20 h-12 relative">
              {c.logo_image
                ? <Image src={getImageUrl(c.logo_image)} alt={c.name} fill className="object-contain" sizes="80px" />
                : <div className="w-full h-full rounded flex items-center justify-center text-xs" style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>No logo</div>
              }
            </div>
            <p className="text-sm font-medium text-center" style={{ color: 'var(--text-primary)' }}>{c.name}</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Order: {c.sort_order}</p>
            <div className="flex gap-2">
              <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg hover:bg-[var(--bg-secondary)]" style={{ color: 'var(--text-muted)' }}><Pencil size={12} /></button>
              <button onClick={() => setDeleteId(c.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 text-red-400"><Trash2 size={12} /></button>
            </div>
          </div>
        ))}
        {clients.length === 0 && (
          <div className="col-span-4 text-center py-16 text-sm" style={{ color: 'var(--text-muted)' }}>No clients yet.</div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-md rounded-2xl border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'var(--border)' }}>
              <h2 className="font-display text-2xl font-light" style={{ color: 'var(--text-primary)' }}>{isNew ? 'New Client' : 'Edit Client'}</h2>
              <button onClick={closeModal} style={{ color: 'var(--text-muted)' }}><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Name *</label>
                <input value={editing.name ?? ''} onChange={(e) => setEditing((ed) => ({ ...ed, name: e.target.value }))} className={inputClass} style={inputStyle} placeholder="Company name" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Website URL</label>
                <input value={editing.link_url ?? ''} onChange={(e) => setEditing((ed) => ({ ...ed, link_url: e.target.value }))} className={inputClass} style={inputStyle} placeholder="https://..." />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Sort Order</label>
                <input type="number" value={editing.sort_order ?? 0} onChange={(e) => setEditing((ed) => ({ ...ed, sort_order: Number(e.target.value) }))} className={inputClass} style={inputStyle} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Logo</label>
                <div className="flex items-center gap-3">
                  {editing.logo_image && (
                    <div className="w-14 h-10 relative"><Image src={getImageUrl(editing.logo_image)} alt="logo" fill className="object-contain" sizes="56px" /></div>
                  )}
                  <label className="flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer text-sm hover:border-[var(--accent)] hover:text-[var(--accent)]" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
                    <Upload size={13} />
                    {uploading ? 'Uploading...' : 'Upload Logo'}
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f) }} />
                  </label>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={closeModal} className="px-4 py-2 text-sm rounded-lg border" style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>Cancel</button>
                <button onClick={handleSave} disabled={saving} className="px-5 py-2 text-sm rounded-lg font-medium text-white disabled:opacity-60" style={{ background: 'var(--accent)' }}>
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-sm rounded-2xl border p-6 text-center space-y-4" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
            <p className="font-display text-xl" style={{ color: 'var(--text-primary)' }}>Remove client?</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 text-sm rounded-lg border" style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="px-4 py-2 text-sm rounded-lg font-medium text-white bg-red-500">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
