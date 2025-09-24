
import './globals.css'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Quake Vibes 🌍',
  description: 'A simple earthquake visualization app built with Next.js, React, and Leaflet.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}

