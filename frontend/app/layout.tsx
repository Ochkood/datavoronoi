import type { Metadata, Viewport } from 'next'
import { Finlandica, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from '@/components/ui/sonner'
import { SiteFontSync } from '@/components/site-font-sync'
import { mergeSiteSettings, type SiteSettings } from '@/lib/site-settings'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin", "cyrillic"],
  variable: '--font-inter',
})

const finlandica = Finlandica({ 
  subsets: ["latin"],
  variable: '--font-finlandica',
})

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api"

async function fetchPublicSiteSettings() {
  try {
    const res = await fetch(`${apiBase}/admin-settings/public`, {
      next: { revalidate: 300 },
    })
    if (!res.ok) return null
    const json = (await res.json()) as {
      success: boolean
      data?: { settings?: Partial<SiteSettings> }
    }
    return json?.data?.settings || null
  } catch {
    return null
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const incoming = await fetchPublicSiteSettings()
  const settings = mergeSiteSettings(incoming || null)
  const resolvedSiteUrl = settings.general.siteUrl || siteUrl
  const siteName = settings.general.siteName || "Datanews.mn"
  const description = settings.general.siteDescription

  return {
    metadataBase: new URL(resolvedSiteUrl),
    title: `${siteName} - Data-Driven Visual Stories`,
    description,
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
}

export const viewport: Viewport = {
  themeColor: '#1a56db',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="mn">
      <body className={`${inter.variable} ${finlandica.variable} font-sans antialiased`}>
        <SiteFontSync />
        {children}
        <Toaster richColors position="top-right" />
        <Analytics />
      </body>
    </html>
  )
}
