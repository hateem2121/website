import type { Metadata } from 'next'
import { SITE_URL, absoluteUrl } from './site'

/**
 * Per-page metadata (spec §12): canonical + OG/Twitter, hreflang-ready (en + x-default), and an
 * easy noindex switch for gated/utility routes. `title` is the page-specific part — the layout's
 * title.template ("%s · RUN APPAREL") supplies the brand suffix for the document title.
 */
export function buildMetadata({
  title,
  description,
  path = '/',
  ogImage,
  noindex = false,
}: {
  title: string
  description?: string
  path?: string
  ogImage?: string
  noindex?: boolean
}): Metadata {
  const canonical = absoluteUrl(path)
  const images = ogImage ? [{ url: ogImage }] : undefined
  return {
    title,
    description,
    alternates: { canonical, languages: { en: canonical, 'x-default': canonical } },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'website',
      siteName: 'RUN APPAREL',
      images,
    },
    twitter: { card: 'summary_large_image', title, description, images: ogImage ? [ogImage] : undefined },
    robots: noindex ? { index: false, follow: false } : undefined,
  }
}

// ---- JSON-LD (spec §12) ----

/**
 * Organization schema. foundingDate is 2020 — RUN APPAREL as a legal entity — NOT 1889; the 1889
 * heritage belongs in prose only (spec §12, never fabricate an entity founding date).
 */
export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'RUN APPAREL (PVT) LTD',
    url: SITE_URL,
    description:
      'B2B custom apparel manufacturer in Sialkot, Pakistan — team wear, active wear, casual wear, outerwear and sports accessories, made to order. Craftsmanship rooted in a family manufacturing heritage that traces to 1889.',
    foundingDate: '2020',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '13 Km Daska Road',
      addressLocality: 'Sialkot',
      postalCode: '51040',
      addressCountry: 'PK',
    },
    parentOrganization: { '@type': 'Organization', name: 'Durus Industries (Pvt) Ltd' },
    areaServed: ['Europe', 'North America', 'South America', 'Middle East'],
  }
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'RUN APPAREL',
    url: SITE_URL,
  }
}

/**
 * Product schema for article pages (spec §12): made-to-order, and NEVER an `offers` block — no
 * price exists publicly until teasers are enabled, and fabricating one is explicitly banned.
 */
export function productJsonLd({
  name,
  description,
  path,
  categoryName,
  image,
}: {
  name: string
  description?: string
  path: string
  categoryName?: string
  image?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    url: absoluteUrl(path),
    ...(image ? { image: absoluteUrl(image) } : {}),
    ...(categoryName ? { category: categoryName } : {}),
    brand: { '@type': 'Brand', name: 'RUN APPAREL' },
    manufacturer: { '@type': 'Organization', name: 'RUN APPAREL (PVT) LTD' },
  }
}

/** Article schema for insights posts (spec §12). */
export function articleJsonLd({
  title,
  description,
  path,
  datePublished,
  dateModified,
  authorName = 'RUN APPAREL',
}: {
  title: string
  description?: string
  path: string
  datePublished?: string
  dateModified?: string
  authorName?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url: absoluteUrl(path),
    mainEntityOfPage: absoluteUrl(path),
    ...(datePublished ? { datePublished } : {}),
    ...(dateModified ? { dateModified } : {}),
    author: {
      '@type': authorName === 'RUN APPAREL' ? 'Organization' : 'Person',
      name: authorName,
    },
    publisher: { '@type': 'Organization', name: 'RUN APPAREL (PVT) LTD', url: SITE_URL },
  }
}

export function breadcrumbJsonLd(crumbs: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  }
}
