import type { Metadata } from 'next'
import Link from 'next/link'

import { CATEGORY_BLURB } from '@/data/category-copy'
import { getCategories, getPageBySlug, getPublishedCaseStudies } from '@/lib/payload'
import { DEFAULT_OG_IMAGE, organizationJsonLd, websiteJsonLd } from '@/lib/seo'
import type { Category, CaseStudy, Page } from '@/payload-types'
import { JsonLd } from '@/components/frontend/JsonLd'
import { Placeholder } from '@/components/frontend/Placeholder'
import { RenderBlocks } from '@/components/frontend/RenderBlocks'
import { Reveal } from '@/components/frontend/Reveal'

// Reads real D1 at request time (the build phase stubs the database). Static-served caching (ISR)
// is the flagged optimization to layer on next — see BUILD_LOG.
export const dynamic = 'force-dynamic'

const HOME_TITLE = 'RUN APPAREL — Custom B2B Sportswear & Team Wear Manufacturer'
const HOME_DESCRIPTION =
  'A 100% B2B custom apparel manufacturer in Sialkot, Pakistan. Team wear, active wear, casual wear, outerwear and sports accessories — made to order for brands, teams and organisations worldwide. Craftsmanship rooted in 1889.'

export const metadata: Metadata = {
  title: { absolute: HOME_TITLE },
  description: HOME_DESCRIPTION,
  alternates: { canonical: '/' },
  openGraph: {
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    url: '/',
    type: 'website',
    siteName: 'RUN APPAREL',
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', title: HOME_TITLE, description: HOME_DESCRIPTION, images: [DEFAULT_OG_IMAGE] },
}


export default async function HomePage() {
  const [home, categories, caseStudies] = await Promise.all([
    getPageBySlug('home'),
    getCategories(),
    getPublishedCaseStudies(3),
  ])

  const layout = home?.layout ?? []
  const heroBlock = layout.find((b) => b.blockType === 'hero')
  const personaBlock = layout.find((b) => b.blockType === 'ctaByPersona')
  const middleBlocks = layout.filter(
    (b) => b.blockType !== 'hero' && b.blockType !== 'ctaByPersona',
  ) as NonNullable<Page['layout']>

  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={websiteJsonLd()} />

      <HomeHero block={heroBlock} />
      <CategoryShowcase categories={categories} />

      {middleBlocks.length ? <RenderBlocks blocks={middleBlocks} /> : <WhyAndSustainability />}

      {caseStudies.length ? <CaseStudyTeasers items={caseStudies} /> : null}

      <PersonaDoors block={personaBlock} />
    </>
  )
}

/* ------------------------------------------------------------------ Hero */

function HomeHero({ block }: { block?: Extract<NonNullable<Page['layout']>[number], { blockType: 'hero' }> }) {
  const subheading =
    block?.subheading ??
    'RUN APPAREL is a 100% B2B manufacturer in Sialkot — team wear, active wear, casual wear, outerwear and sports accessories, made to order for the brands, teams and organisations that never look back.'

  return (
    <section className="relative isolate overflow-hidden border-b border-[color:var(--hairline)]">
      <div className="blueprint-grid absolute inset-0 -z-10" aria-hidden="true" />
      <div className="u-container grid items-center gap-10 py-20 md:py-28 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <Reveal>
            <p className="label-mono mb-6">[ B2B APPAREL MANUFACTURER · SIALKOT, PK · EST. LINEAGE 1889 ]</p>
          </Reveal>
          <Reveal delay={0.05}>
            {block?.heading ? (
              <h1 className="display display-hero">{block.heading}</h1>
            ) : (
              <h1 className="display display-hero">
                Custom apparel, made the <span className="serif-accent">extra mile.</span>
              </h1>
            )}
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-7 max-w-xl text-lg text-[color:var(--muted)]">{subheading}</p>
          </Reveal>
          <Reveal delay={0.18}>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href={block?.buttonHref ?? '/rfq'} className="btn btn-primary">
                {block?.buttonLabel ?? 'Request a quote →'}
              </Link>
              <Link href="/catalog" className="btn btn-ghost">
                Explore the catalog
              </Link>
            </div>
          </Reveal>
        </div>
        <Reveal delay={0.1}>
          <Placeholder
            label="HERO PHOTOGRAPHY"
            ratio="4 / 5"
            className="rounded-card border border-[color:var(--hairline)]"
          />
        </Reveal>
      </div>
    </section>
  )
}

/* -------------------------------------------------------- Category showcase */

function CategoryShowcase({ categories }: { categories: Category[] }) {
  if (!categories.length) return null
  return (
    <section className="u-container my-24">
      <div className="mb-10 flex items-end justify-between gap-6">
        <div>
          <p className="label-mono mb-3">N°01 — WHAT WE MAKE</p>
          <h2 className="display display-section max-w-2xl">Five families, one standard.</h2>
        </div>
        <Link href="/catalog" className="label-mono hidden shrink-0 hover:text-[color:var(--text)] sm:block">
          [ VIEW ALL → ]
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                  <span className="label-mono opacity-0 transition-opacity group-hover:opacity-100">→</span>
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
      </div>
    </section>
  )
}

/* -------------------------------------------- Why + sustainability (fallback copy) */

const WHY_STATS = [
  { value: '135+', label: 'Years of manufacturing craftsmanship' },
  { value: '100,000+', label: 'Units per month capacity' },
  { value: '200+', label: 'Precision machines, 5+ QC checkpoints' },
  { value: '40%+', label: 'Reduction in water consumption' },
]

const WHY_POINTS = [
  {
    title: 'Heritage + technology',
    body: 'Craftsmanship traced to 1889, fused with 3D design, biomechanical engineering and computational construction.',
  },
  {
    title: 'Genuine customization',
    body: 'Flexible minimums, unlimited colour matching and rapid modifications — no forced templates.',
  },
  {
    title: 'Enterprise scale, boutique attention',
    body: 'Six-figure monthly capacity paired with dedicated, per-account responsiveness.',
  },
  {
    title: 'True partnership',
    body: 'Multi-year relationships over one-off orders. 100% B2B — no retail arm, no channel conflict.',
  },
]

function WhyAndSustainability() {
  return (
    <>
      <section className="u-container my-24">
        <p className="label-mono mb-3">N°02 — WHY PARTNERS CHOOSE RUN</p>
        <h2 className="display display-section max-w-3xl">
          Enterprise capacity, with a maker&apos;s <span className="serif-accent">obsession.</span>
        </h2>

        <div className="mt-12 grid grid-cols-2 gap-8 md:grid-cols-4">
          {WHY_STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.05}>
              <div className="border-t border-[color:var(--hairline)] pt-4">
                <p className="display text-4xl text-[color:var(--text)] md:text-5xl">{s.value}</p>
                <p className="mt-2 text-sm text-[color:var(--muted)]">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-14 grid gap-x-10 gap-y-8 md:grid-cols-2">
          {WHY_POINTS.map((p) => (
            <Reveal key={p.title}>
              <div>
                <h3 className="display text-xl">{p.title}</h3>
                <p className="mt-2 max-w-lg text-[color:var(--muted)]">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Facility / team feature image */}
      <section className="u-container my-24">
        <Reveal>
          <Placeholder
            label="FACILITY / TEAM PHOTOGRAPHY"
            ratio="16 / 6"
            className="rounded-card border border-[color:var(--hairline)]"
          />
        </Reveal>
      </section>

      {/* Sustainability strip — full-bleed ink band (the one mode-crossing band a light page may carry) */}
      <section className="my-24 bg-[color:var(--text)] py-20 text-[color:var(--bg)]">
        <div className="u-container">
          <p className="label-mono mb-3 text-[color:var(--volt)]">N°03 — FOR A BETTER TOMORROW</p>
          <h2 className="display display-section max-w-3xl">Sustainability, backed by facts.</h2>
          <p className="mt-6 max-w-2xl text-lg opacity-80">
            We source exclusively from GOTS-, OEKO-TEX- and RCS-certified fabric suppliers, have cut
            water consumption by 40%+, and target carbon-neutral operations by 2030. Certifications
            are held within our compliance ecosystem — by parent company Durus Industries and our
            certified suppliers.
          </p>
          <Link
            href="/sustainability"
            className="btn mt-8 border border-[color:var(--bg)]/30 bg-transparent text-[color:var(--bg)] hover:bg-[color:var(--bg)] hover:text-[color:var(--text)]"
          >
            Our commitments →
          </Link>
        </div>
      </section>
    </>
  )
}

/* -------------------------------------------------------- Case-study teasers */

function CaseStudyTeasers({ items }: { items: CaseStudy[] }) {
  return (
    <section className="u-container my-24">
      <p className="label-mono mb-3">N°04 — SELECTED WORK</p>
      <h2 className="display display-section mb-10">Partners, anonymised.</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {items.map((cs) => (
          <Reveal key={cs.id}>
            <Link
              href={`/case-studies`}
              className="flex h-full flex-col rounded-card border border-[color:var(--hairline)] bg-[color:var(--surface)] p-6 transition-transform hover:-translate-y-1.5"
            >
              <p className="label-mono">
                {[cs.sector, cs.region].filter(Boolean).join(' · ') || 'Case study'}
              </p>
              <h3 className="display mt-3 text-xl">{cs.anonymizedClient}</h3>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

/* ---------------------------------------------------------- Persona "three doors" */

const FALLBACK_PERSONAS = [
  {
    persona: 'Brands',
    body: 'Launch a line or scale production with a partner who obsesses over fit, fabric and finish.',
    buttonLabel: 'Start a quote →',
    buttonHref: '/rfq?persona=brand',
  },
  {
    persona: 'Retailers',
    body: 'Private-label ranges, made to your spec and built for your margins.',
    buttonLabel: 'Start a quote →',
    buttonHref: '/rfq?persona=retailer',
  },
  {
    persona: 'Sourcing agents',
    body: "A reliable Sialkot partner for your clients' programs, with transparent communication.",
    buttonLabel: 'Talk to us →',
    buttonHref: '/contact?persona=agent',
  },
]

function PersonaDoors({
  block,
}: {
  block?: Extract<NonNullable<Page['layout']>[number], { blockType: 'ctaByPersona' }>
}) {
  const doors =
    block?.variants?.length
      ? block.variants.map((v) => ({
          persona: v.persona,
          body: v.body ?? '',
          buttonLabel: v.buttonLabel ?? 'Get started →',
          buttonHref: v.buttonHref ?? '/rfq',
        }))
      : FALLBACK_PERSONAS

  return (
    <section className="u-container my-24">
      <p className="label-mono mb-3">N°05 — CHOOSE YOUR DOOR</p>
      <h2 className="display display-section mb-10 max-w-2xl">
        Tell us who you are. We&apos;ll take it from there.
      </h2>
      <div className="grid gap-5 md:grid-cols-3">
        {doors.map((d, i) => (
          <Reveal key={d.persona} delay={i * 0.06}>
            <div className="flex h-full flex-col rounded-card border border-[color:var(--hairline)] bg-[color:var(--surface)] p-7">
              <p className="label-mono">N°{String(i + 1).padStart(2, '0')}</p>
              <h3 className="display mt-3 text-2xl">{d.persona}</h3>
              <p className="mt-3 flex-1 text-[color:var(--muted)]">{d.body}</p>
              <div className="mt-6">
                <Link href={d.buttonHref} className="btn btn-ghost">
                  {d.buttonLabel}
                </Link>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
