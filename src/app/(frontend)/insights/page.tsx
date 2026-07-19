import type { Metadata } from 'next'
import Link from 'next/link'

import { SEED_POSTS } from '@/data/seed-posts'
import { getPublishedPosts } from '@/lib/payload'
import { breadcrumbJsonLd, buildMetadata, organizationJsonLd } from '@/lib/seo'
import { JsonLd } from '@/components/frontend/JsonLd'
import { Placeholder } from '@/components/frontend/Placeholder'
import { Reveal } from '@/components/frontend/Reveal'

// Reads real D1 at request time (the build phase stubs the database), same as Home/About. ISR is
// the flagged next optimization — see BUILD_LOG.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = buildMetadata({
  title: 'Insights',
  description:
    'Practical guides from a working factory floor — choosing a team wear manufacturer, fabric certifications explained, wetsuit construction, tech packs and the Sialkot story.',
  path: '/insights',
})

type PostListItem = {
  slug: string
  title: string
  excerpt: string
  authorLabel: string
  date: string | null
}

/**
 * Insights index (spec §5 /insights): the blog listing. Published CMS posts always win; the
 * drafted seed articles (src/data/seed-posts.ts, decision B3-A) fill the listing until each is
 * approved and entered in the CMS — a CMS post with a seed's slug simply replaces it here.
 */
export default async function InsightsPage() {
  const cmsPosts = await getPublishedPosts(50)

  const cmsSlugs = new Set(cmsPosts.map((p) => p.slug))
  const items: PostListItem[] = [
    ...cmsPosts.map((p) => ({
      slug: p.slug ?? '',
      title: p.title,
      excerpt: p.excerpt ?? '',
      authorLabel: p.authorLabel ?? 'RUN APPAREL',
      date: p.publishedDate ?? null,
    })),
    ...SEED_POSTS.filter((s) => !cmsSlugs.has(s.slug)).map((s) => ({
      slug: s.slug,
      title: s.title,
      excerpt: s.excerpt,
      authorLabel: s.authorLabel,
      date: s.publishedDate,
    })),
  ]
    .filter((p) => p.slug)
    .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))

  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Insights', path: '/insights' },
        ])}
      />

      {/* Hero */}
      <section className="relative isolate overflow-hidden border-b border-[color:var(--hairline)]">
        <div className="blueprint-grid absolute inset-0 -z-10" aria-hidden="true" />
        <div className="u-container py-20 md:py-28">
          <Reveal>
            <p className="label-mono mb-6">[ INSIGHTS · NOTES FROM THE FACTORY FLOOR ]</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="display display-hero max-w-4xl">
              We make things. Here’s what <span className="serif-accent">we’ve learned.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-7 max-w-2xl text-lg text-[color:var(--muted)]">
              Practical guides for brands, teams and sourcing partners — written from the
              manufacturing side of the table: what to ask, what to specify, and how garments
              actually get made.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Article grid */}
      <section className="u-container my-24">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((post, i) => (
            <Reveal key={post.slug} delay={(i % 3) * 0.05}>
              <Link
                href={`/insights/${post.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-card border border-[color:var(--hairline)] bg-[color:var(--surface)] transition-transform hover:-translate-y-1.5"
              >
                <Placeholder
                  label={`INSIGHT N°${String(i + 1).padStart(2, '0')}`}
                  ratio="16 / 9"
                  className="border-b border-[color:var(--hairline)]"
                />
                <div className="flex flex-1 flex-col p-6">
                  <p className="label-mono mb-4">
                    {post.date ? `[ ${formatDate(post.date)} ]` : '[ GUIDE ]'}
                  </p>
                  <h2 className="display text-xl">{post.title}</h2>
                  {post.excerpt ? (
                    <p className="mt-3 text-sm text-[color:var(--muted)]">{post.excerpt}</p>
                  ) : null}
                  <p className="label-mono mt-auto pt-6 opacity-0 transition-opacity group-hover:opacity-100">
                    [ READ → ]
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
        {!items.length ? (
          <p className="text-[color:var(--muted)]">The first articles are being written.</p>
        ) : null}
      </section>

      {/* CTA */}
      <section className="u-container my-24">
        <Reveal>
          <div className="relative isolate overflow-hidden rounded-card border border-[color:var(--hairline)] bg-[color:var(--surface)] px-8 py-16 text-center sm:px-16">
            <div className="blueprint-grid absolute inset-0 -z-10" aria-hidden="true" />
            <h2 className="display display-section mx-auto max-w-2xl">
              Research done? <span className="serif-accent">Let’s make something.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-[color:var(--muted)]">
              When you’re ready to move from reading to making, the quote form is the shortest
              path. We respond within 2 business days.
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

function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d
    .toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    .toUpperCase()
}
