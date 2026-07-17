import type { Metadata } from 'next'
import Link from 'next/link'
import { buildMetadata } from '@/lib/seo'
import { Reveal } from '@/components/frontend/Reveal'

// Indexable landing (spec §12: the /rfq landing itself is crawlable). The guided quote engine ships
// in Phase 5 — this page describes the process and routes people to contact in the meantime.
export const metadata: Metadata = buildMetadata({
  title: 'Request a Quote',
  description:
    'Start a custom apparel quote with RUN APPAREL. Tell us your styles, quantities and specs — no commitment, a reply within 2 business days.',
  path: '/rfq',
})

const STEPS = [
  {
    n: '01',
    title: 'Inquiry',
    body: 'A no-commitment conversation about your requirements, volumes and vision.',
  },
  {
    n: '02',
    title: 'Custom proposal',
    body: '3D designs, fabric and apparel samples, and transparent pricing built to your spec.',
  },
  {
    n: '03',
    title: 'Production',
    body: 'On-time delivery through five-plus QC checkpoints — without compromising quality.',
  },
]

export default function RfqPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-[color:var(--hairline)]">
        <div className="blueprint-grid absolute inset-0 -z-10" aria-hidden="true" />
        <div className="u-container py-24 md:py-28">
          <p className="label-mono mb-6">[ REQUEST A QUOTE ]</p>
          <h1 className="display display-hero max-w-4xl">
            Tell us what you&apos;re making. <span className="serif-accent">We&apos;ll build it.</span>
          </h1>
          <p className="mt-7 max-w-2xl text-lg text-[color:var(--muted)]">
            Our guided quote builder is on its way. In the meantime, start the conversation directly —
            we reply within 2 business days.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/contact" className="btn btn-primary">
              Start the conversation →
            </Link>
            <Link href="/catalog" className="btn btn-ghost">
              Browse the catalog
            </Link>
          </div>
        </div>
      </section>

      <section className="u-container my-24">
        <p className="label-mono mb-10">HOW IT WORKS</p>
        <div className="grid gap-5 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.06}>
              <div className="flex h-full flex-col rounded-card border border-[color:var(--hairline)] bg-[color:var(--surface)] p-7">
                <p className="label-mono">N°{s.n}</p>
                <h2 className="display mt-3 text-2xl">{s.title}</h2>
                <p className="mt-3 text-[color:var(--muted)]">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  )
}
