import Link from 'next/link'
import type { Page } from '@/payload-types'
import { lexicalToPlainText } from '@/lib/lexical'
import { mediaAlt, mediaUrl } from '@/lib/site'
import { Reveal } from './Reveal'
import { RichText } from './RichText'

/**
 * Renders the CMS `pages` block stack (spec §4.1 / §5) into on-brand sections.
 *
 * Design law: DESIGN.md. Two standing rules enforced here regardless of editor input:
 *  · logoMarquee keeps the certification-ecosystem framing even when empty — never "RUN is certified".
 *  · CTA language stays RFQ/quote; button labels come from the editor but the visual is the quote rail.
 */

type LayoutBlock = NonNullable<Page['layout']>[number]
type BlockOf<T extends LayoutBlock['blockType']> = Extract<LayoutBlock, { blockType: T }>

function CTALink({
  href,
  label,
  variant = 'primary',
}: {
  href: string
  label: string
  variant?: 'primary' | 'ghost'
}) {
  const cls = `btn ${variant === 'primary' ? 'btn-primary' : 'btn-ghost'}`
  if (/^https?:\/\//i.test(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {label}
      </a>
    )
  }
  return (
    <Link href={href} className={cls}>
      {label}
    </Link>
  )
}

function HeroBlock({ block }: { block: BlockOf<'hero'> }) {
  const img = mediaUrl(block.backgroundImage)
  return (
    <section className="relative isolate overflow-hidden border-b border-[color:var(--hairline)]">
      {img ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={img}
            alt={mediaAlt(block.backgroundImage)}
            className="absolute inset-0 -z-20 h-full w-full object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-[color:var(--bg)]/70" aria-hidden="true" />
        </>
      ) : (
        <div className="blueprint-grid absolute inset-0 -z-10" aria-hidden="true" />
      )}
      <div className="u-container py-24 md:py-32">
        <Reveal>
          <h1 className="display display-hero max-w-4xl">{block.heading}</h1>
        </Reveal>
        {block.subheading ? (
          <Reveal delay={0.08}>
            <p className="mt-6 max-w-xl text-lg text-[color:var(--muted)]">{block.subheading}</p>
          </Reveal>
        ) : null}
        {block.buttonLabel && block.buttonHref ? (
          <Reveal delay={0.16}>
            <div className="mt-8">
              <CTALink href={block.buttonHref} label={block.buttonLabel} />
            </div>
          </Reveal>
        ) : null}
      </div>
    </section>
  )
}

function RichTextBlock({ block }: { block: BlockOf<'richText'> }) {
  return (
    <section className="u-container my-14">
      <div className="mx-auto max-w-3xl">
        <RichText data={block.content} />
      </div>
    </section>
  )
}

function MediaBlock({ block }: { block: BlockOf<'mediaBlock'> }) {
  const url = mediaUrl(block.image)
  if (!url) return null
  const width = block.width ?? 'normal'
  const widthClass = width === 'full' ? 'max-w-none' : width === 'wide' ? 'max-w-5xl' : 'max-w-3xl'
  return (
    <section className={width === 'full' ? 'my-14' : 'u-container my-14'}>
      <figure className={`mx-auto ${widthClass}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={url}
          alt={mediaAlt(block.image)}
          loading="lazy"
          decoding="async"
          className="w-full rounded-card"
        />
        {block.caption ? <figcaption className="label-mono mt-3">{block.caption}</figcaption> : null}
      </figure>
    </section>
  )
}

function StatsBlock({ block }: { block: BlockOf<'stats'> }) {
  const stats = block.stats ?? []
  if (!stats.length) return null
  return (
    <section className="u-container my-16">
      {block.heading ? (
        <Reveal>
          <h2 className="display display-section mb-10">{block.heading}</h2>
        </Reveal>
      ) : null}
      <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal key={s.id ?? i} delay={i * 0.05}>
            <div className="border-t border-[color:var(--hairline)] pt-4">
              <p className="display text-4xl text-[color:var(--text)] md:text-5xl">{s.value}</p>
              <p className="mt-2 text-sm text-[color:var(--muted)]">{s.label}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function TimelineBlock({ block }: { block: BlockOf<'timeline'> }) {
  const entries = block.entries ?? []
  if (!entries.length) return null
  return (
    <section className="u-container my-20">
      {block.heading ? <h2 className="display display-section mb-12">{block.heading}</h2> : null}
      <ol className="relative border-l border-[color:var(--hairline)]">
        {entries.map((e, i) => (
          <li key={e.id ?? i} className="mb-12 ml-6">
            <span
              className="absolute -left-[7px] mt-2 h-3 w-3 rounded-full bg-[color:var(--volt)]"
              aria-hidden="true"
            />
            <Reveal>
              <p className="label-mono">{e.year}</p>
              <h3 className="display mt-1 text-2xl">{e.title}</h3>
              {e.description ? (
                <p className="mt-2 max-w-2xl text-[color:var(--muted)]">{e.description}</p>
              ) : null}
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  )
}

function LogoMarqueeBlock({ block }: { block: BlockOf<'logoMarquee'> }) {
  const logos = block.logos ?? []
  return (
    <section className="u-container my-16 text-center">
      {block.heading ? <p className="label-mono mb-6">{block.heading}</p> : null}
      {logos.length ? (
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
          {logos.map((l, i) => {
            const u = mediaUrl(l.logo)
            return (
              <figure key={l.id ?? i} className="flex flex-col items-center gap-2">
                {u ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={u} alt={l.caption} className="h-10 w-auto opacity-80" loading="lazy" />
                ) : null}
                <figcaption className="label-mono max-w-[18ch]">{l.caption}</figcaption>
              </figure>
            )
          })}
        </div>
      ) : (
        <p className="mx-auto max-w-2xl text-[color:var(--muted)]">
          Certifications are held within RUN&apos;s compliance ecosystem — by parent company Durus
          Industries and our certified fabric and trim suppliers.
        </p>
      )}
    </section>
  )
}

function CTAByPersonaBlock({ block }: { block: BlockOf<'ctaByPersona'> }) {
  const variants = block.variants ?? []
  if (!variants.length) return null
  return (
    <section className="u-container my-20">
      {block.heading ? (
        <Reveal>
          <h2 className="display display-section mb-10">{block.heading}</h2>
        </Reveal>
      ) : null}
      <div className="grid gap-5 md:grid-cols-3">
        {variants.map((v, i) => (
          <Reveal key={v.id ?? i} delay={i * 0.06}>
            <div className="flex h-full flex-col rounded-card border border-[color:var(--hairline)] bg-[color:var(--surface)] p-7">
              <p className="label-mono">N°{String(i + 1).padStart(2, '0')}</p>
              <h3 className="display mt-3 text-2xl">{v.persona}</h3>
              {v.body ? <p className="mt-3 flex-1 text-[color:var(--muted)]">{v.body}</p> : null}
              {v.buttonLabel && v.buttonHref ? (
                <div className="mt-6">
                  <CTALink href={v.buttonHref} label={v.buttonLabel} variant="ghost" />
                </div>
              ) : null}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function FAQBlock({ block }: { block: BlockOf<'faq'> }) {
  const items = (block.items ?? []).filter((i) => i.question)
  if (!items.length) return null
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((i) => ({
      '@type': 'Question',
      name: i.question,
      acceptedAnswer: { '@type': 'Answer', text: lexicalToPlainText(i.answer) || i.question },
    })),
  }
  return (
    <section className="u-container my-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {block.heading ? <h2 className="display display-section mb-8">{block.heading}</h2> : null}
      <div className="mx-auto max-w-3xl divide-y divide-[color:var(--hairline)] border-y border-[color:var(--hairline)]">
        {items.map((it, i) => (
          <details key={it.id ?? i} className="group py-4">
            <summary className="flex list-none cursor-pointer items-center justify-between gap-4 font-medium">
              <span>{it.question}</span>
              <span className="label-mono transition-transform group-open:rotate-45">[ + ]</span>
            </summary>
            <div className="pt-3">
              <RichText data={it.answer} />
            </div>
          </details>
        ))}
      </div>
    </section>
  )
}

export function RenderBlocks({ blocks }: { blocks: Page['layout'] }) {
  if (!blocks?.length) return null
  return (
    <>
      {blocks.map((block, i) => {
        const key = block.id ?? `${block.blockType}-${i}`
        switch (block.blockType) {
          case 'hero':
            return <HeroBlock key={key} block={block} />
          case 'richText':
            return <RichTextBlock key={key} block={block} />
          case 'mediaBlock':
            return <MediaBlock key={key} block={block} />
          case 'stats':
            return <StatsBlock key={key} block={block} />
          case 'timeline':
            return <TimelineBlock key={key} block={block} />
          case 'logoMarquee':
            return <LogoMarqueeBlock key={key} block={block} />
          case 'ctaByPersona':
            return <CTAByPersonaBlock key={key} block={block} />
          case 'faq':
            return <FAQBlock key={key} block={block} />
          default:
            return null
        }
      })}
    </>
  )
}
