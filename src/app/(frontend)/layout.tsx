import type { Metadata } from 'next'
import React from 'react'

import { archivo, instrumentSerif } from './fonts'
import './globals.css'

import { getGlobalSafe } from '@/lib/payload'
import { SITE_URL } from '@/lib/site'
import type { Footer, Navigation, SiteSetting } from '@/payload-types'
import { AnnouncementBar } from '@/components/frontend/AnnouncementBar'
import { SiteFooter } from '@/components/frontend/SiteFooter'
import { SiteHeader, type NavItem } from '@/components/frontend/SiteHeader'
import { ThemeScript } from '@/components/frontend/ThemeScript'
import { WhatsAppButton } from '@/components/frontend/WhatsAppButton'

const FALLBACK_NAV: NavItem[] = [
  { label: 'Catalog', href: '/catalog' },
  { label: 'Capabilities', href: '/capabilities' },
  { label: 'Sustainability', href: '/sustainability' },
  { label: 'Heritage', href: '/about' },
  { label: 'Insights', href: '/insights' },
  { label: 'Contact', href: '/contact' },
]

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'RUN APPAREL — Custom B2B Sportswear & Team Wear Manufacturer',
    template: '%s · RUN APPAREL',
  },
  description:
    'RUN APPAREL is a 100% B2B custom apparel manufacturer in Sialkot, Pakistan — team wear, active wear, casual wear, outerwear and sports accessories, made to order for brands, teams and organisations worldwide. Craftsmanship rooted in 1889.',
  applicationName: 'RUN APPAREL',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: 'RUN APPAREL',
    locale: 'en',
    url: SITE_URL,
    title: 'RUN APPAREL — Custom B2B Sportswear & Team Wear Manufacturer',
    description:
      'Custom, made-to-order apparel for brands, teams and organisations. Heritage to 1889, manufactured in Sialkot, Pakistan.',
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
}

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const [nav, footer, settings] = await Promise.all([
    getGlobalSafe<Navigation>('navigation', 1),
    getGlobalSafe<Footer>('footer', 1),
    getGlobalSafe<SiteSetting>('site-settings', 1),
  ])

  const items: NavItem[] = nav?.items?.length
    ? nav.items.map((i) => ({
        label: i.label,
        href: i.href,
        children: i.children?.map((c) => ({ label: c.label, href: c.href })),
      }))
    : FALLBACK_NAV

  return (
    <html
      lang="en"
      className={`${archivo.variable} ${instrumentSerif.variable}`}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body>
        <a href="#content" className="skip-link">
          Skip to content
        </a>
        <div className="grain-overlay" aria-hidden="true" />
        <AnnouncementBar settings={settings} />
        <SiteHeader items={items} />
        <main id="content">{children}</main>
        <SiteFooter footer={footer} settings={settings} />
        <WhatsAppButton settings={settings} />
      </body>
    </html>
  )
}
