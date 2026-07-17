import type { SiteSetting } from '@/payload-types'

/**
 * Floating WhatsApp button (spec §1, §21.2). Deliberately dormant: it renders nothing until BOTH
 * `whatsappEnabled` is on AND the number is no longer the dummy placeholder (`+00-...`). The real
 * number +92-336-1777313 is intentionally NOT hard-coded here — it lives in Site settings and is
 * switched on by Hateem when ready (open item X3).
 */
export function WhatsAppButton({ settings }: { settings: SiteSetting | null }) {
  const enabled = settings?.whatsappEnabled === true
  const number = settings?.whatsappNumber ?? ''
  const digits = number.replace(/[^\d]/g, '')
  const isPlaceholder = !digits || /^0+$/.test(digits)
  if (!enabled || isPlaceholder) return null

  return (
    <a
      href={`https://wa.me/${digits}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[color:var(--volt)] text-[#1d1f1a] shadow-lg transition-transform hover:-translate-y-0.5"
    >
      <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden="true">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm5.8 14.13c-.24.68-1.42 1.32-1.95 1.37-.5.05-.5.42-3.15-.66-2.66-1.09-4.3-3.8-4.43-3.98-.13-.18-1.05-1.4-1.05-2.67 0-1.27.67-1.9.9-2.16.24-.26.52-.32.7-.32.17 0 .35 0 .5.01.16.01.38-.06.59.45.24.58.82 2 .89 2.14.07.14.12.31.02.5-.09.18-.14.3-.28.46-.14.16-.29.36-.42.48-.14.13-.28.28-.12.55.16.27.72 1.18 1.55 1.91 1.06.95 1.96 1.24 2.24 1.38.28.14.44.12.6-.07.16-.18.69-.8.87-1.08.18-.27.36-.23.6-.14.24.09 1.55.73 1.82.86.27.14.44.2.5.32.07.11.07.64-.17 1.32Z" />
      </svg>
    </a>
  )
}
