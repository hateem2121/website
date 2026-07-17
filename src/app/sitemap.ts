import type { MetadataRoute } from 'next'
import { getCategories, getPublishedPosts, getPublishedProducts } from '@/lib/payload'
import { absoluteUrl } from '@/lib/site'

/**
 * XML sitemap (spec §12). Dynamic so it reads real D1 at request time — the build phase stubs the
 * database, so a build-time sitemap would list only the static routes. Gated areas (/admin, /portal,
 * thank-you pages) are excluded here and disallowed in robots.ts.
 */
export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticRoutes = [
    '/',
    '/about',
    '/capabilities',
    '/sustainability',
    '/catalog',
    '/case-studies',
    '/insights',
    '/contact',
    '/rfq',
  ]
  const entries: MetadataRoute.Sitemap = staticRoutes.map((p) => ({
    url: absoluteUrl(p),
    lastModified: now,
  }))

  const [categories, products, posts] = await Promise.all([
    getCategories(),
    getPublishedProducts(200),
    getPublishedPosts(200),
  ])

  for (const c of categories) {
    if (c.slug) entries.push({ url: absoluteUrl(`/catalog/${c.slug}`), lastModified: now })
  }
  for (const p of products) {
    const cat = typeof p.category === 'object' && p.category ? p.category.slug : null
    if (p.slug && cat) {
      entries.push({
        url: absoluteUrl(`/catalog/${cat}/${p.slug}`),
        lastModified: new Date(p.updatedAt),
      })
    }
  }
  for (const post of posts) {
    if (post.slug) {
      entries.push({ url: absoluteUrl(`/insights/${post.slug}`), lastModified: new Date(post.updatedAt) })
    }
  }

  return entries
}
