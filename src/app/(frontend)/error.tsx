'use client'

import Link from 'next/link'
import { useEffect } from 'react'

/**
 * On-brand 500 for the public site (spec §5 system pages: custom 404/500 routing back to
 * catalog/contact). Renders inside the frontend layout, so the header/footer and design system
 * are present. Errors thrown by the layout itself would fall through to Next's builtin
 * global handler — acceptable residual: the layout's data reads all swallow failures by design
 * (see lib/payload.ts), so a layout-level crash has no known trigger.
 */
export default function FrontendError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Server-side details are already in the Workers logs; this creates the client-side trace.
    console.error(error)
  }, [error])

  return (
    <section className="relative isolate overflow-hidden">
      <div className="blueprint-grid absolute inset-0 -z-10" aria-hidden="true" />
      <div className="u-container flex min-h-[70vh] flex-col justify-center py-24">
        <p className="label-mono mb-4">[ ERROR · 500 ]</p>
        <h1 className="display display-hero">A dropped stitch.</h1>
        <p className="mt-6 max-w-md text-lg text-[color:var(--muted)]">
          Something went wrong on our side. Try again — or the catalog and the quote desk are one
          click away.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button type="button" onClick={reset} className="btn btn-primary">
            Try again
          </button>
          <Link href="/catalog" className="btn btn-ghost">
            Browse the catalog
          </Link>
          <Link href="/contact" className="btn btn-ghost">
            Contact us
          </Link>
        </div>
      </div>
    </section>
  )
}
