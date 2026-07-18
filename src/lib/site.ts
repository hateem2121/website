import type { Media } from '@/payload-types'

/**
 * Canonical absolute base for metadata, Open Graph, sitemap and JSON-LD.
 *
 * Defaults to the workers.dev preview until the Phase-8 DNS cutover to wear-run.com (spec §17);
 * override per-environment with NEXT_PUBLIC_SITE_URL. Nothing here touches the live domain.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://run-apparel.hateemjamshaid.workers.dev'
).replace(/\/+$/, '')

export function absoluteUrl(path = '/'): string {
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

/** A media relation is either a populated Media doc, its numeric id, or null. */
type MediaRef = Media | number | null | undefined

export function mediaUrl(media: MediaRef): string | null {
  if (!media || typeof media === 'number') return null
  return media.url ?? null
}

export function mediaAlt(media: MediaRef): string {
  if (!media || typeof media === 'number') return ''
  return media.alt ?? ''
}

export function mediaDimensions(media: MediaRef): { width: number; height: number } | null {
  if (!media || typeof media === 'number' || !media.width || !media.height) return null
  return { width: media.width, height: media.height }
}
