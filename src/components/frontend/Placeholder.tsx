/**
 * On-brand image placeholder. DESIGN.md §3/§6 make the wireframe/blueprint drawing the site's
 * placeholder/empty-state language, so an image slot that has no photo yet shows this rather than a
 * broken box. It's self-hosted inline SVG (no external image, no next/image), adapts to light/dark
 * via the semantic tokens, and is clearly labelled so it never reads as final art. Real photography
 * (a Hateem input, spec §20) swaps in later.
 *
 * Border/rounding are left to the caller (via className) so it can sit flush inside a card or framed
 * on its own — avoids fighting Tailwind radius/border utilities.
 */
export function Placeholder({
  label,
  ratio = '4 / 3',
  className = '',
}: {
  label?: string
  ratio?: string
  className?: string
}) {
  return (
    <div
      className={`relative isolate overflow-hidden bg-[color:var(--wash)] ${className}`.trim()}
      style={{ aspectRatio: ratio }}
      aria-hidden="true"
    >
      <div className="blueprint-grid absolute inset-0 opacity-70" />
      <svg
        className="absolute left-1/2 top-1/2 h-[42%] w-auto -translate-x-1/2 -translate-y-1/2 opacity-40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--text)"
        strokeWidth="1"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        <path d="M8 4 L5 6 L2 9 L4 12 L6 10 L6 21 L18 21 L18 10 L20 12 L22 9 L19 6 L16 4 C 14 6, 10 6, 8 4 Z" />
      </svg>
      {label ? (
        <span className="label-mono absolute bottom-3 left-3 rounded bg-[color:var(--bg)]/70 px-2 py-1">
          [ {label} ]
        </span>
      ) : null}
    </div>
  )
}
