import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { CATEGORY_COPY } from '@/data/category-copy'
import { lexicalToPlainText } from '@/lib/lexical'
import { getCategoryBySlug, getProductsByCategory } from '@/lib/payload'
import { breadcrumbJsonLd, buildMetadata, organizationJsonLd } from '@/lib/seo'
import { JsonLd } from '@/components/frontend/JsonLd'
import { Placeholder } from '@/components/frontend/Placeholder'
import { ProductCard } from '@/components/frontend/ProductCard'
import { Reveal } from '@/components/frontend/Reveal'
import { RichText } from '@/components/frontend/RichText'

// Reads real D1 at request time (the build phase stubs the database), same as Home/About. ISR is
// the flagged next optimization — see BUILD_LOG.
export const dynamic = 'force-dynamic'

type Params = { category: string }

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { category: slug } = await params
  const [category, copy] = [await getCategoryBySlug(slug), CATEGORY_COPY[slug]]
  if (!category && !copy) return {}
  const title = category?.seo?.metaTitle ?? copy?.metaTitle ?? category?.name ?? 'Catalog'
  const description = category?.seo?.metaDescription ?? copy?.metaDescription
  return buildMetadata({ title, description, path: `/catalog/${slug}` })
}

/**
 * Category landing page (spec §5 /catalog/[category]) — the five of these are the site's primary
 * SEO keyword landers (spec §12), so they carry substantial capability copy, not a thin grid.
 *
 * Copy model, same as every Phase 3 page: the CMS wins when it has content (the category's
 * `intro` rich text, written at copy review), else the drafted fallback in
 * src/data/category-copy.ts renders — that draft is what Hateem reviews now.
 *
 * Resilience: if D1 is unreachable (local dev without a seeded database) but the slug is one of
 * the five, the lander still renders from the draft; the product grid simply shows its empty
 * state. A slug unknown to both the CMS and the draft map is a real 404.
 */
export default async function CategoryLanderPage({ params }: { params: Promise<Params> }) {
  const { category: slug } = await params
  const category = await getCategoryBySlug(slug)
  const copy = CATEGORY_COPY[slug]
  if (!category && !copy) notFound()

  const name = category?.name ?? FALLBACK_NAMES[slug] ?? 'Catalog'
  const products = category ? await getProductsByCategory(category.id) : []
  const hasCmsIntro = hasRichTextContent(category?.intro)

  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Catalog', path: '/catalog' },
          { name, path: `/catalog/${slug}` },
        ])}
      />

      {/* Hero — keyword H1 (spec §12), category name in the label */}
      <section className="relative isolate overflow-hidden border-b border-[color:var(--hairline)]">
        <div className="blueprint-grid absolute inset-0 -z-10" aria-hidden="true" />
        <div className="u-container py-20 md:py-28">
          <Reveal>
            <p className="label-mono mb-6">
              [ CATALOG · {name.toUpperCase()} · MADE TO ORDER ]
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="display display-hero max-w-4xl">
              {copy?.h1 ?? name} <span className="serif-accent">{copy?.h1Accent ?? ''}</span>
            </h1>
          </Reveal>
          <Reveal delay={0.18}>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href={`/rfq?category=${slug}`} className="btn btn-primary">
                Request a quote →
              </Link>
              <Link href="/capabilities" className="btn btn-ghost">
                How we manufacture
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* The lander copy — CMS intro wins once written at copy review; drafted copy until then */}
      <section className="u-container my-24">
        <div className="grid items-start gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal>
            {hasCmsIntro ? (
              <RichText data={category?.intro} className="max-w-2xl text-[color:var(--muted)]" />
            ) : (
              <div className="prose-run max-w-2xl text-[color:var(--muted)]">
                {(copy?.intro ?? []).map((p) => (
                  <p key={p.slice(0, 32)}>{p}</p>
                ))}
              </div>
            )}
          </Reveal>
          <Reveal delay={0.08}>
            <div className="rounded-card border border-[color:var(--hairline)] bg-[color:var(--surface)] p-6">
              <p className="label-mono mb-4">[ IN THIS FAMILY ]</p>
              <ul className="space-y-2.5">
                {(copy?.items ?? []).map((item) => (
                  <li
                    key={item}
                    className="border-t border-[color:var(--hairline)] pt-2.5 text-sm text-[color:var(--muted)]"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Why RUN for this family */}
      {copy?.points?.length ? (
        <section className="u-container my-24">
          <Reveal>
            <p className="label-mono mb-3">N°01 — WHY RUN FOR {name.toUpperCase()}</p>
            <h2 className="display display-section max-w-3xl">
              What we bring to this <span className="serif-accent">family.</span>
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {copy.points.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.05}>
                <div className="h-full rounded-card border border-[color:var(--hairline)] bg-[color:var(--surface)] p-6">
                  <p className="label-mono">N°{String(i + 1).padStart(2, '0')}</p>
                  <h3 className="display mt-6 text-xl">{p.title}</h3>
                  <p className="mt-2 text-sm text-[color:var(--muted)]">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}

      {/* Article grid — published products in this category */}
      <section className="u-container my-24">
        <Reveal>
          <p className="label-mono mb-3">N°02 — ARTICLES</p>
          <h2 className="display display-section max-w-3xl">
            {products.length ? 'Starting points, ready to adapt.' : 'Articles are on their way.'}
          </h2>
        </Reveal>

        {products.length ? (
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p, i) => (
              <Reveal key={p.id} delay={(i % 3) * 0.05}>
                <ProductCard product={p} categorySlug={slug} />
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal delay={0.05}>
            <div className="mt-12 rounded-card border border-[color:var(--hairline)] bg-[color:var(--surface)] p-8 sm:p-12">
              <div className="grid items-center gap-8 md:grid-cols-[1fr_auto]">
                <div>
                  <p className="max-w-2xl text-lg text-[color:var(--muted)]">
                    Article pages for this family are being prepared. But made to order means we
                    never needed a catalog to start — tell us what you want to make and we’ll take
                    it from your brief.
                  </p>
                </div>
                <Link href={`/rfq?category=${slug}`} className="btn btn-primary shrink-0">
                  Request a quote →
                </Link>
              </div>
              <Placeholder
                label={`${name.toUpperCase()} · ARTICLE PHOTOGRAPHY`}
                ratio="16 / 6"
                className="mt-8 rounded-card border border-[color:var(--hairline)]"
              />
            </div>
          </Reveal>
        )}
      </section>

      {/* Cross-links + CTA */}
      <section className="u-container my-24">
        <Reveal>
          <div className="relative isolate overflow-hidden rounded-card border border-[color:var(--hairline)] bg-[color:var(--surface)] px-8 py-16 text-center sm:px-16">
            <div className="blueprint-grid absolute inset-0 -z-10" aria-hidden="true" />
            <h2 className="display display-section mx-auto max-w-2xl">
              Ready when <span className="serif-accent">you are.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-[color:var(--muted)]">
              Send a tech pack, a reference garment or a rough idea. We respond within 2 business
              days — and the first conversation costs nothing.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Link href={`/rfq?category=${slug}`} className="btn btn-primary">
                Request a quote →
              </Link>
              <Link href="/sustainability" className="btn btn-ghost">
                Our sustainability facts
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  )
}

/** Names used only when the CMS is unreachable AND the slug is one of the five. */
const FALLBACK_NAMES: Record<string, string> = {
  'team-wear': 'Team Wear',
  'active-wear': 'Active Wear',
  'casual-wear': 'Casual Wear',
  'outer-wear': 'Outer Wear',
  'sports-accessories': 'Sports Accessories',
}

/** A Lexical doc saved empty still has a root + empty paragraph — "has content" means real text. */
function hasRichTextContent(value: unknown): boolean {
  return lexicalToPlainText(value).length > 0
}
