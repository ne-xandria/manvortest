import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })

export const metadata: Metadata = {
  title: 'Manvor Service AC – Jasa Service AC Manado',
  description: 'Jasa service AC terpercaya di Manado. Cuci AC, isi freon, instalasi, dan perbaikan AC oleh teknisi berpengalaman.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={geist.variable}>
      <body className="min-h-screen bg-white font-sans antialiased">{children}</body>
    </html>
  )
}
