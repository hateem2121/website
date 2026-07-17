import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="blueprint-grid absolute inset-0 -z-10" aria-hidden="true" />
      <div className="u-container flex min-h-[70vh] flex-col justify-center py-24">
        <p className="label-mono mb-4">[ ERROR · 404 ]</p>
        <h1 className="display display-hero">Off the map.</h1>
        <p className="mt-6 max-w-md text-lg text-[color:var(--muted)]">
          That page doesn&apos;t exist — but the catalog and the quote desk are one click away.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/catalog" className="btn btn-primary">
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
