import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Il Nome Giusto — Trova il nome perfetto per il tuo bambino',
  description: 'Un questionario guidato dall\'AI che analizza le tue preferenze e suggerisce i nomi più adatti per il tuo bambino, con significato, origine e compatibilità fonetica.',
  keywords: 'nome bambino, scegliere nome, nomi italiani, nome neonato, AI nomi',
  authors: [{ name: 'Il Nome Giusto' }],
  openGraph: {
    title: 'Il Nome Giusto',
    description: 'Trova il nome perfetto per il tuo bambino con l\'aiuto dell\'intelligenza artificiale.',
    url: 'https://ilnomegiusto.it',
    siteName: 'Il Nome Giusto',
    locale: 'it_IT',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Il Nome Giusto',
    description: 'Trova il nome perfetto per il tuo bambino.',
  },
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#FAF7F2',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  )
}
