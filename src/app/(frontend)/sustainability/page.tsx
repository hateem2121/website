import type { Metadata } from 'next'
import Link from 'next/link'

import { getPageBySlug } from '@/lib/payload'
import { breadcrumbJsonLd, buildMetadata, organizationJsonLd } from '@/lib/seo'
import type { Page } from '@/payload-types'
import { JsonLd } from '@/components/frontend/JsonLd'
import { Placeholder } from '@/components/frontend/Placeholder'
import { Reveal } from '@/components/frontend/Reveal'

// Reads real D1 at request time (the build phase stubs the database), same as Home/About. ISR is
// the flagged next optimization — see BUILD_LOG.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = buildMetadata({
  title: 'Sustainability',
  description:
    'RUN APPAREL’s sustainability commitments, each with a backing fact: certified-supplier sourcing, 40%+ water reduction, a 2030 carbon-neutral target, waste minimisation and strict chemical management.',
  path: '/sustainability',
})

/**
 * Sustainability (spec §5): commitments with backing facts ONLY — the Company Master Prompt bans
 * buzzwords without a fact behind them, so every claim below is paired with its number or mechanism.
 *
 * Certification framing is binding law (spec §21.7 / B4): the certifications sit within RUN's
 * compliance ecosystem — held by Durus Industries and by certified suppliers — NEVER "RUN is
 * certified". No certification logos are rendered anywhere: logo files wait on Hateem confirming
 * permission (spec §19 open item); names in plain text carry the story until then.
 *
 * Copy is drafted for Hateem's page-by-page review; a CMS `pages/sustainability` doc, if present,
 * overrides the hero heading/subheading — same model as Home and About.
 */
export default async function SustainabilityPage() {
  const page = await getPageBySlug('sustainability')
  const hero = page?.layout?.find((b) => b.blockType === 'hero') as
    | Extract<NonNullable<Page['layout']>[number], { blockType: 'hero' }>
    | undefined

  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Sustainability', path: '/sustainability' },
        ])}
      />

      <SustainabilityHero block={hero} />
      <CommitmentsWithFacts />
      <CertifiedEcosystem />
      <EthicalManufacturing />
      <SustainabilityCta />
    </>
  )
}

/* ------------------------------------------------------------------ Hero */

function SustainabilityHero({
  block,
}: {
  block?: Extract<NonNullable<Page['layout']>[number], { blockType: 'hero' }>
}) {
  const subheading =
    block?.subheading ??
    'No slogans without numbers. Every commitment on this page comes with the fact that backs it — sourcing, water, energy, waste and chemistry.'

  return (
    <section className="relative isolate overflow-hidden border-b border-[color:var(--hairline)]">
      <div className="blueprint-grid absolute inset-0 -z-10" aria-hidden="true" />
      <div className="u-container grid items-center gap-10 py-20 md:py-28 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <Reveal>
            <p className="label-mono mb-6">[ SUSTAINABILITY · FOR A BETTER TOMORROW ]</p>
          </Reveal>
          <Reveal delay={0.05}>
            {block?.heading ? (
              <h1 className="display display-hero">{block.heading}</h1>
            ) : (
              <h1 className="display display-hero">
                Claims are cheap. <span className="serif-accent">Facts aren’t.</span>
              </h1>
            )}
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-7 max-w-xl text-lg text-[color:var(--muted)]">{subheading}</p>
          </Reveal>
          <Reveal delay={0.18}>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/rfq" className="btn btn-primary">
                Request a quote →
              </Link>
              <Link href="/capabilities" className="btn btn-ghost">
                See how we manufacture
              </Link>
            </div>
          </Reveal>
        </div>
        <Reveal delay={0.1}>
          <Placeholder
            label="MATERIALS PHOTOGRAPHY"
            ratio="4 / 5"
            className="rounded-card border border-[color:var(--hairline)]"
          />
        </Reveal>
      </div>
    </section>
  )
}

/* ---------------------------------------------------- Commitments, each with its fact */

type Commitment = {
  claim: string
  fact: string
}

/** Straight from the Company Master Prompt's Sustainability Commitments — claim + backing fact,
 * nothing added. */
const COMMITMENTS: Commitment[] = [
  {
    claim: 'Certified materials only',
    fact: 'Fabric is sourced exclusively from GOTS-, OEKO-TEX- and RCS-certified suppliers — the certificates live with the mills, where they belong, and are verifiable at source.',
  },
  {
    claim: 'Less water, measurably',
    fact: 'Water consumption in production is down more than 40% — a number, not an ambition.',
  },
  {
    claim: 'Carbon-neutral by 2030',
    fact: 'A dated target, pursued through a transition to renewable energy across operations.',
  },
  {
    claim: 'Waste engineered out',
    fact: 'Pattern optimization and scrap recovery minimise textile waste, with zero-waste manufacturing increasingly integrated across facilities.',
  },
  {
    claim: 'Energy discipline',
    fact: 'LED production lighting and ongoing equipment modernization cut energy use on the floor itself, not just in the brochure.',
  },
  {
    claim: 'Chemistry beyond compliance',
    fact: 'Chemical management exceeds OEKO-TEX and GOTS requirements, using biodegradable alternatives where they exist.',
  },
]

function CommitmentsWithFacts() {
  return (
    <section className="u-container my-24">
      <Reveal>
        <p className="label-mono mb-3">N°01 — COMMITMENTS, WITH RECEIPTS</p>
        <h2 className="display display-section max-w-3xl">
          Six commitments. Six <span className="serif-accent">backing facts.</span>
        </h2>
      </Reveal>
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {COMMITMENTS.map((c, i) => (
          <Reveal key={c.claim} delay={(i % 3) * 0.05}>
            <div className="h-full rounded-card border border-[color:var(--hairline)] bg-[color:var(--surface)] p-6">
              <p className="label-mono">N°{String(i + 1).padStart(2, '0')}</p>
              <h3 className="display mt-6 text-xl">{c.claim}</h3>
              <p className="mt-2 text-sm text-[color:var(--muted)]">{c.fact}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

/* ------------------------------------------------- The certified ecosystem (ink band) */

/** Plain-text certification names only — logo files wait on permission (spec §19 open item), and
 * the ecosystem caption (B4) is mandatory wherever certifications appear. */
const ECOSYSTEM_CERTS = [
  'GOTS — Global Organic Textile Standard',
  'OEKO-TEX Standard 100',
  'OEKO-TEX Made in Green',
  'GRS — Global Recycled Standard',
  'Recycled Blended Claim Standard',
  'Organic 100 Content Standard',
  'ISO 9001 — Quality Management',
  'SMETA (Sedex) — ethical trade audit, latest July 2025',
  'BSCI — Business Social Compliance Initiative',
]

function CertifiedEcosystem() {
  return (
    <section className="my-24 bg-[color:var(--text)] py-20 text-[color:var(--bg)]">
      <div className="u-container">
        <p className="label-mono mb-3 text-[color:var(--volt)]">N°02 — THE CERTIFIED ECOSYSTEM</p>
        <h2 className="display display-section max-w-3xl">
          Certifications that live where the <span className="serif-accent">work happens.</span>
        </h2>
        <div className="mt-6 max-w-2xl space-y-4 text-lg opacity-80">
          <p>
            These standards are held within RUN’s compliance ecosystem — by our parent company,
            Durus Industries, and by our certified fabric and trim suppliers — rather than
            registered to RUN APPAREL as its own legal entity. We say that plainly because
            traceability you can verify beats a badge you can’t.
          </p>
          <p>
            If your programme requires a certification RUN does not yet carry in its own name, we
            will pursue it on request.
          </p>
        </div>
        <ul className="mt-12 grid gap-x-10 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
          {ECOSYSTEM_CERTS.map((c) => (
            <li key={c} className="border-t border-[color:var(--bg)]/20 pt-3 text-sm">
              {c}
            </li>
          ))}
        </ul>
        <p className="label-mono mt-10 text-[color:var(--volt)]">
          [ HELD WITHIN RUN’S COMPLIANCE ECOSYSTEM — BY DURUS INDUSTRIES AND CERTIFIED SUPPLIERS ]
        </p>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------ Ethical manufacturing */

function EthicalManufacturing() {
  return (
    <section className="u-container my-24">
      <div className="grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <div>
            <p className="label-mono mb-3">N°03 — PEOPLE</p>
            <h2 className="display display-section">
              Sustainability includes the <span className="serif-accent">people sewing it.</span>
            </h2>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <div className="prose-run max-w-xl text-[color:var(--muted)]">
            <p>
              Ethical manufacturing here is audited, not asserted: the parent company undergoes
              third-party social-compliance auditing (SMETA via Sedex, most recently July 2025) and
              is a BSCI member. Behind those audits are 200+ skilled artisans, engineers, designers
              and production specialists — a workforce carrying a craft tradition that goes back
              five generations in Sialkot.
            </p>
            <p>
              We measure our environmental work the same way we measure quality: against
              checkpoints, with documentation. It’s the same discipline, pointed at a different
              outcome.
            </p>
            <p className="text-sm">
              <Link href="/about">Meet the family behind the facility →</Link>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ Closing CTA */

function SustainabilityCta() {
  return (
    <section className="u-container my-24">
      <Reveal>
        <div className="relative isolate overflow-hidden rounded-card border border-[color:var(--hairline)] bg-[color:var(--surface)] px-8 py-16 text-center sm:px-16">
          <div className="blueprint-grid absolute inset-0 -z-10" aria-hidden="true" />
          <h2 className="display display-section mx-auto max-w-2xl">
            Build a programme you can <span className="serif-accent">stand behind.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[color:var(--muted)]">
            Tell us your sustainability requirements up front — certified fabrics, recycled content,
            audit documentation — and we’ll quote to them.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link href="/rfq" className="btn btn-primary">
              Request a quote →
            </Link>
            <Link href="/contact" className="btn btn-ghost">
              Ask us anything
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
