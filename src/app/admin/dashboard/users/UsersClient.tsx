'use client'

import { useState } from 'react'
import { Send, User, Clock } from 'lucide-react'
import type { AdminUser, AdminInvite } from '@/types'

interface Props { users: AdminUser[]; invites: AdminInvite[] }

export default function UsersClient({ users, invites: initialInvites }: Props) {
  const [email, setEmail] = useState('')
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)
  const [invites, setInvites] = useState(initialInvites)

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    setResult(null)
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    setSending(false)
    if (res.ok) {
      setResult({ type: 'success', msg: `Invite sent to ${email}` })
      setEmail('')
    } else {
      const data = await res.json()
      setResult({ type: 'error', msg: data.error ?? 'Failed to send invite' })
    }
  }

  const inputClass = 'flex-1 px-4 py-2.5 text-sm rounded-xl border outline-none focus:border-[var(--accent)] transition-colors'
  const inputStyle = { background: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-primary)' }

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-3xl font-light mb-8" style={{ color: 'var(--text-primary)' }}>Users & Invites</h1>

      {/* Invite form */}
      <div className="rounded-2xl border p-6 mb-8" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
        <h2 className="font-display text-xl font-light mb-4" style={{ color: 'var(--text-primary)' }}>Invite New Admin</h2>
        <form onSubmit={handleInvite} className="flex gap-3">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="email@example.com" className={inputClass} style={inputStyle} />
          <button type="submit" disabled={sending} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white disabled:opacity-60" style={{ background: 'var(--accent)' }}>
            <Send size={13} />
            {sending ? 'Sending...' : 'Send Invite'}
          </button>
        </form>
        {result && (
          <p className={`text-xs mt-3 px-3 py-2 rounded-lg ${result.type === 'success' ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'}`}>
            {result.msg}
          </p>
        )}
      </div>

      {/* Current users */}
      <div className="rounded-2xl border overflow-hidden mb-6" style={{ borderColor: 'var(--border)' }}>
        <div className="px-5 py-3 border-b text-xs font-medium uppercase tracking-wider" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
          Active Admins
        </div>
        {users.map((u) => (
          <div key={u.id} className="flex items-center gap-3 px-5 py-3 border-b last:border-0" style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}>
            <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'var(--accent-light)' }}>
              <User size={13} style={{ color: 'var(--accent)' }} />
            </div>
            <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{u.email}</span>
            <span className="ml-auto text-xs" style={{ color: 'var(--text-muted)' }}>
              {new Date(u.created_at).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>

      {/* Pending invites */}
      {invites.length > 0 && (
        <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
          <div className="px-5 py-3 border-b text-xs font-medium uppercase tracking-wider" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
            Pending Invites
          </div>
          {invites.map((inv) => (
            <div key={inv.id} className="flex items-center gap-3 px-5 py-3 border-b last:border-0" style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}>
              <Clock size={14} style={{ color: 'var(--text-muted)' }} />
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{inv.email}</span>
              <span className="ml-auto text-xs" style={{ color: 'var(--text-muted)' }}>
                Expires {new Date(inv.expires_at).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
