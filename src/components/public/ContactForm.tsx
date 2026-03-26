'use client'

import { useState } from 'react'
import { useI18n } from '@/i18n/context'
import { Send, CheckCircle, MapPin, Phone, Mail } from 'lucide-react'

export default function ContactForm() {
  const { t } = useI18n()
  const [status, setStatus] = useState<'idle'|'sending'|'success'|'error'>('idle')
  const [form, setForm] = useState({ name:'', email:'', phone:'', message:'' })
  const [errors, setErrors] = useState<Record<string,string>>({})

  const validate = () => {
    const e: Record<string,string> = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required'
    if (!form.message.trim() || form.message.length < 10) e.message = 'Message too short'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
      setForm({ name:'', email:'', phone:'', message:'' })
    } catch {
      setStatus('error')
    }
  }

  const Field = ({ name, label, required=false, type='text', rows=0 }: {
    name: keyof typeof form; label: string; required?: boolean; type?: string; rows?: number
  }) => (
    <div>
      <label className="block text-[10px] font-medium tracking-[0.2em] uppercase mb-2" style={{ color: 'var(--text-muted)' }}>
        {label}{required && ' *'}
      </label>
      {rows > 0
        ? <textarea name={name} value={form[name]} onChange={handleChange} rows={rows}
            className="underline-input resize-none" placeholder={`${label}...`} />
        : <input name={name} type={type} value={form[name]} onChange={handleChange}
            className="underline-input" placeholder={label} />
      }
      {errors[name] && <p className="text-[10px] text-red-500 mt-1">{errors[name]}</p>}
    </div>
  )

  return (
    <section id="contact" className="section" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left — info */}
          <div>
            <div className="gold-line mb-6">{t.contact.label}</div>
            <h2 className="font-display font-light mb-4" style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)', color: 'var(--text-primary)' }}>
              {t.contact.title}
            </h2>
            <p className="text-sm leading-relaxed mb-12" style={{ color: 'var(--text-secondary)' }}>
              {t.contact.subtitle}
            </p>

            <div className="space-y-8">
              {[
                { icon: Mail, title: 'Email Us', lines: ['wide11bangkok@gmail.com', 'simon@wide-11.com'] },
                { icon: Phone, title: 'Call Us', lines: ['Tel: 02-409-2308', 'Fax: 02-409-2309'] },
                { icon: MapPin, title: 'Visit Us', lines: ['8/110 Soi Thian Talay 7', 'Bang Khun Thian, Bangkok 10150', '(Office)', 'Factory: Soi Pracha Uthit 54 Yak 6', 'Thung Khru, Bangkok 10150'] },
              ].map(({ icon: Icon, title, lines }) => (
                <div key={title} className="flex gap-5">
                  <div className="w-10 h-10 border flex items-center justify-center shrink-0" style={{ borderColor: 'var(--accent)' }}>
                    <Icon size={13} style={{ color: 'var(--accent)' }} />
                  </div>
                  <div>
                    <p className="text-[10px] tracking-[0.2em] uppercase mb-2" style={{ color: 'var(--accent)' }}>{title}</p>
                    {lines.map((l, i) => (
                      <p key={i} className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{l}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — form */}
          <div>
            {status === 'success' ? (
              <div className="flex flex-col items-center justify-center h-full text-center gap-5 py-20">
                <div className="w-16 h-16 border flex items-center justify-center" style={{ borderColor: 'var(--accent)' }}>
                  <CheckCircle size={28} style={{ color: 'var(--accent)' }} />
                </div>
                <p className="font-display text-2xl font-light" style={{ color: 'var(--text-primary)' }}>
                  {t.contact.success}
                </p>
                <button onClick={() => setStatus('idle')} className="text-xs tracking-widest uppercase underline"
                  style={{ color: 'var(--text-muted)' }}>
                  Send another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <Field name="name" label={t.contact.name} required />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <Field name="email" label={t.contact.email} type="email" required />
                  <Field name="phone" label={t.contact.phone} type="tel" />
                </div>
                <Field name="message" label={t.contact.message} required rows={5} />

                {status === 'error' && (
                  <p className="text-xs text-red-500">{t.contact.error}</p>
                )}

                <button type="submit" disabled={status === 'sending'}
                  className="flex items-center gap-3 px-8 py-4 text-[11px] font-medium tracking-[0.2em] uppercase transition-all hover:opacity-90 disabled:opacity-60"
                  style={{ background: 'var(--accent)', color: '#fff' }}>
                  <Send size={12} />
                  {status === 'sending' ? t.contact.sending : t.contact.send}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
