import Link from 'next/link'
import type { SiteSetting } from '@/payload-types'

/** Thin announcement strip. Renders only when enabled in Site settings (off by default). */
export function AnnouncementBar({ settings }: { settings: SiteSetting | null }) {
  const a = settings?.announcement
  if (!a?.enabled || !a.text) return null

  const content = <span className="label-mono normal-case tracking-wide">{a.text}</span>

  return (
    <div className="bg-[color:var(--text)] text-[color:var(--bg)]">
      <div className="u-container flex items-center justify-center py-2 text-center">
        {a.href ? (
          <Link href={a.href} className="underline-offset-4 hover:underline">
            {content}
          </Link>
        ) : (
          content
        )}
      </div>
    </div>
  )
}
