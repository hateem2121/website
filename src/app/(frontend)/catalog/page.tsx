import type { Metadata } from 'next'
import Link from 'next/link'

import { CATEGORY_BLURB } from '@/data/category-copy'
import { getCategories } from '@/lib/payload'
import { breadcrumbJsonLd, buildMetadata, organizationJsonLd } from '@/lib/seo'
import { JsonLd } from '@/components/frontend/JsonLd'
import { Placeholder } from '@/components/frontend/Placeholder'
import { Reveal } from '@/components/frontend/Reveal'

// Reads real D1 at request time (the build phase stubs the database), same as Home/About. ISR is
// the flagged next optimization — see BUILD_LOG.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = buildMetadata({
  title: 'Catalog',
  description:
    'Explore RUN APPAREL’s five product families — team wear, active wear, casual wear, outerwear and sports accessories. Every article is made to order for B2B partners.',
  path: '/catalog',
})

/**
 * Catalog index (spec §5): the door into the five category landers. Fully public (Q1). Language is
 * RFQ/quote — this is a capability showcase, not a shop, so there is no cart and no pricing.
 */
export default async function CatalogPage() {
  const categories = await getCategories()

  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Catalog', path: '/catalog' },
        ])}
      />

      {/* Hero */}
      <section className="relative isolate overflow-hidden border-b border-[color:var(--hairline)]">
        <div className="blueprint-grid absolute inset-0 -z-10" aria-hidden="true" />
        <div className="u-container py-20 md:py-28">
          <Reveal>
            <p className="label-mono mb-6">[ CATALOG · FIVE FAMILIES · MADE TO ORDER ]</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="display display-hero max-w-4xl">
              Nothing here is off the shelf — <span className="serif-accent">by design.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-7 max-w-2xl text-lg text-[color:var(--muted)]">
              Every article in this catalog is a starting point, manufactured to your specification:
              your fabric, your fit, your colours, your branding. Browse the five families, open an
              article for its specs and colourways, and request a quote when something looks like
              the beginning of your programme.
            </p>
          </Reveal>
        </div>
      </section>

      {/* The five category doors */}
      <section className="u-container my-24">
        <Reveal>
          <p className="label-mono mb-3">N°01 — THE FIVE FAMILIES</p>
          <h2 className="display display-section max-w-3xl">Pick a family to explore.</h2>
        </Reveal>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c, i) => (
            <Reveal key={c.id} delay={(i % 3) * 0.05}>
              <Link
                href={`/catalog/${c.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-card border border-[color:var(--hairline)] bg-[color:var(--surface)] transition-transform hover:-translate-y-1.5"
              >
                <Placeholder
                  label={c.name}
                  ratio="4 / 3"
                  className="border-b border-[color:var(--hairline)]"
                />
                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-8 flex items-center justify-between">
                    <span className="label-mono">[ N°{String(c.order ?? i + 1).padStart(3, '0')} ]</span>
                    <span className="label-mono opacity-0 transition-opacity group-hover:opacity-100">
                      →
                    </span>
                  </div>
                  <div className="mt-auto">
                    <h3 className="display text-2xl">{c.name}</h3>
                    <p className="mt-2 text-sm text-[color:var(--muted)]">
                      {c.slug ? (CATEGORY_BLURB[c.slug] ?? 'Made to order, to your specification.') : ''}
                    </p>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
          {!categories.length ? (
            <p className="text-[color:var(--muted)]">
              The catalog is being stocked — check back shortly, or{' '}
              <Link href="/rfq" className="underline">
                request a quote
              </Link>{' '}
              directly.
            </p>
          ) : null}
        </div>
      </section>

      {/* How made-to-order works here */}
      <section className="u-container my-24">
        <div className="grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <div>
              <p className="label-mono mb-3">N°02 — HOW TO READ THIS CATALOG</p>
              <h2 className="display display-section">
                A menu of capabilities, not a <span className="serif-accent">warehouse.</span>
              </h2>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="prose-run max-w-xl text-[color:var(--muted)]">
              <p>
                We are a manufacturer, so nothing here is stocked or sold off the page. Each
                article shows what it is made of, the sizes it can run in, and the colourways we
                have built it in before — all of it changeable, because your order is cut for you.
              </p>
              <p>
                Found something close? Request a quote from the article page and it arrives with
                your enquiry attached, so the conversation starts specific. Can’t find your garment
                at all? The RFQ form takes fully custom briefs too.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="u-container my-24">
        <Reveal>
          <div className="relative isolate overflow-hidden rounded-card border border-[color:var(--hairline)] bg-[color:var(--surface)] px-8 py-16 text-center sm:px-16">
            <div className="blueprint-grid absolute inset-0 -z-10" aria-hidden="true" />
            <h2 className="display display-section mx-auto max-w-2xl">
              Don’t see your garment? <span className="serif-accent">We still make it.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-[color:var(--muted)]">
              The catalog shows starting points, not limits. Bring a tech pack or a sketch — we
              respond within 2 business days.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Link href="/rfq" className="btn btn-primary">
                Request a quote →
              </Link>
              <Link href="/capabilities" className="btn btn-ghost">
                See our capabilities
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  )
}
