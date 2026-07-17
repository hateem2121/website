import type { Metadata } from 'next'
import Link from 'next/link'
import { getGlobalSafe } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'
import type { SiteSetting } from '@/payload-types'

// Styled placeholder for Phase 3 (Hateem's choice): looks finished and routes people to email. The
// working form + exclusion gating + notification emails ship with the email system in Phase 5.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = buildMetadata({
  title: 'Contact',
  description:
    'Get in touch with RUN APPAREL — a 100% B2B custom apparel manufacturer in Sialkot, Pakistan. We reply within 2 business days.',
  path: '/contact',
})

export default async function ContactPage() {
  const settings = await getGlobalSafe<SiteSetting>('site-settings', 1)
  const partner = settings?.emails?.partner ?? 'partner@wear-run.help'
  const info = settings?.emails?.info ?? 'info@wear-run.help'
  const address = settings?.address ?? '13 Km Daska Road, Sialkot, 51040, Pakistan'
  const promise = settings?.responsePromise ?? 'within 2 business days'

  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-[color:var(--hairline)]">
        <div className="blueprint-grid absolute inset-0 -z-10" aria-hidden="true" />
        <div className="u-container py-24 md:py-28">
          <p className="label-mono mb-6">[ CONTACT ]</p>
          <h1 className="display display-hero max-w-4xl">Let&apos;s talk production.</h1>
          <p className="mt-7 max-w-2xl text-lg text-[color:var(--muted)]">
            A short inquiry form is coming with our new email system. For now, reach us directly — we
            reply {promise}.
          </p>
        </div>
      </section>

      <section className="u-container my-20 grid gap-x-10 gap-y-12 md:grid-cols-3">
        <div>
          <p className="label-mono mb-4">[ PARTNERSHIPS ]</p>
          <a href={`mailto:${partner}`} className="text-lg hover:text-[color:var(--volt-deep)]">
            {partner}
          </a>
          <p className="mt-2 text-sm text-[color:var(--muted)]">New programs, quotes and samples.</p>
        </div>
        <div>
          <p className="label-mono mb-4">[ GENERAL ]</p>
          <a href={`mailto:${info}`} className="text-lg hover:text-[color:var(--volt-deep)]">
            {info}
          </a>
          <p className="mt-2 text-sm text-[color:var(--muted)]">Anything else.</p>
        </div>
        <div>
          <p className="label-mono mb-4">[ HQ COORDINATES ]</p>
          <address className="not-italic leading-relaxed text-[color:var(--muted)]">{address}</address>
        </div>
      </section>

      <section className="u-container my-20">
        <div className="rounded-card border border-[color:var(--hairline)] bg-[color:var(--surface)] p-8">
          <p className="label-mono mb-3">[ 100% B2B ]</p>
          <p className="max-w-2xl text-[color:var(--muted)]">
            RUN APPAREL is a business-to-business manufacturer — everything is made to order for
            brands, teams and organisations. Ready to start a quote?
          </p>
          <div className="mt-6">
            <Link href="/rfq" className="btn btn-primary">
              Request a quote →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
