import { notFound } from 'next/navigation'

/**
 * Catch-all that turns any unmatched URL into the site's own 404 (spec §5: "custom 404/500,
 * on-brand, routing back to catalog/contact").
 *
 * Why this file has to exist: `(frontend)/not-found.tsx` only covers paths that resolve
 * INSIDE the (frontend) route group — which is why `/catalog/bad-slug` correctly rendered
 * the branded page (its own `page.tsx` calls `notFound()`) while a plain wrong URL like
 * `/xyz` fell through to Next's built-in grey "404: This page could not be found." with no
 * layout, no navigation and no branding.
 *
 * The usual fix — a root `app/not-found.tsx` — needs a root `app/layout.tsx`, and this app
 * deliberately has none: `(frontend)` and `(payload)` each render their own `<html>`, and a
 * shared root layout would nest two of them. A catch-all inside the frontend group routes
 * unmatched URLs into that group instead, so the real layout and the branded not-found both
 * apply, and the response is a genuine 404 rather than a 200 with sad content.
 *
 * Route priority means this never shadows anything real: literal segments (`/about`,
 * `/admin/…`, `/api/…`) and more specific dynamic segments (`/catalog/[category]`) all beat
 * a root catch-all. Verified against /admin, /api, /sitemap.xml, /robots.txt and /icon.svg.
 */
export default function CatchAllNotFound(): never {
  notFound()
}
