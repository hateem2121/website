import type { MetadataRoute } from 'next'
import { SITE_URL, absoluteUrl } from '@/lib/site'

/**
 * robots.txt (spec §12). The /rfq landing stays indexable; the admin, the API, the buyer portal and
 * RFQ thank-you/step states are kept out of search.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api', '/portal', '/rfq/thank-you'],
    },
    sitemap: absoluteUrl('/sitemap.xml'),
    host: SITE_URL,
  }
}
