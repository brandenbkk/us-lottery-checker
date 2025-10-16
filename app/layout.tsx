import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'US Lottery Checker',
  description: 'Check your US lottery tickets easily',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans">{children}</body>
    </html>
  )
}
