'use client'

import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Eye, EyeOff, CheckCircle } from 'lucide-react'

function InviteForm() {
  const params = useSearchParams()
  const router = useRouter()
  const token = params.get('token') ?? ''
  const email = params.get('email') ?? ''

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) { setError('Passwords do not match'); return }
    if (password.length < 8) { setError('Password must be at least 8 characters'); return }

    setLoading(true)
    setError('')

    const res = await fetch('/api/admin/users/accept-invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, email, password }),
    })

    setLoading(false)

    if (!res.ok) {
      const data = await res.json()
      setError(data.error ?? 'Something went wrong')
    } else {
      setDone(true)
      setTimeout(() => router.push('/admin/login'), 2000)
    }
  }

  const inputClass = 'w-full px-4 py-3 text-sm rounded-xl border outline-none focus:border-[var(--accent)] transition-colors'
  const inputStyle = { background: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-primary)' }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg-primary)' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <span className="font-display text-3xl font-semibold" style={{ color: 'var(--text-primary)' }}>
            Wide<span style={{ color: 'var(--accent)' }}>-</span>Eleven
          </span>
          <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>Accept Invitation</p>
        </div>

        <div className="rounded-2xl border p-8" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
          {done ? (
            <div className="text-center py-6 space-y-3">
              <CheckCircle size={40} className="mx-auto" style={{ color: 'var(--accent)' }} />
              <p className="font-medium" style={{ color: 'var(--text-primary)' }}>Account created! Redirecting...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Email</label>
                <input type="email" value={email} disabled className={inputClass} style={{ ...inputStyle, opacity: 0.6 }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>New Password</label>
                <div className="relative">
                  <input type={showPass ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required className={inputClass} style={inputStyle} placeholder="Min. 8 characters" />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>
                    {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Confirm Password</label>
                <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required className={inputClass} style={inputStyle} placeholder="Repeat password" />
              </div>
              {error && <p className="text-xs text-red-500 bg-red-50 dark:bg-red-950/20 px-3 py-2 rounded-lg">{error}</p>}
              <button type="submit" disabled={loading} className="w-full py-3 rounded-xl text-sm font-medium disabled:opacity-60 hover:opacity-90" style={{ background: 'var(--accent)', color: '#fff' }}>
                {loading ? 'Creating account...' : 'Set Password & Join'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default function InvitePage() {
  return <Suspense><InviteForm /></Suspense>
}
