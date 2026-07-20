'use client'

import { useState } from 'react'
import { Placeholder } from './Placeholder'

export type ColorwayView = {
  name: string
  swatchHex: string
  posterUrl: string | null
  posterAlt: string
}

/**
 * Poster-first colourway switcher (spec §5 article page). Until the Phase-4 3D pipeline lands,
 * clicking a swatch swaps the colourway's poster image (or the wireframe placeholder when no
 * photo exists yet); the "3D COMING SOON" chip marks where the §7 viewer mounts later. The swatch
 * row is a real button group with pressed state — the same interaction the 3D switcher will keep.
 */
export function ColorwayPicker({
  colorways,
  productTitle,
}: {
  colorways: ColorwayView[]
  productTitle: string
}) {
  const [active, setActive] = useState(0)
  const current = colorways[active]

  return (
    <div>
      <div className="relative overflow-hidden rounded-card border border-[color:var(--hairline)]">
        {current?.posterUrl ? (
          <div className="relative bg-[color:var(--wash)]" style={{ aspectRatio: '4 / 5' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={current.posterUrl}
              alt={current.posterAlt || `${productTitle} — ${current.name}`}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        ) : (
          <Placeholder
            label={current ? `${productTitle} · ${current.name}` : productTitle}
            ratio="4 / 5"
          />
        )}
        <span className="label-mono absolute right-3 top-3 rounded bg-[color:var(--bg)]/80 px-2 py-1">
          [ 3D COMING SOON ]
        </span>
      </div>

      {colorways.length ? (
        <div className="mt-4">
          <p className="label-mono mb-2.5">
            [ COLOURWAY — <span className="text-[color:var(--text)]">{current?.name}</span> ]
          </p>
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Colourways">
            {colorways.map((c, i) => (
              <button
                key={`${c.name}-${i}`}
                type="button"
                onClick={() => setActive(i)}
                aria-pressed={i === active}
                aria-label={`Colourway: ${c.name}`}
                title={c.name}
                className="h-7 w-7 rounded-full border border-[color:var(--hairline)] transition-transform hover:scale-110 aria-pressed:ring-2 aria-pressed:ring-[color:var(--text)] aria-pressed:ring-offset-2 aria-pressed:ring-offset-[color:var(--bg)]"
                style={{ backgroundColor: c.swatchHex }}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}
