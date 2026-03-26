import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'
import { I18nProvider } from '@/i18n/context'
import './globals.css'

export const metadata: Metadata = {
  title: 'Wide-Eleven Co., Ltd. | Premium Renovation & Interior Design Bangkok',
  description: 'Wide-Eleven Co., Ltd. delivers premium renovation, construction and interior design solutions for residential and commercial spaces across Bangkok, Thailand.',
  keywords: 'renovation Bangkok, interior design Thailand, Wide-Eleven, construction, fit-out',
  openGraph: {
    title: 'Wide-Eleven Co., Ltd.',
    description: 'Premium Renovation & Interior Design — Bangkok, Thailand',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <I18nProvider>
            {children}
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
