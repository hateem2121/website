import type { MetadataRoute } from 'next'
import { SEED_POSTS } from '@/data/seed-posts'
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

  // Drafted seed articles (B3-A) are live, indexable fallbacks until their CMS twins exist — a
  // published CMS post with the same slug takes over its URL (and its sitemap row) automatically.
  const cmsSlugs = new Set(posts.map((p) => p.slug))
  for (const seed of SEED_POSTS) {
    if (!cmsSlugs.has(seed.slug)) {
      entries.push({
        url: absoluteUrl(`/insights/${seed.slug}`),
        lastModified: new Date(seed.publishedDate),
      })
    }
  }

  return entries
}
