'use client'

import { useSyncExternalStore } from 'react'

/**
 * Light/dark toggle. Mirrors the locked preview's "LIGHTS ON / LIGHTS OFF" label (DESIGN.md §5).
 * Reads the live theme with useSyncExternalStore (the idiomatic way to read browser/DOM state) so
 * every toggle instance stays in sync and there is no setState-in-effect. Writing flips `data-theme`
 * (which the token stylesheet keys off), persists to `run-theme` (read back by ThemeScript on the
 * next load), and dispatches `themechange` so the store re-reads.
 */

type Theme = 'light' | 'dark'

function subscribe(callback: () => void) {
  const mq = window.matchMedia('(prefers-color-scheme: dark)')
  mq.addEventListener('change', callback)
  window.addEventListener('themechange', callback)
  return () => {
    mq.removeEventListener('change', callback)
    window.removeEventListener('themechange', callback)
  }
}

function getSnapshot(): Theme {
  const explicit = document.documentElement.getAttribute('data-theme')
  if (explicit === 'light' || explicit === 'dark') return explicit
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, () => 'light' as Theme)

  function toggle() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.setAttribute('data-theme', next)
    try {
      localStorage.setItem('run-theme', next)
    } catch {
      /* private mode — ignore */
    }
    window.dispatchEvent(new Event('themechange'))
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Switch between light and dark mode"
      className="label-mono inline-flex items-center gap-1 rounded-full border border-[color:var(--hairline)] px-3 py-1.5 transition-colors hover:border-[color:var(--text)] hover:text-[color:var(--text)]"
    >
      <span suppressHydrationWarning>[ {theme === 'dark' ? 'LIGHTS ON' : 'LIGHTS OFF'} ]</span>
    </button>
  )
}
