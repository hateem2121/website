'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { ThemeToggle } from './ThemeToggle'

export type NavItem = { label: string; href: string; children?: { label: string; href: string }[] }

/**
 * Primary site header — sticky, single small blurred bar (the one blur DESIGN.md §4 allows), with a
 * crawlable <nav> of real links (spec §12: clean crawlable nav). Language stays RFQ/quote, never
 * "buy". Links come from the `navigation` global with a sensible fallback so the header always
 * renders even before the menu is seeded.
 */
export function SiteHeader({ items, rfqHref = '/rfq' }: { items: NavItem[]; rfqHref?: string }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-40 border-b border-[color:var(--hairline)] bg-[color:var(--bg)]/85 backdrop-blur-md">
      <div className="u-container flex h-16 items-center justify-between gap-4">
        <Link href="/" className="group flex items-baseline gap-2" aria-label="RUN APPAREL — home">
          <span className="display text-2xl leading-none">RUN</span>
          <span className="label-mono hidden sm:inline">[ APPAREL ]</span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
          {items.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className="label-mono hover:text-[color:var(--text)] transition-colors data-[active=true]:text-[color:var(--text)]"
                data-active={active}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-2.5">
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>
          <Link href={rfqHref} className="btn btn-primary hidden sm:inline-flex">
            Request a quote
          </Link>
          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="label-mono rounded-full border border-[color:var(--hairline)] px-3 py-1.5 lg:hidden"
          >
            [ {open ? 'CLOSE' : 'MENU'} ]
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-[color:var(--hairline)] bg-[color:var(--bg)] lg:hidden">
          <nav aria-label="Mobile" className="u-container flex flex-col gap-1 py-4">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="display-section py-2 text-[length:1.6rem]"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-3 flex items-center justify-between gap-3">
              <ThemeToggle />
              <Link href={rfqHref} onClick={() => setOpen(false)} className="btn btn-primary">
                Request a quote
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
