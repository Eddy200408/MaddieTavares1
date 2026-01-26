import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

// Metadata do site
export const metadata: Metadata = {
  title: 'Maddie Tavares Beauty Boutique | Clínica de Estética Premium',
  description:
    'Clínica de estética e beauty boutique premium com tratamentos inovadores e ambiente luxuoso',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Importando Geist e Geist Mono via Google Fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Geist&family=Geist+Mono&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        style={{ fontFamily: "'Geist', 'Geist Mono', sans-serif" }}
        className="antialiased"
      >
        {children}
        <Analytics />
      </body>
    </html>
  )
}
