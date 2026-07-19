import type { Metadata } from 'next'
import Link from 'next/link'

import { getPageBySlug } from '@/lib/payload'
import { breadcrumbJsonLd, buildMetadata, organizationJsonLd } from '@/lib/seo'
import type { Page } from '@/payload-types'
import { JsonLd } from '@/components/frontend/JsonLd'
import { Placeholder } from '@/components/frontend/Placeholder'
import { Reveal } from '@/components/frontend/Reveal'

// Reads real D1 at request time (the build phase stubs the database), same as Home. Static-served
// caching (ISR) is the flagged optimization to layer on next — see BUILD_LOG.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = buildMetadata({
  title: 'Heritage',
  description:
    'The RUN APPAREL story — one Sialkot family, five generations. From a leather artisan in 1889 to a modern, 100% B2B apparel division of Durus Industries.',
  path: '/about',
})

/**
 * About / Heritage (spec §5).
 *
 * Founder is **Allah Ditta Ghafuree**, anchored to **1889**, and never named "Sandal" — the family
 * name that appears in later timeline entries (M. Iqbal Sandal, Sandal Trading Corporation) is a
 * different generation and is kept per the Company Master Prompt. The 1889 date lives in prose only;
 * the JSON-LD Organization `foundingDate` stays 2020 (RUN APPAREL as a legal entity) — see lib/seo.
 *
 * Copy is drafted from the Company Master Prompt in the locked voice; it is what Hateem reviews now
 * and moves into a CMS `pages/about` doc after sign-off (same model as Home). If that doc already
 * carries a hero, its heading/subheading override the drafted hero below.
 *
 * The spec's eventual treatment is a GSAP scroll-pinned timeline + a 3D globe for the reach map
 * (spec §5/§7). Both need dependencies we haven't added yet (GSAP, react-three-fiber) — an "ask"
 * per CLAUDE.md §6 — so this build uses the installed stack: Motion-based reveals (reduced-motion
 * safe) and an on-brand regions panel. The narrative and layout are complete and swap-in ready.
 */
export default async function AboutPage() {
  const about = await getPageBySlug('about')
  const hero = about?.layout?.find((b) => b.blockType === 'hero') as
    | Extract<NonNullable<Page['layout']>[number], { blockType: 'hero' }>
    | undefined

  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Heritage', path: '/about' },
        ])}
      />

      <AboutHero block={hero} />
      <HeritageTimeline />
      <HeritageEngineered />
      <CarryForward />
      <CertifiedEcosystem />
      <ReachAndLeadership />
      <AboutCta />
    </>
  )
}

/* ------------------------------------------------------------------ Hero */

function AboutHero({
  block,
}: {
  block?: Extract<NonNullable<Page['layout']>[number], { blockType: 'hero' }>
}) {
  const subheading =
    block?.subheading ??
    'One Sialkot family. Five generations of making. RUN APPAREL is the modern, 100% B2B apparel division of Durus Industries — a house whose craft traces to a leather artisan in 1889.'

  return (
    <section className="relative isolate overflow-hidden border-b border-[color:var(--hairline)]">
      <div className="blueprint-grid absolute inset-0 -z-10" aria-hidden="true" />
      <div className="u-container grid items-center gap-10 py-20 md:py-28 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <Reveal>
            <p className="label-mono mb-6">[ HERITAGE · SIALKOT, PK · SINCE 1889 ]</p>
          </Reveal>
          <Reveal delay={0.05}>
            {block?.heading ? (
              <h1 className="display display-hero">{block.heading}</h1>
            ) : (
              <h1 className="display display-hero">
                A family that never <span className="serif-accent">looks back.</span>
              </h1>
            )}
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-7 max-w-xl text-lg text-[color:var(--muted)]">{subheading}</p>
          </Reveal>
          <Reveal delay={0.18}>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/capabilities" className="btn btn-primary">
                See how we make →
              </Link>
              <Link href="/rfq" className="btn btn-ghost">
                Request a quote
              </Link>
            </div>
          </Reveal>
        </div>
        <Reveal delay={0.1}>
          <Placeholder
            label="ARCHIVE PHOTOGRAPHY · 1889"
            ratio="4 / 5"
            className="rounded-card border border-[color:var(--hairline)]"
          />
        </Reveal>
      </div>
    </section>
  )
}

/* ------------------------------------------------------- The heritage timeline */

type Milestone = {
  year: string
  title: string
  body: string
}

/** All facts from the Company Master Prompt heritage section. Founder = Ghafuree; later "Sandal"
 * names are a different generation and kept per spec §5. No end-date framing on 1889. */
const MILESTONES: Milestone[] = [
  {
    year: '1889',
    title: 'The first craft',
    body: 'Allah Ditta Ghafuree, a Sialkot leather artisan, begins the work that becomes the family’s manufacturing legacy — pioneering alum-chrome leather tanning, leather-stretching frames, hydraulic stretching, and the ball-lamination techniques that would help shape an industry.',
  },
  {
    year: '1904',
    title: 'Ghafuree Industries',
    body: 'The craft is formalised into a business. The methods scale, and Sialkot’s reputation as the home of sports-goods manufacturing grows around them.',
  },
  {
    year: '1942 – 1958',
    title: 'The family expands',
    body: 'A new generation builds outward: Sandal Trading Corporation (1942) introduces the Star of Pakistan hockey stick, and Loyal Sports (1952) reaches European markets by 1958. Sialkot’s daily football output climbs toward 200,000, with hundreds of thousands of workers trained in the family’s techniques.',
  },
  {
    year: '1972 – 1974',
    title: 'Engineering the ball',
    body: 'M. Iqbal Sandal’s innovations — PU-on-leather, synthetic PVC/PU laminated footballs, and fibre-texture lamination for a perfectly round ball — help bring the world’s biggest sports brands to Pakistani manufacturing.',
  },
  {
    year: '1992',
    title: 'Durus Industries',
    body: 'The family businesses consolidate into Durus Industries (Pvt) Ltd. “Durus” means strength, durability and endurance in Arabic — a name chosen to carry the values the craft was built on.',
  },
  {
    year: '2020',
    title: 'RUN APPAREL is born',
    body: 'Durus — by now an established sports-goods powerhouse — spins off RUN APPAREL as a dedicated, 100% B2B apparel division, separate from its equipment business, to serve athletic brands, teams, corporate programs and fitness organisations.',
  },
  {
    year: 'Today',
    title: 'The fifth generation',
    body: 'RUN is led by M. Hateem Jamshaid Iqbal, fifth generation of the founding family, from the company’s HQ on Daska Road, Sialkot — the global hub of sports-goods manufacturing.',
  },
]

function HeritageTimeline() {
  return (
    <section className="u-container my-24">
      <Reveal>
        <p className="label-mono mb-3">N°01 — THE LINEAGE</p>
        <h2 className="display display-section max-w-3xl">
          One line, drawn across <span className="serif-accent">five generations.</span>
        </h2>
        <p className="mt-6 max-w-2xl text-lg text-[color:var(--muted)]">
          RUN APPAREL is young as a name and old as a craft. The apparel division opened in 2020, but
          the hands behind it have been making things in Sialkot since 1889.
        </p>
      </Reveal>

      {/* Vertical timeline: a single ink rail with volt markers; each entry rises in on scroll
          (Motion via Reveal, staggered). The GSAP scroll-pinned version is a later enhancement. */}
      <ol className="relative mt-14 border-l border-[color:var(--hairline)] pl-8 sm:pl-12">
        {MILESTONES.map((m, i) => (
          <li key={m.year} className="relative pb-14 last:pb-0">
            <Reveal delay={(i % 2) * 0.05}>
              {/* Marker */}
              <span
                className="absolute -left-[calc(2rem+5px)] top-1.5 h-2.5 w-2.5 rounded-full bg-[color:var(--volt)] ring-4 ring-[color:var(--bg)] sm:-left-[calc(3rem+5px)]"
                aria-hidden="true"
              />
              <p className="label-mono text-[color:var(--volt-deep)]">[ {m.year} ]</p>
              <h3 className="display mt-2 text-2xl md:text-3xl">{m.title}</h3>
              <p className="mt-3 max-w-2xl text-[color:var(--muted)]">{m.body}</p>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  )
}

/* --------------------------------------------- Heritage, engineered forward (ink band) */

const THEN = ['Hand leather tanning', 'Ball lamination by feel', 'Frames, stretching, hydraulics']
const NOW = [
  '3D design in CLO3D & Optitex',
  'Biomechanical engineering',
  'Computational construction, made to order',
]

/** The one full-bleed mode-crossing ink band this page carries (DESIGN.md §3). */
function HeritageEngineered() {
  return (
    <section className="my-24 bg-[color:var(--text)] py-20 text-[color:var(--bg)]">
      <div className="u-container">
        <p className="label-mono mb-3 text-[color:var(--volt)]">N°02 — HERITAGE, ENGINEERED FORWARD</p>
        <h2 className="display display-section max-w-3xl">
          A century of making, meets the <span className="serif-accent">design studio.</span>
        </h2>
        <p className="mt-6 max-w-2xl text-lg opacity-80">
          The instinct is inherited; the tools are new. The same obsession that shaped leather by hand
          now shapes garments in software — every article engineered before a single thread is cut.
        </p>

        <div className="mt-12 grid gap-10 sm:grid-cols-2">
          <Reveal>
            <div>
              <p className="label-mono mb-4 opacity-70">[ THEN ]</p>
              <ul className="space-y-3">
                {THEN.map((t) => (
                  <li key={t} className="border-t border-[color:var(--bg)]/20 pt-3 text-lg">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div>
              <p className="label-mono mb-4 text-[color:var(--volt)]">[ NOW ]</p>
              <ul className="space-y-3">
                {NOW.map((t) => (
                  <li key={t} className="border-t border-[color:var(--volt)]/40 pt-3 text-lg">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------- What we carry forward */

const VALUES = [
  {
    title: 'Craft',
    body: 'A maker’s obsession with fit, fabric and finish — the standard set in 1889, held on every order today.',
  },
  {
    title: 'Family',
    body: 'Five generations, one continuous line of ownership and know-how. We build for the long term because we always have.',
  },
  {
    title: 'Partnership',
    body: '100% B2B — no retail arm, no channel conflict, no competing with the brands we make for. Your programme is the whole job.',
  },
  {
    title: 'Responsibility',
    body: 'Ethical manufacturing and a measurable environmental commitment, backed by a certified supply ecosystem — not slogans.',
  },
]

function CarryForward() {
  return (
    <section className="u-container my-24">
      <Reveal>
        <p className="label-mono mb-3">N°03 — WHAT WE CARRY FORWARD</p>
        <h2 className="display display-section max-w-3xl">Four things that never change.</h2>
      </Reveal>
      <div className="mt-12 grid gap-x-10 gap-y-8 md:grid-cols-2">
        {VALUES.map((v, i) => (
          <Reveal key={v.title} delay={(i % 2) * 0.05}>
            <div className="border-t border-[color:var(--hairline)] pt-5">
              <h3 className="display text-xl">{v.title}</h3>
              <p className="mt-2 max-w-lg text-[color:var(--muted)]">{v.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

/* ---------------------------------------------------------- The certified ecosystem */

function CertifiedEcosystem() {
  return (
    <section className="u-container my-24">
      <div className="grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <div>
            <p className="label-mono mb-3">N°04 — COMPLIANCE</p>
            <h2 className="display display-section">
              Backed by a certified <span className="serif-accent">ecosystem.</span>
            </h2>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <div className="prose-run max-w-xl text-[color:var(--muted)]">
            <p>
              RUN APPAREL operates within, and is backed by, a certified compliance ecosystem — the
              standards are held by our parent company, Durus Industries, and by our fabric and trim
              suppliers, rather than registered to RUN APPAREL as its own legal entity.
            </p>
            <p>
              In practice, that means the certifications behind your order are real and verifiable at
              their source. Where a specific programme requires a certification RUN does not yet carry
              in its own name, we will pursue it on request.
            </p>
            <p className="text-sm">
              <Link href="/sustainability">See our sustainability commitments →</Link>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* --------------------------------------------------- Reach + leadership */

const REGIONS = ['Europe', 'North America', 'South America', 'Middle East']

function ReachAndLeadership() {
  return (
    <section className="u-container my-24">
      <Reveal>
        <p className="label-mono mb-3">N°05 — REACH</p>
        <h2 className="display display-section max-w-3xl">
          Sialkot-made, shipped to <span className="serif-accent">four regions.</span>
        </h2>
        <p className="mt-6 max-w-2xl text-lg text-[color:var(--muted)]">
          We make to order from one place and export to many. Our partners run programmes across four
          regions — engineered, cut and sewn under one roof in Pakistan.
        </p>
      </Reveal>

      {/* Regions panel. The spec's 3D globe (spec §7 engine) swaps in here later; for now a clean,
          blueprint-framed grid carries the reach story without a new 3D dependency. */}
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {REGIONS.map((r, i) => (
          <Reveal key={r} delay={(i % 4) * 0.05}>
            <div className="relative isolate overflow-hidden rounded-card border border-[color:var(--hairline)] bg-[color:var(--surface)] p-6">
              <div className="blueprint-grid absolute inset-0 -z-10 opacity-60" aria-hidden="true" />
              <p className="label-mono">N°{String(i + 1).padStart(2, '0')}</p>
              <h3 className="display mt-8 text-xl">{r}</h3>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1}>
        <div className="mt-6 rounded-card border border-[color:var(--hairline)] bg-[color:var(--surface)] p-8">
          <p className="label-mono mb-3">[ LEADERSHIP ]</p>
          <p className="max-w-3xl text-lg">
            RUN APPAREL is led by <strong className="font-medium text-[color:var(--text)]">M. Hateem
            Jamshaid Iqbal</strong>, fifth generation of the founding family — carrying a craft that
            began in 1889 into a modern, made-to-order apparel business.
          </p>
        </div>
      </Reveal>
    </section>
  )
}

/* ------------------------------------------------------------------ Closing CTA */

function AboutCta() {
  return (
    <section className="u-container my-24">
      <Reveal>
        <div className="relative isolate overflow-hidden rounded-card border border-[color:var(--hairline)] bg-[color:var(--surface)] px-8 py-16 text-center sm:px-16">
          <div className="blueprint-grid absolute inset-0 -z-10" aria-hidden="true" />
          <h2 className="display display-section mx-auto max-w-2xl">
            Build with a house that never <span className="serif-accent">looks back.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[color:var(--muted)]">
            Tell us what you’re making. We’ll bring 135 years of manufacturing instinct to it.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link href="/rfq" className="btn btn-primary">
              Request a quote →
            </Link>
            <Link href="/capabilities" className="btn btn-ghost">
              Explore our capabilities
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
