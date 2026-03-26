'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useI18n } from '@/i18n/context'

export default function Footer() {
  const { t } = useI18n()
  const year = new Date().getFullYear()

  return (
    <footer className="border-t" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand — wider column */}
          <div className="md:col-span-5">
            <div className="relative h-10 w-52 mb-5">
              <Image src="/images/logo-full.png" alt="Wide-Eleven Co., Ltd." fill className="object-contain object-left" sizes="208px" />
            </div>
            <p className="text-xs leading-relaxed mb-3 max-w-xs" style={{ color: 'var(--text-muted)' }}>
              {t.footer.tagline}
            </p>
            <p className="text-xs" style={{ color: 'var(--text-muted)', opacity: 0.6 }}>บริษัท ไวด์-อิเลฟเว่น จำกัด</p>
          </div>

          {/* Nav */}
          <div className="md:col-span-3">
            <p className="text-[10px] font-medium tracking-[0.25em] uppercase mb-6" style={{ color: 'var(--accent)' }}>Navigation</p>
            <ul className="space-y-3">
              {[
                { href: '/', label: t.nav.home },
                { href: '/#about', label: t.nav.about },
                { href: '/#services', label: t.nav.services },
                { href: '/portfolio', label: t.nav.portfolio },
                { href: '/#contact', label: t.nav.contact },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-xs tracking-wider transition-colors hover:text-[var(--accent)]"
                    style={{ color: 'var(--text-muted)' }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-4">
            <p className="text-[10px] font-medium tracking-[0.25em] uppercase mb-6" style={{ color: 'var(--accent)' }}>Contact</p>
            <ul className="space-y-2 text-xs" style={{ color: 'var(--text-muted)' }}>
              <li>Tel: 02-409-2308 | Fax: 02-409-2309</li>
              <li>wide11bangkok@gmail.com</li>
              <li>simon@wide-11.com</li>
              <li className="pt-2 leading-relaxed">
                Office: 8/110 Soi Thian Talay 7,<br />
                Bang Khun Thian, Bangkok 10150
              </li>
              <li className="leading-relaxed">
                Factory: Soi Pracha Uthit 54 Yak 6,<br />
                Thung Khru, Bangkok 10150
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-2"
          style={{ borderColor: 'var(--border)' }}>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            © {year} Wide-Eleven Co., Ltd. — {t.footer.rights}
          </p>
          <Link href="/admin/login" className="text-xs transition-colors hover:text-[var(--accent)]"
            style={{ color: 'var(--text-muted)', opacity: 0.5 }}>
            Admin
          </Link>
        </div>
      </div>
    </footer>
  )
}
