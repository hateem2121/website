import 'server-only'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Category, Page, Post, CaseStudy, Product } from '@/payload-types'

/**
 * Server-only content access for the public site.
 *
 * WHY EVERYTHING IS "SAFE": `next build` hands the Payload config inert stub bindings during the
 * build phase (see payload.config.ts — it prevents 9 build workers colliding on the local D1 file).
 * So any data read during the build throws by design. Public routes are therefore rendered
 * dynamically (they read the real D1 binding at request time), and these helpers additionally
 * swallow the build-phase throw and return null/[] so a stray build-time probe can never crash the
 * build. At runtime the same helpers return real data.
 *
 * WHY overrideAccess:false — it makes the Local API honour collection access rules. With no logged-in
 * user that means `publishedOrStaff` returns only published rows, so drafts never leak onto the
 * public site.
 */

const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build'

export async function getPayloadClient() {
  return getPayload({ config: await configPromise })
}

type GlobalSlug = 'site-settings' | 'navigation' | 'footer' | 'exclusion-list'

export async function getGlobalSafe<T>(slug: GlobalSlug, depth = 1): Promise<T | null> {
  if (isBuildPhase) return null
  try {
    const payload = await getPayloadClient()
    return (await payload.findGlobal({ slug, depth })) as T
  } catch (err) {
    console.error(`[content] global "${slug}" unavailable:`, err)
    return null
  }
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
  if (isBuildPhase) return null
  try {
    const payload = await getPayloadClient()
    const res = await payload.find({
      collection: 'pages',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 2,
      overrideAccess: false,
    })
    return (res.docs[0] as Page) ?? null
  } catch (err) {
    console.error(`[content] page "${slug}" unavailable:`, err)
    return null
  }
}

export async function getCategories(): Promise<Category[]> {
  if (isBuildPhase) return []
  try {
    const payload = await getPayloadClient()
    const res = await payload.find({
      collection: 'categories',
      sort: 'order',
      limit: 20,
      depth: 1,
      overrideAccess: false,
    })
    return res.docs as Category[]
  } catch (err) {
    console.error('[content] categories unavailable:', err)
    return []
  }
}

export async function getPublishedCaseStudies(limit = 3): Promise<CaseStudy[]> {
  if (isBuildPhase) return []
  try {
    const payload = await getPayloadClient()
    const res = await payload.find({
      collection: 'case-studies',
      limit,
      depth: 1,
      overrideAccess: false,
    })
    return res.docs as CaseStudy[]
  } catch (err) {
    console.error('[content] case studies unavailable:', err)
    return []
  }
}

export async function getPublishedPosts(limit = 12): Promise<Post[]> {
  if (isBuildPhase) return []
  try {
    const payload = await getPayloadClient()
    const res = await payload.find({
      collection: 'posts',
      sort: '-publishedDate',
      limit,
      depth: 1,
      overrideAccess: false,
    })
    return res.docs as Post[]
  } catch (err) {
    console.error('[content] posts unavailable:', err)
    return []
  }
}

export async function getPublishedProducts(limit = 60): Promise<Product[]> {
  if (isBuildPhase) return []
  try {
    const payload = await getPayloadClient()
    const res = await payload.find({
      collection: 'products',
      limit,
      depth: 1,
      overrideAccess: false,
    })
    return res.docs as Product[]
  } catch (err) {
    console.error('[content] products unavailable:', err)
    return []
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  if (isBuildPhase) return null
  try {
    const payload = await getPayloadClient()
    const res = await payload.find({
      collection: 'categories',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 1,
      overrideAccess: false,
    })
    return (res.docs[0] as Category) ?? null
  } catch (err) {
    console.error(`[content] category "${slug}" unavailable:`, err)
    return null
  }
}

export async function getProductsByCategory(categoryId: number, limit = 60): Promise<Product[]> {
  if (isBuildPhase) return []
  try {
    const payload = await getPayloadClient()
    const res = await payload.find({
      collection: 'products',
      where: { category: { equals: categoryId } },
      sort: '-updatedAt',
      limit,
      depth: 1,
      overrideAccess: false,
    })
    return res.docs as Product[]
  } catch (err) {
    console.error(`[content] products for category ${categoryId} unavailable:`, err)
    return []
  }
}

/** depth 2 so the category relation AND colourway poster images arrive populated. */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (isBuildPhase) return null
  try {
    const payload = await getPayloadClient()
    const res = await payload.find({
      collection: 'products',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 2,
      overrideAccess: false,
    })
    return (res.docs[0] as Product) ?? null
  } catch (err) {
    console.error(`[content] product "${slug}" unavailable:`, err)
    return null
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (isBuildPhase) return null
  try {
    const payload = await getPayloadClient()
    const res = await payload.find({
      collection: 'posts',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 1,
      overrideAccess: false,
    })
    return (res.docs[0] as Post) ?? null
  } catch (err) {
    console.error(`[content] post "${slug}" unavailable:`, err)
    return null
  }
}
