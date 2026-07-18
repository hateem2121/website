import Link from 'next/link'

/**
 * On-brand interim page for routes whose full build comes in a later page-by-page turn. Keeps the
 * site shell navigable (no 404s) during Home review, and clearly signals "in progress".
 */
export function RoutePlaceholder({
  label,
  title,
  blurb,
}: {
  label: string
  title: string
  blurb?: string
}) {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="blueprint-grid absolute inset-0 -z-10" aria-hidden="true" />
      <div className="u-container flex min-h-[62vh] flex-col justify-center py-24">
        <p className="label-mono mb-4">[ {label} ]</p>
        <h1 className="display display-hero max-w-4xl">{title}</h1>
        {blurb ? <p className="mt-6 max-w-xl text-lg text-[color:var(--muted)]">{blurb}</p> : null}
        <p className="label-mono mt-10 text-[color:var(--muted)]">
          This page is being built — one at a time, for sign-off.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/rfq" className="btn btn-primary">
            Request a quote →
          </Link>
          <Link href="/" className="btn btn-ghost">
            ← Back to home
          </Link>
        </div>
      </div>
    </section>
  )
}
