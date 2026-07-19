import Link from 'next/link'

import type { Product } from '@/payload-types'
import { mediaAlt, mediaUrl } from '@/lib/site'
import { Placeholder } from './Placeholder'

/**
 * Catalog article card (category landers + related-articles rails). Poster-first: the first
 * colourway's poster image when one exists, else the on-brand wireframe placeholder. Plain <img>
 * by project decision (no next/image until the Phase-4 image strategy is settled — see BUILD_LOG).
 */
export function ProductCard({
  product,
  categorySlug,
}: {
  product: Product
  categorySlug: string
}) {
  const colorways = product.colorways ?? []
  const poster = colorways[0]?.posterImage
  const posterSrc = mediaUrl(poster)

  return (
    <Link
      href={`/catalog/${categorySlug}/${product.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-card border border-[color:var(--hairline)] bg-[color:var(--surface)] transition-transform hover:-translate-y-1.5"
    >
      {posterSrc ? (
        <div
          className="relative overflow-hidden border-b border-[color:var(--hairline)] bg-[color:var(--wash)]"
          style={{ aspectRatio: '4 / 3' }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={posterSrc}
            alt={mediaAlt(poster) || product.title}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      ) : (
        <Placeholder
          label={product.title}
          ratio="4 / 3"
          className="border-b border-[color:var(--hairline)]"
        />
      )}
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-6 flex items-center justify-between">
          <span className="label-mono">[ MADE TO ORDER ]</span>
          <span className="label-mono opacity-0 transition-opacity group-hover:opacity-100">→</span>
        </div>
        <div className="mt-auto">
          <h3 className="display text-xl">{product.title}</h3>
          {product.shortDescription ? (
            <p className="mt-2 text-sm text-[color:var(--muted)]">{product.shortDescription}</p>
          ) : null}
          {colorways.length ? (
            <div className="mt-4 flex items-center gap-1.5" aria-hidden="true">
              {colorways.slice(0, 6).map((c) => (
                <span
                  key={c.id ?? c.name}
                  className="h-3 w-3 rounded-full border border-[color:var(--hairline)]"
                  style={{ backgroundColor: c.swatchHex }}
                  title={c.name}
                />
              ))}
              {colorways.length > 6 ? (
                <span className="label-mono">+{colorways.length - 6}</span>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </Link>
  )
}
