import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navigation from '../components/Navigation'

// Use local Inter font files
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Penzi Admin Dashboard',
  description: 'Admin dashboard for Penzi SMS service',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <Navigation />
        <main>
          {children}
        </main>
      </body>
    </html>
  )
} 