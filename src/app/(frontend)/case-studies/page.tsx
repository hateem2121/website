import type { Metadata } from 'next'
import Link from 'next/link'

import { lexicalToPlainText } from '@/lib/lexical'
import { getPublishedCaseStudies } from '@/lib/payload'
import { breadcrumbJsonLd, buildMetadata, organizationJsonLd } from '@/lib/seo'
import type { CaseStudy } from '@/payload-types'
import { JsonLd } from '@/components/frontend/JsonLd'
import { Placeholder } from '@/components/frontend/Placeholder'
import { Reveal } from '@/components/frontend/Reveal'

// Reads real D1 at request time (the build phase stubs the database), same as Home/About. ISR is
// the flagged next optimization — see BUILD_LOG.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = buildMetadata({
  title: 'Case Studies',
  description:
    'Anonymised stories of programmes RUN APPAREL has manufactured — sector, region, challenge and result. Clients stay unnamed by policy; the work speaks in specifics.',
  path: '/case-studies',
})

/**
 * Case studies (spec §5): anonymised cards only (B2 — never a real client name; the schema itself
 * has no client-name field). The page renders honestly in both states: with published stories, a
 * card grid; with none, an explanation of the anonymisation policy rather than a fake wall of
 * logos. Nav linking is handled in the layout — the section only appears in the fallback menu
 * when at least one story is published (spec §5's auto-hide rule).
 */
export default async function CaseStudiesPage() {
  const studies = await getPublishedCaseStudies(24)

  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Case Studies', path: '/case-studies' },
        ])}
      />

      {/* Hero */}
      <section className="relative isolate overflow-hidden border-b border-[color:var(--hairline)]">
        <div className="blueprint-grid absolute inset-0 -z-10" aria-hidden="true" />
        <div className="u-container py-20 md:py-28">
          <Reveal>
            <p className="label-mono mb-6">[ SELECTED WORK · ANONYMISED BY POLICY ]</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="display display-hero max-w-4xl">
              The work is real. The names are <span className="serif-accent">off the record.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-7 max-w-2xl text-lg text-[color:var(--muted)]">
              We are 100% B2B: our partners’ programmes are their competitive edge, so we never
              trade on their names. What we can share is the shape of the work — the sector, the
              region, the problem and the result.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Cards or the honest empty state */}
      <section className="u-container my-24">
        {studies.length ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {studies.map((s, i) => (
              <Reveal key={s.id} delay={(i % 3) * 0.05}>
                <CaseStudyCard study={s} index={i} />
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal>
            <div className="rounded-card border border-[color:var(--hairline)] bg-[color:var(--surface)] p-8 sm:p-12">
              <p className="label-mono mb-4">[ STORIES IN PREPARATION ]</p>
              <p className="max-w-2xl text-lg text-[color:var(--muted)]">
                The first anonymised stories are being written up with our partners’ consent —
                anonymisation takes a little longer than name-dropping, and we think it’s worth it.
                In the meantime, our capabilities page shows exactly what the facility can do.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/capabilities" className="btn btn-primary">
                  Explore our capabilities →
                </Link>
                <Link href="/rfq" className="btn btn-ghost">
                  Start your own programme
                </Link>
              </div>
            </div>
          </Reveal>
        )}
      </section>

      {/* CTA */}
      <section className="u-container my-24">
        <Reveal>
          <div className="relative isolate overflow-hidden rounded-card border border-[color:var(--hairline)] bg-[color:var(--surface)] px-8 py-16 text-center sm:px-16">
            <div className="blueprint-grid absolute inset-0 -z-10" aria-hidden="true" />
            <h2 className="display display-section mx-auto max-w-2xl">
              Be the next story we <span className="serif-accent">can’t name.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-[color:var(--muted)]">
              Tell us what you’re building. We respond within 2 business days.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Link href="/rfq" className="btn btn-primary">
                Request a quote →
              </Link>
              <Link href="/contact" className="btn btn-ghost">
                Talk to us first
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  )
}

/* ------------------------------------------------------------------ Card */

function CaseStudyCard({ study, index }: { study: CaseStudy; index: number }) {
  const challenge = excerpt(lexicalToPlainText(study.challenge))
  const results = excerpt(lexicalToPlainText(study.results))

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-card border border-[color:var(--hairline)] bg-[color:var(--surface)]">
      <Placeholder
        label={`CASE N°${String(index + 1).padStart(2, '0')}`}
        ratio="16 / 9"
        className="border-b border-[color:var(--hairline)]"
      />
      <div className="flex flex-1 flex-col p-6">
        <p className="label-mono mb-4">
          [{study.sector ? ` ${study.sector.toUpperCase()} ` : ' '}
          {study.region ? `· ${study.region.toUpperCase()} ` : ''}]
        </p>
        <h2 className="display text-xl">{study.anonymizedClient}</h2>
        {challenge ? (
          <p className="mt-3 text-sm text-[color:var(--muted)]">
            <span className="label-mono">CHALLENGE — </span>
            {challenge}
          </p>
        ) : null}
        {results ? (
          <p className="mt-3 text-sm text-[color:var(--muted)]">
            <span className="label-mono">RESULT — </span>
            {results}
          </p>
        ) : null}
        <div className="mt-auto pt-6">
          <Link href="/rfq" className="label-mono hover:text-[color:var(--text)]">
            [ START SOMETHING SIMILAR → ]
          </Link>
        </div>
      </div>
    </article>
  )
}

function excerpt(text: string, max = 180): string {
  if (!text) return ''
  return text.length <= max ? text : `${text.slice(0, max).replace(/\s+\S*$/, '')}…`
}
