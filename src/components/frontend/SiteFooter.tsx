import Link from 'next/link'
import type { Footer, SiteSetting } from '@/payload-types'

/**
 * Footer "command center" (DESIGN.md §5): blueprint grid, link columns, HQ coordinates + network,
 * a giant low-opacity logotype, and a mono copyright bar. The certification marquee is deliberately
 * omitted until logo permissions are confirmed (open item B4) — no cert logo or "RUN is certified"
 * claim appears anywhere. Columns/legal line come from the `footer` global with a safe fallback.
 */

const FALLBACK_COLUMNS: NonNullable<Footer['columns']> = [
  {
    heading: 'Explore',
    links: [
      { label: 'Catalog', href: '/catalog' },
      { label: 'Capabilities', href: '/capabilities' },
      { label: 'Sustainability', href: '/sustainability' },
      { label: 'Heritage', href: '/about' },
      { label: 'Insights', href: '/insights' },
    ],
  },
  {
    heading: 'Work with us',
    links: [
      { label: 'Request a quote', href: '/rfq' },
      { label: 'Contact', href: '/contact' },
      { label: 'Case studies', href: '/case-studies' },
    ],
  },
]

export function SiteFooter({
  footer,
  settings,
}: {
  footer: Footer | null
  settings: SiteSetting | null
}) {
  const columns = footer?.columns?.length ? footer.columns : FALLBACK_COLUMNS
  const year = new Date().getFullYear()
  const legalLine =
    footer?.legalLine ??
    `© ${year} RUN APPAREL (PVT) LTD — a B2B division of Durus Industries. Made to order in Sialkot, Pakistan.`

  const address = settings?.address ?? '13 Km Daska Road, Sialkot, 51040, Pakistan'
  const emails = settings?.emails
  const partner = emails?.partner ?? 'partner@wear-run.help'
  const info = emails?.info ?? 'info@wear-run.help'

  return (
    <footer className="relative isolate mt-24 overflow-hidden border-t border-[color:var(--hairline)] bg-[color:var(--surface)]">
      <div className="blueprint-grid absolute inset-0 -z-10 opacity-70" aria-hidden="true" />

      {/* RFQ band */}
      <div className="u-container flex flex-col gap-6 border-b border-[color:var(--hairline)] py-12 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="label-mono mb-3">[ START YOUR RFQ ]</p>
          <p className="display display-section max-w-2xl">
            Tell us what you&apos;re making. <span className="serif-accent">We&apos;ll build it.</span>
          </p>
        </div>
        <Link href="/rfq" className="btn btn-primary self-start md:self-auto">
          Request a quote →
        </Link>
      </div>

      {/* Columns + coordinates */}
      <div className="u-container grid grid-cols-2 gap-x-8 gap-y-10 py-14 md:grid-cols-4">
        {columns.map((col, i) => (
          <nav key={col.id ?? i} aria-label={col.heading}>
            <p className="label-mono mb-4">
              N°{String(i + 1).padStart(2, '0')} — {col.heading}
            </p>
            <ul className="flex flex-col gap-2.5">
              {(col.links ?? []).map((link, j) => (
                <li key={link.id ?? j}>
                  <Link
                    href={link.href}
                    className="text-[15px] text-[color:var(--muted)] hover:text-[color:var(--text)] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div>
          <p className="label-mono mb-4">[ HQ COORDINATES ]</p>
          <address className="text-[15px] not-italic leading-relaxed text-[color:var(--muted)]">
            {address}
          </address>
        </div>

        <div>
          <p className="label-mono mb-4">[ NETWORK ]</p>
          <ul className="flex flex-col gap-2.5 text-[15px]">
            <li>
              <a
                href={`mailto:${partner}`}
                className="text-[color:var(--muted)] hover:text-[color:var(--text)] transition-colors"
              >
                {partner}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${info}`}
                className="text-[color:var(--muted)] hover:text-[color:var(--text)] transition-colors"
              >
                {info}
              </a>
            </li>
            {(settings?.socialLinks ?? []).map((s, i) => (
              <li key={s.id ?? i}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[color:var(--muted)] hover:text-[color:var(--text)] transition-colors"
                >
                  {s.platform}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Giant logotype */}
      <div className="u-container pointer-events-none select-none pb-6" aria-hidden="true">
        <p className="display text-[color:var(--text)] opacity-[0.06] leading-[0.8] text-[clamp(4rem,20vw,16rem)]">
          RUN APPAREL
        </p>
      </div>

      {/* Copyright */}
      <div className="border-t border-[color:var(--hairline)]">
        <div className="u-container flex flex-col gap-2 py-6 md:flex-row md:items-center md:justify-between">
          <p className="label-mono normal-case tracking-normal text-[color:var(--muted)]">{legalLine}</p>
          <p className="label-mono">The Extra Mile · For a Better Tomorrow · Never Look Back</p>
        </div>
      </div>
    </footer>
  )
}
