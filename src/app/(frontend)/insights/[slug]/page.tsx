import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { SEED_POSTS, getSeedPost, type SeedPost } from '@/data/seed-posts'
import { getPostBySlug, getPublishedPosts } from '@/lib/payload'
import { articleJsonLd, breadcrumbJsonLd, buildMetadata } from '@/lib/seo'
import { mediaUrl } from '@/lib/site'
import type { Post } from '@/payload-types'
import { JsonLd } from '@/components/frontend/JsonLd'
import { Placeholder } from '@/components/frontend/Placeholder'
import { Reveal } from '@/components/frontend/Reveal'
import { RichText } from '@/components/frontend/RichText'

// Reads real D1 at request time (the build phase stubs the database), same as Home/About. ISR is
// the flagged next optimization — see BUILD_LOG.
export const dynamic = 'force-dynamic'

type Params = { slug: string }

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (post) {
    return buildMetadata({
      title: post.seo?.metaTitle ?? post.title,
      description: post.seo?.metaDescription ?? post.excerpt ?? undefined,
      path: `/insights/${slug}`,
      ogImage: mediaUrl(post.seo?.ogImage) ?? undefined,
    })
  }
  const seed = getSeedPost(slug)
  if (!seed) return {}
  return buildMetadata({
    title: seed.metaTitle,
    description: seed.metaDescription,
    path: `/insights/${slug}`,
  })
}

/**
 * Insights article page (spec §5 /insights/[slug]). Source order: a published CMS post wins; the
 * drafted seed article (B3-A) renders as fallback until Hateem approves it into the CMS. Both
 * paths emit Article JSON-LD (spec §12) and end on the posts → RFQ internal-linking rail.
 */
export default async function InsightArticlePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  const seed = post ? undefined : getSeedPost(slug)
  if (!post && !seed) notFound()

  const title = post?.title ?? seed!.title
  const excerpt = post?.excerpt ?? seed!.excerpt
  const authorLabel = post?.authorLabel ?? seed!.authorLabel ?? 'RUN APPAREL'
  const date = post?.publishedDate ?? seed!.publishedDate

  return (
    <>
      <JsonLd
        data={articleJsonLd({
          title,
          description: excerpt || undefined,
          path: `/insights/${slug}`,
          datePublished: date ?? undefined,
          dateModified: post?.updatedAt ?? date ?? undefined,
          authorName: authorLabel,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Insights', path: '/insights' },
          { name: title, path: `/insights/${slug}` },
        ])}
      />

      <article>
        {/* Article header */}
        <header className="relative isolate overflow-hidden border-b border-[color:var(--hairline)]">
          <div className="blueprint-grid absolute inset-0 -z-10" aria-hidden="true" />
          <div className="u-container py-16 md:py-24">
            <Reveal>
              <nav aria-label="Breadcrumb" className="label-mono mb-8">
                <Link href="/insights" className="hover:text-[color:var(--text)]">
                  INSIGHTS
                </Link>
                {' / '}
                <span aria-current="page" className="text-[color:var(--text)]">
                  ARTICLE
                </span>
              </nav>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="display display-section max-w-4xl text-balance">{title}</h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="label-mono mt-8">
                [ {authorLabel.toUpperCase()}
                {date ? ` · ${formatDate(date)}` : ''} ]
              </p>
            </Reveal>
          </div>
        </header>

        {/* Body */}
        <div className="u-container my-16 md:my-20">
          <div className="mx-auto max-w-3xl">
            {post ? (
              <RichText data={post.body} className="text-[color:var(--muted)]" />
            ) : (
              <SeedBody seed={seed!} />
            )}
          </div>
        </div>
      </article>

      {/* Read next */}
      <ReadNext currentSlug={slug} />

      {/* CTA */}
      <section className="u-container my-24">
        <Reveal>
          <div className="relative isolate overflow-hidden rounded-card border border-[color:var(--hairline)] bg-[color:var(--surface)] px-8 py-16 text-center sm:px-16">
            <div className="blueprint-grid absolute inset-0 -z-10" aria-hidden="true" />
            <h2 className="display display-section mx-auto max-w-2xl">
              Put the theory to <span className="serif-accent">work.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-[color:var(--muted)]">
              Questions about your own programme? Ask us directly — we respond within 2 business
              days.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Link href="/rfq" className="btn btn-primary">
                Request a quote →
              </Link>
              <Link href="/contact" className="btn btn-ghost">
                Contact us
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  )
}

/* --------------------------------------------------------------- Seed rendering */

/** Renders a drafted seed article's structured sections with the site's prose styling. */
function SeedBody({ seed }: { seed: SeedPost }) {
  return (
    <div className="prose-run text-[color:var(--muted)]">
      {seed.sections.map((section, i) => (
        <section key={section.heading ?? `section-${i}`}>
          {section.heading ? <h2>{section.heading}</h2> : null}
          {section.paragraphs.map((p) => (
            <p key={p.slice(0, 40)}>{p}</p>
          ))}
          {section.bullets?.length ? (
            <ul>
              {section.bullets.map((b) => (
                <li key={b.slice(0, 40)}>{b}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ Read next */

async function ReadNext({ currentSlug }: { currentSlug: string }) {
  const cmsPosts = await getPublishedPosts(12)
  const cmsSlugs = new Set(cmsPosts.map((p) => p.slug))
  const pool: { slug: string; title: string; excerpt: string }[] = [
    ...cmsPosts.map((p: Post) => ({ slug: p.slug ?? '', title: p.title, excerpt: p.excerpt ?? '' })),
    ...SEED_POSTS.filter((s) => !cmsSlugs.has(s.slug)).map((s) => ({
      slug: s.slug,
      title: s.title,
      excerpt: s.excerpt,
    })),
  ].filter((p) => p.slug && p.slug !== currentSlug)

  const next = pool.slice(0, 3)
  if (!next.length) return null

  return (
    <section className="u-container my-24">
      <Reveal>
        <div className="mb-10 flex items-end justify-between gap-6">
          <h2 className="display display-section">Read next.</h2>
          <Link
            href="/insights"
            className="label-mono hidden shrink-0 hover:text-[color:var(--text)] sm:block"
          >
            [ ALL INSIGHTS → ]
          </Link>
        </div>
      </Reveal>
      <div className="grid gap-4 md:grid-cols-3">
        {next.map((p, i) => (
          <Reveal key={p.slug} delay={(i % 3) * 0.05}>
            <Link
              href={`/insights/${p.slug}`}
              className="group flex h-full flex-col overflow-hidden rounded-card border border-[color:var(--hairline)] bg-[color:var(--surface)] transition-transform hover:-translate-y-1.5"
            >
              <Placeholder
                label="INSIGHT"
                ratio="16 / 9"
                className="border-b border-[color:var(--hairline)]"
              />
              <div className="flex flex-1 flex-col p-6">
                <h3 className="display text-lg">{p.title}</h3>
                <p className="label-mono mt-auto pt-5 opacity-0 transition-opacity group-hover:opacity-100">
                  [ READ → ]
                </p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d
    .toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    .toUpperCase()
}
