import localFont from 'next/font/local'

/**
 * Self-hosted fonts (DESIGN.md §2, spec §16: ≤2 downloaded families, self-hosted, swap).
 *
 * The woff2 files are vendored under ./fonts (copied from the OFL @fontsource builds) so the
 * runtime has no third-party font CDN and the repo stays portable (Prime Directive 8). English
 * launch uses the latin subset only.
 *
 * Neue Stance stays deferred until its commercial web licence is confirmed (DESIGN.md §2) — Archivo
 * carries both display and body duties until then.
 */

// Archivo — variable weight axis. Display (800–900, uppercase) and body (400/500) both read from it.
export const archivo = localFont({
  src: './fonts/archivo-variable-latin.woff2',
  variable: '--font-archivo',
  display: 'swap',
  weight: '100 900',
  style: 'normal',
  preload: true,
})

// Instrument Serif — italic accent words only, inside display headlines (never body copy).
export const instrumentSerif = localFont({
  src: './fonts/instrument-serif-italic-latin.woff2',
  variable: '--font-instrument-serif',
  display: 'swap',
  weight: '400',
  style: 'italic',
  preload: false,
})
