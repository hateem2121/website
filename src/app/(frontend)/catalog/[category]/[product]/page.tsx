import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, permanentRedirect } from 'next/navigation'

import { SIZE_OPTIONS } from '@/data/catalog-options'
import { getProductBySlug, getProductsByCategory } from '@/lib/payload'
import { breadcrumbJsonLd, buildMetadata, productJsonLd } from '@/lib/seo'
import { mediaAlt, mediaUrl } from '@/lib/site'
import type { Category } from '@/payload-types'
import { ColorwayPicker, type ColorwayView } from '@/components/frontend/ColorwayPicker'
import { JsonLd } from '@/components/frontend/JsonLd'
import { ProductCard } from '@/components/frontend/ProductCard'
import { Reveal } from '@/components/frontend/Reveal'
import { RichText } from '@/components/frontend/RichText'

// Reads real D1 at request time (the build phase stubs the database), same as Home/About. ISR is
// the flagged next optimization — see BUILD_LOG.
export const dynamic = 'force-dynamic'

type Params = { category: string; product: string }

const SIZE_LABELS = new Map<string, string>(SIZE_OPTIONS.map((o) => [o.value, o.label]))

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { category, product: slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return {}
  const poster = product.colorways?.[0]?.posterImage
  return buildMetadata({
    title: product.seo?.metaTitle ?? product.title,
    description: product.seo?.metaDescription ?? product.shortDescription ?? undefined,
    path: `/catalog/${category}/${slug}`,
    ogImage: mediaUrl(product.seo?.ogImage) ?? mediaUrl(poster) ?? undefined,
  })
}

/**
 * Article page (spec §5 /catalog/[category]/[product]): poster-first, made-to-order framing,
 * specs, colourway switcher, related articles, RFQ CTA that carries the article into the quote.
 *
 * What is deliberately NOT here yet:
 * - The §7 3D viewer — its stack (react-three-fiber/drei) is a Phase-4 install and a separate ask;
 *   the ColorwayPicker holds the layout slot and already speaks the same switcher interaction.
 * - "Save to list" — that is the Phase-6 buyer portal.
 * - Any price/MOQ, unless the product's own "Show these publicly" switch is on AND both numbers
 *   exist (spec §8.3/RQ5) — and then only as a "from" teaser line. No offers in JSON-LD ever
 *   until teasers are enabled; fabricating pricing is banned (spec §12).
 */
export default async function ProductPage({ params }: { params: Promise<Params> }) {
  const { category: categorySlug, product: slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) notFound()

  // Canonical URL enforcement: a published product has exactly one home. If the category segment
  // in the address doesn't match the product's real category, send the visitor (and crawlers,
  // permanently) to the right one — this is also what lets the admin Live Preview link work
  // without knowing the category slug.
  const category = typeof product.category === 'object' ? (product.category as Category) : null
  const realCategorySlug = category?.slug ?? categorySlug
  if (realCategorySlug !== categorySlug) {
    permanentRedirect(`/catalog/${realCategorySlug}/${slug}`)
  }

  const colorways: ColorwayView[] = (product.colorways ?? []).map((c) => ({
    name: c.name,
    swatchHex: c.swatchHex,
    posterUrl: mediaUrl(c.posterImage),
    posterAlt: mediaAlt(c.posterImage),
  }))

  const related = category
    ? (await getProductsByCategory(category.id, 4)).filter((p) => p.id !== product.id).slice(0, 3)
    : []

  const showTeaser = Boolean(
    product.showTeasers && product.moqStartingAt && product.priceStartingAtUSD,
  )

  const sizes = (product.availableSizes ?? []).map((v) => SIZE_LABELS.get(v) ?? v)

  return (
    <>
      <JsonLd
        data={productJsonLd({
          name: product.title,
          description: product.shortDescription ?? undefined,
          path: `/catalog/${realCategorySlug}/${slug}`,
          categoryName: category?.name,
          image: colorways[0]?.posterUrl ?? undefined,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Catalog', path: '/catalog' },
          ...(category ? [{ name: category.name, path: `/catalog/${realCategorySlug}` }] : []),
          { name: product.title, path: `/catalog/${realCategorySlug}/${slug}` },
        ])}
      />

      <section className="u-container py-14 md:py-20">
        {/* Breadcrumb trail (visible) */}
        <Reveal>
          <nav aria-label="Breadcrumb" className="label-mono mb-10">
            <Link href="/catalog" className="hover:text-[color:var(--text)]">
              CATALOG
            </Link>
            {category ? (
              <>
                {' / '}
                <Link
                  href={`/catalog/${realCategorySlug}`}
                  className="hover:text-[color:var(--text)]"
                >
                  {category.name.toUpperCase()}
                </Link>
              </>
            ) : null}
            {' / '}
            <span aria-current="page" className="text-[color:var(--text)]">
              {product.title.toUpperCase()}
            </span>
          </nav>
        </Reveal>

        <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr]">
          {/* Poster / future 3D viewer slot */}
          <Reveal>
            <ColorwayPicker colorways={colorways} productTitle={product.title} />
          </Reveal>

          {/* The article */}
          <div>
            <Reveal>
              <p className="label-mono mb-4">[ {category?.name.toUpperCase() ?? 'CATALOG'} · MADE TO ORDER ]</p>
              <h1 className="display display-section">{product.title}</h1>
            </Reveal>

            {product.shortDescription ? (
              <Reveal delay={0.05}>
                <p className="mt-5 max-w-xl text-lg text-[color:var(--muted)]">
                  {product.shortDescription}
                </p>
              </Reveal>
            ) : null}

            {showTeaser ? (
              <Reveal delay={0.08}>
                <p className="label-mono mt-6 text-[color:var(--volt-deep)]">
                  [ MOQ FROM {product.moqStartingAt} PCS · FROM ${product.priceStartingAtUSD} ]
                </p>
              </Reveal>
            ) : null}

            <Reveal delay={0.1}>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href={`/rfq?product=${slug}${category ? `&category=${realCategorySlug}` : ''}`}
                  className="btn btn-primary"
                >
                  Request a quote for this article →
                </Link>
                <Link href="/contact" className="btn btn-ghost">
                  Ask a question
                </Link>
              </div>
            </Reveal>

            {/* Specs — everything optional; render only what exists (made-to-order, not inventory) */}
            <Reveal delay={0.12}>
              <div className="mt-10 border-t border-[color:var(--hairline)]">
                <SpecRow label="Fabric" value={product.fabricComposition} />
                <SpecRow label="Weight" value={product.gsm ? `${product.gsm} GSM` : null} />
                <SpecRow label="Sizes" value={sizes.length ? sizes.join(' · ') : null} />
                <SpecRow
                  label="Colourways"
                  value={
                    colorways.length
                      ? `${colorways.length} built to date — unlimited on request`
                      : 'Unlimited — built to your palette'
                  }
                />
                {product.keyFeatures?.length ? (
                  <div className="border-b border-[color:var(--hairline)] py-4">
                    <p className="label-mono mb-2.5">FEATURES</p>
                    <ul className="space-y-1.5">
                      {product.keyFeatures.map((f) => (
                        <li key={f.id ?? f.feature} className="text-sm text-[color:var(--muted)]">
                          — {f.feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {product.certificationsNote ? (
                  <div className="border-b border-[color:var(--hairline)] py-4">
                    <p className="label-mono mb-2.5">MATERIALS & COMPLIANCE</p>
                    <p className="text-sm text-[color:var(--muted)]">{product.certificationsNote}</p>
                  </div>
                ) : null}
              </div>
            </Reveal>

            <Reveal delay={0.14}>
              <p className="mt-6 text-sm text-[color:var(--muted)]">
                Every spec on this page is a starting point — fabric, fit, colours and branding are
                engineered to your programme. That’s what made to order means here.
              </p>
            </Reveal>
          </div>
        </div>

        {/* Long description */}
        {product.longDescription ? (
          <Reveal delay={0.05}>
            <div className="mt-20 max-w-3xl">
              <p className="label-mono mb-4">[ ABOUT THIS ARTICLE ]</p>
              <RichText data={product.longDescription} className="text-[color:var(--muted)]" />
            </div>
          </Reveal>
        ) : null}
      </section>

      {/* Related articles */}
      {related.length ? (
        <section className="u-container my-24">
          <Reveal>
            <div className="mb-10 flex items-end justify-between gap-6">
              <h2 className="display display-section">More in {category?.name ?? 'this family'}.</h2>
              {category ? (
                <Link
                  href={`/catalog/${realCategorySlug}`}
                  className="label-mono hidden shrink-0 hover:text-[color:var(--text)] sm:block"
                >
                  [ VIEW ALL → ]
                </Link>
              ) : null}
            </div>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p, i) => (
              <Reveal key={p.id} delay={(i % 3) * 0.05}>
                <ProductCard product={p} categorySlug={realCategorySlug} />
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}
    </>
  )
}

function SpecRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null
  return (
    <div className="grid grid-cols-[7rem_1fr] gap-4 border-b border-[color:var(--hairline)] py-4">
      <p className="label-mono">{label.toUpperCase()}</p>
      <p className="text-sm text-[color:var(--text)]">{value}</p>
    </div>
  )
}
