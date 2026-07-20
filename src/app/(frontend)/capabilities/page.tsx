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
  title: 'Capabilities',
  description:
    'Inside RUN APPAREL’s Sialkot facility: five production stages with 5+ QC checkpoints, 3D prototyping in CLO3D and Optitex, laser cutting to ±0.5 mm, and 100,000+ units per month.',
  path: '/capabilities',
})

/**
 * Capabilities / Manufacturing (spec §5): the 5-stage process with QC checkpoints, facility stats,
 * machinery, and the 3D prototyping (CLO3D/Optitex) story. Every figure comes from the Company
 * Master Prompt — no invented numbers.
 *
 * Copy is drafted for Hateem's page-by-page review (Phase 3 gate); a CMS `pages/capabilities` doc,
 * if present, overrides the hero heading/subheading — same model as Home and About.
 */
export default async function CapabilitiesPage() {
  const page = await getPageBySlug('capabilities')
  const hero = page?.layout?.find((b) => b.blockType === 'hero') as
    | Extract<NonNullable<Page['layout']>[number], { blockType: 'hero' }>
    | undefined

  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Capabilities', path: '/capabilities' },
        ])}
      />

      <CapabilitiesHero block={hero} />
      <FacilityStats />
      <FiveStageProcess />
      <EngineeredBeforeSewn />
      <MachineryAndMethods />
      <WorkingWithUs />
      <CapabilitiesCta />
    </>
  )
}

/* ------------------------------------------------------------------ Hero */

function CapabilitiesHero({
  block,
}: {
  block?: Extract<NonNullable<Page['layout']>[number], { blockType: 'hero' }>
}) {
  const subheading =
    block?.subheading ??
    'One facility on Daska Road, Sialkot: 193,000+ square metres, 200+ precision machines and 200+ specialists, running five production stages with a QC checkpoint at every gate.'

  return (
    <section className="relative isolate overflow-hidden border-b border-[color:var(--hairline)]">
      <div className="blueprint-grid absolute inset-0 -z-10" aria-hidden="true" />
      <div className="u-container grid items-center gap-10 py-20 md:py-28 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <Reveal>
            <p className="label-mono mb-6">[ CAPABILITIES · MANUFACTURING · SIALKOT, PK ]</p>
          </Reveal>
          <Reveal delay={0.05}>
            {block?.heading ? (
              <h1 className="display display-hero">{block.heading}</h1>
            ) : (
              <h1 className="display display-hero">
                Tech pack in, shipment out — <span className="serif-accent">one roof.</span>
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
              <Link href="/catalog" className="btn btn-ghost">
                See what we make
              </Link>
            </div>
          </Reveal>
        </div>
        <Reveal delay={0.1}>
          <Placeholder
            label="FACILITY PHOTOGRAPHY"
            ratio="4 / 5"
            className="rounded-card border border-[color:var(--hairline)]"
          />
        </Reveal>
      </div>
    </section>
  )
}

/* --------------------------------------------------------------- Facility stats */

const FACILITY_STATS = [
  { value: '193,000+', label: 'Square metres of production facility' },
  { value: '200+', label: 'Precision machines across 3 cutting lines' },
  { value: '100,000+', label: 'Units per month capacity' },
  { value: '5+', label: 'QC checkpoints on every production run' },
]

function FacilityStats() {
  return (
    <section className="u-container my-24">
      <Reveal>
        <p className="label-mono mb-3">N°01 — THE FACILITY</p>
        <h2 className="display display-section max-w-3xl">
          Enterprise scale, run like a <span className="serif-accent">workshop.</span>
        </h2>
        <p className="mt-6 max-w-2xl text-lg text-[color:var(--muted)]">
          Numbers matter to a sourcing decision, so here are ours. Behind them is the part that
          doesn’t fit in a table: 200+ artisans, engineers, designers and production specialists,
          many trained in techniques the family has been refining since 1889.
        </p>
      </Reveal>
      <div className="mt-12 grid grid-cols-2 gap-8 md:grid-cols-4">
        {FACILITY_STATS.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.05}>
            <div className="border-t border-[color:var(--hairline)] pt-5">
              <p className="display text-3xl md:text-4xl">{s.value}</p>
              <p className="mt-2 text-sm text-[color:var(--muted)]">{s.label}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

/* --------------------------------------------------------- The 5-stage process */

type Stage = {
  title: string
  body: string
  checkpoint: string
}

/** The Company Master Prompt's manufacturing process, verbatim in substance. Each stage ends at a
 * named QC checkpoint — the "5+ checkpoints per run" the snapshot quotes. */
const STAGES: Stage[] = [
  {
    title: 'Pre-production & planning',
    body: 'Your requirements become an engineered garment before anything is cut: client consultation, 3D virtual prototyping in CLO3D and Optitex, certified material sourcing, and sample approval.',
    checkpoint: 'Tech pack approved',
  },
  {
    title: 'Material preparation & sourcing',
    body: 'Every incoming fabric is lab-checked — colorfastness, shrinkage, tensile strength — then pre-treated before it is allowed anywhere near a cutting table.',
    checkpoint: 'Materials approved for the floor',
  },
  {
    title: 'Cutting & initial processing',
    body: 'Algorithmic pattern nesting plans each lay at 90–95% material utilization, and laser cutting holds a ±0.5 mm tolerance — precision that shows up later as consistent fit.',
    checkpoint: 'Dimensional accuracy verified',
  },
  {
    title: 'Assembly, finishing & customization',
    body: 'Primary assembly on overlock, cover-stitch and flatlock machines; reinforced construction and seam finishing; then your identity — all-over sublimation printing and precision embroidery.',
    checkpoint: 'Assembly quality verified',
  },
  {
    title: 'Quality assurance, packaging & delivery',
    body: 'In-line inspection during sewing, AQL final inspection on the finished batch, rework where needed, then labeling and traceability documentation — and your feedback feeds the next run.',
    checkpoint: 'Batch accepted · shipment authorized',
  },
]

function FiveStageProcess() {
  return (
    <section className="u-container my-24">
      <Reveal>
        <p className="label-mono mb-3">N°02 — THE PROCESS</p>
        <h2 className="display display-section max-w-3xl">
          Five stages. A checkpoint at <span className="serif-accent">every gate.</span>
        </h2>
        <p className="mt-6 max-w-2xl text-lg text-[color:var(--muted)]">
          Nothing moves to the next stage until it passes the checkpoint of the one before. That is
          the whole quality system in one sentence — the rest is discipline.
        </p>
      </Reveal>

      <ol className="mt-14 space-y-4">
        {STAGES.map((s, i) => (
          <li key={s.title}>
            <Reveal delay={(i % 2) * 0.05}>
              <div className="grid gap-6 rounded-card border border-[color:var(--hairline)] bg-[color:var(--surface)] p-6 sm:p-8 md:grid-cols-[auto_1fr_auto] md:items-start">
                <p className="label-mono text-[color:var(--volt-deep)]">
                  [ STAGE {String(i + 1).padStart(2, '0')} ]
                </p>
                <div>
                  <h3 className="display text-xl md:text-2xl">{s.title}</h3>
                  <p className="mt-2 max-w-2xl text-[color:var(--muted)]">{s.body}</p>
                </div>
                <p className="label-mono md:text-right">
                  ✓ QC — <span className="text-[color:var(--text)]">{s.checkpoint}</span>
                </p>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  )
}

/* --------------------------------------- 3D prototyping story (the one ink band) */

const DIGITAL_POINTS = [
  {
    title: 'CLO3D & Optitex prototyping',
    body: 'Your garment exists — drape, fit, tension — before a metre of fabric is committed.',
  },
  {
    title: 'Biomechanical engineering',
    body: 'Panels and seams placed for how the body actually moves in your sport, not just how the garment hangs.',
  },
  {
    title: 'Computational construction',
    body: 'Pattern nesting at 90–95% utilization and machine-guided cutting — accuracy that compounds into less waste.',
  },
]

/** The one full-bleed ink band this page carries (DESIGN.md §3). */
function EngineeredBeforeSewn() {
  return (
    <section className="my-24 bg-[color:var(--text)] py-20 text-[color:var(--bg)]">
      <div className="u-container">
        <p className="label-mono mb-3 text-[color:var(--volt)]">N°03 — ENGINEERED BEFORE IT’S SEWN</p>
        <h2 className="display display-section max-w-3xl">
          The sample room is now a <span className="serif-accent">design studio.</span>
        </h2>
        <p className="mt-6 max-w-2xl text-lg opacity-80">
          3D virtual prototyping means fewer physical samples, faster approvals and less fabric in
          the bin. You see and correct the garment on screen; the sampling loop that used to take
          courier weeks happens in a review call.
        </p>
        <div className="mt-12 grid gap-10 md:grid-cols-3">
          {DIGITAL_POINTS.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.05}>
              <div className="border-t border-[color:var(--bg)]/20 pt-4">
                <h3 className="display text-xl">{p.title}</h3>
                <p className="mt-2 opacity-80">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ----------------------------------------------------------- Machinery & methods */

const METHODS = [
  {
    title: 'Laser cutting',
    body: '±0.5 mm tolerance on every panel — the difference between “about right” and repeatable fit across a 10,000-piece order.',
  },
  {
    title: 'Algorithmic nesting',
    body: 'Software plans each cutting lay at 90–95% material utilization. Less scrap is both a cost and a sustainability number.',
  },
  {
    title: 'Performance seams',
    body: 'Overlock, cover stitch and flatlock construction, with reinforcement where your sport punishes a garment most.',
  },
  {
    title: 'Sublimation printing',
    body: 'All-over, unlimited-colour graphics dyed into the fabric itself — nothing to crack, peel or fade in a season.',
  },
  {
    title: 'Precision embroidery',
    body: 'Crests, logotypes and detailing where a printed mark won’t do justice.',
  },
  {
    title: 'Incoming fabric lab checks',
    body: 'Colorfastness, shrinkage and tensile strength verified on arrival — problems caught before they are sewn in.',
  },
]

function MachineryAndMethods() {
  return (
    <section className="u-container my-24">
      <Reveal>
        <p className="label-mono mb-3">N°04 — MACHINERY & METHODS</p>
        <h2 className="display display-section max-w-3xl">What the floor can do.</h2>
      </Reveal>
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {METHODS.map((m, i) => (
          <Reveal key={m.title} delay={(i % 3) * 0.05}>
            <div className="h-full rounded-card border border-[color:var(--hairline)] bg-[color:var(--surface)] p-6">
              <p className="label-mono">N°{String(i + 1).padStart(2, '0')}</p>
              <h3 className="display mt-6 text-xl">{m.title}</h3>
              <p className="mt-2 text-sm text-[color:var(--muted)]">{m.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal delay={0.1}>
        <div className="mt-6">
          <Placeholder
            label="PRODUCTION FLOOR PHOTOGRAPHY"
            ratio="16 / 6"
            className="rounded-card border border-[color:var(--hairline)]"
          />
        </div>
      </Reveal>
    </section>
  )
}

/* ------------------------------------------------------------- Working with us */

const ENGAGEMENT = [
  {
    title: 'Inquiry',
    body: 'A no-commitment conversation about your requirements, volumes and vision.',
  },
  {
    title: 'Custom proposal',
    body: '3D designs, fabric and apparel samples, and transparent pricing — decided with you, not for you.',
  },
  {
    title: 'Production',
    body: 'On-time delivery without compromising quality, with the five-stage process above behind every batch.',
  },
]

function WorkingWithUs() {
  return (
    <section className="u-container my-24">
      <Reveal>
        <p className="label-mono mb-3">N°05 — WORKING WITH US</p>
        <h2 className="display display-section max-w-3xl">
          Three steps from idea to <span className="serif-accent">delivery.</span>
        </h2>
      </Reveal>
      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {ENGAGEMENT.map((e, i) => (
          <Reveal key={e.title} delay={i * 0.05}>
            <div className="relative isolate h-full overflow-hidden rounded-card border border-[color:var(--hairline)] bg-[color:var(--surface)] p-6">
              <div className="blueprint-grid absolute inset-0 -z-10 opacity-60" aria-hidden="true" />
              <p className="label-mono">[ {String(i + 1).padStart(2, '0')} ]</p>
              <h3 className="display mt-8 text-xl">{e.title}</h3>
              <p className="mt-2 text-sm text-[color:var(--muted)]">{e.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ Closing CTA */

function CapabilitiesCta() {
  return (
    <section className="u-container my-24">
      <Reveal>
        <div className="relative isolate overflow-hidden rounded-card border border-[color:var(--hairline)] bg-[color:var(--surface)] px-8 py-16 text-center sm:px-16">
          <div className="blueprint-grid absolute inset-0 -z-10" aria-hidden="true" />
          <h2 className="display display-section mx-auto max-w-2xl">
            Put the floor to work on <span className="serif-accent">your programme.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[color:var(--muted)]">
            Send us your tech pack — or just the idea. We respond within 2 business days.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link href="/rfq" className="btn btn-primary">
              Request a quote →
            </Link>
            <Link href="/sustainability" className="btn btn-ghost">
              How we make it responsibly
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
