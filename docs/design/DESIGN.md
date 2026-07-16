# DESIGN.md — RUN APPAREL Design System · "PAPER & INK" (Olive Ink)

**Locked by Hateem 2026-07-16** (Phase 1 gate, spec §17 row 1: direction picked, tokens locked — recorded in DECISIONS.md). This file is the design source of truth for Phases 2–8. Changes to locked tokens are an *ask*, never a silent edit. Living preview: [`directions/direction-d-paper-ink.html`](directions/direction-d-paper-ink.html).

**The idea in one line:** one identity in two lighting conditions — **light = "The Workshop"** (warm paper, ink type, volt stamps), **dark = "The Night Shift"** (olive ink, grain, volt glowing) — with technical-drawing garnish (blueprint grid, contour lines, wireframe tech-packs, `N°001` numbering, `[ BRACKETED ]` mono labels) running through both. Derived from Hateem's four references: landonorris.com, wembi.ai, hildenkaira.fi, sharebien.com.

---

## 1. Color tokens

Both modes are first-class designs — never generate one by inverting the other. All pairs below are WCAG-AA verified (18/18) via [`contrast-check.py`](contrast-check.py) + [`contrast-pairs.json`](contrast-pairs.json); re-run after ANY token change: `python3 docs/design/contrast-check.py docs/design/contrast-pairs.json`.

### Constant — the signal

| Token | Hex | OKLCH | Rules |
|---|---|---|---|
| `--volt` | `#CDF345` | `oklch(.92 .20 118)` | THE brand accent ("RUN volt" — ours, not McLaren's). **Never body text on light** (1.16:1 — banned). Light mode: solid blocks/pills/buttons/underlines with ink text on top. Dark mode: display type, mono labels, glow, button fill. |
| `--volt-deep` | `#5F7414` | `oklch(.52 .13 122)` | Volt's dark cousin for **text/lines on light surfaces** (4.57:1 on paper ✓). Serif accent words, small labels, hover states, dimension lines in light mode. |

### Light — "The Workshop" (default)

| Token | Hex | OKLCH | Use |
|---|---|---|---|
| `--bg` (paper) | `#F1EFEA` | `oklch(.951 .007 90)` | page background |
| `--surface` (card) | `#FAF9F6` | `oklch(.978 .004 90)` | cards, hero panel |
| `--wash` | `#E4E1D8` | `oklch(.906 .012 92)` | image placeholders, subtle fills |
| `--raised` | `#FFFFFF` | — | modals/overlays |
| `--text` (ink) | `#1D1F1A` | `oklch(.235 .011 130)` | all reading text (14.5:1 on paper) |
| `--muted` | `#63665B` | `oklch(.50 .02 120)` | secondary text (5.1:1 ✓) |

### Dark — "The Night Shift" (4-level elevation: higher = lighter, never pure black)

| Token | Hex | OKLCH | Use |
|---|---|---|---|
| `--bg` (base) | `#1C1F18` | `oklch(.235 .014 128)` | page background |
| `--surface` | `#23271F` | `oklch(.272 .016 128)` | cards, panels |
| `--wash` (raised) | `#2C3126` | `oklch(.31 .017 128)` | nested cards, hovers |
| `--raised` (overlay) | `#363C2F` | `oklch(.35 .019 128)` | modals, dropdowns |
| `--text` | `#ECEBE4` | `oklch(.937 .006 95)` | off-white — never `#FFF` (halation) |
| `--muted` | `#A2A695` | `oklch(.70 .02 115)` | secondary text (6.7:1 ✓) |

**Mode-flip components:** tags (`[ LABEL ]`): light = volt block + ink text · dark = transparent + volt text. Primary button: light = ink fill + volt text · dark = volt fill + ink text. Display headlines: light = ink · dark = volt. Serif accents: light = volt-deep · dark = volt.

**Implementation:** semantic CSS custom properties swapped per mode (Tailwind v4 `@custom-variant dark` / `light-dark()`); default follows `prefers-color-scheme`, manual toggle overrides via `data-theme` on `<html>`; persist choice in `localStorage`. No scattered `dark:` utilities — components read semantic tokens only.

## 2. Typography (≤2 downloaded families — spec §16)

| Role | Family | Usage |
|---|---|---|
| Display | **Archivo** (variable; self-host + subset at build) | 800–900 weight, width ~122%, UPPERCASE, letter-spacing −0.02…−0.04em, line-height .86–.95. Hero: `clamp(44px, 7.2vw, 110px)`. Section: `clamp(30px, 4.6vw, 54px)`. |
| Body | **Archivo** 400/500 | 17px / 1.55. Sentence case. Max ~60ch. |
| Serif accents | **Instrument Serif** italic | *Only* accent words inside display headlines (1–2 per headline, lowercase, 1.06–1.08em of surrounding size, in volt-deep/volt). Never body copy. |
| Labels | **system monospace** (`ui-monospace` stack — zero download) | `[ BRACKETED ]`, `N°001`, coords, specs, form labels, buttons. 9–12px, UPPERCASE, tracking .08–.14em. |

**Open item:** Neue Stance (Hateem holds the font files but, as of 2026-07-16, is unsure whether he holds a commercial web licence) may replace Archivo *display* duties **only after** the licence is confirmed — body stays Archivo, family budget stays 2. Per spec §12 (future-proof test: genuinely free long-term, not a trial) and CLAUDE.md §11 (no spend without approval), the default until then is **Archivo everywhere**, no exceptions. To resolve: check the Pangram Pangram account used to get the files, or search email/payment records for a receipt; if none exists, a web licence starts at ~$40 and is Hateem's purchase decision to make (CLAUDE.md §6 — anything that could cost money is always an ask).

## 3. Motifs & texture

- **Blueprint grid:** 1px lines of `--grid` (5% ink/text) at 22–30px spacing — hero panels, footer, image placeholders.
- **Contour lines:** thin topographic curves at whisper opacity on hero/feature panels; same motif both modes.
- **Wireframe tech-pack drawings** (RUN's signature): garment outlines with dashed seam lines, volt dimension lines + arrows (`CHEST 56 CM`), bracketed callouts. Used: hero garnish, product-card placeholder/empty/loading states, category headers. Style: 1.4px solid outline (`--text`), 1px dashed seams (`--muted`), dimensions in volt-deep (light) / volt (dark).
- **Grain:** dark mode only — SVG turbulence overlay, opacity .05, `position:fixed`.
- **Glow:** dark mode — max ONE radial volt glow (~10% alpha) per screen.
- **Numbering:** sections carry `N°00X — TITLE — N°00X` mono headers (Wembi pattern).
- **Radii:** cards/panels 16–20px · pills/buttons 6–10px · nav pills 999px.
- **Mode-crossing bands:** a light page may carry one full-bleed ink band (and dark one paper band) for drama — never more than one per page.

## 4. Motion — "Balanced" (locked 2026-07-15)

Character: *precise, unhurried, alive.* Easing `cubic-bezier(.22, 1, .36, 1)`. Fast micro (150–250ms) / soft settles (400–600ms).

| Where | What |
|---|---|
| Bold (home hero, heritage, category landings) | kinetic headline lines rise on load (static-first, .9s stagger .12s); cursor parallax (desktop); opposing marquees; pinned process/stat sections (GSAP ScrollTrigger — free since 2025); counting stats on scroll-in |
| Subtle (forms, portal, admin, legal, blog) | focus-color labels, gentle lifts, fill-on-hover buttons, magnetic CTA (desktop, ±18/28% pull) |
| Minimal (catalog grids, spec tables) | content first; hover lift + volt dimension-line reveal only |
| Signature garnish | roving volt pill highlight on category lists; scroll-spy dot in floating pill-nav; giant parallax footer logotype (±20% Y); tilted-photo reveals |

**Hard rules:** everything inside `@media (prefers-reduced-motion: no-preference)` (JS effects check the media query too) · pointer-driven effects off on touch (`pointer: coarse`) · no animation blocks interaction or LCP · **dropped by decision:** whole-page skew, heavy backdrop-blur surfaces (single small blurred sticky header allowed).

## 5. Component notes (from the locked preview)

- **Buttons:** mono uppercase 11px, 14×22px padding, radius 10px. Primary/ghost per §1 flip table. Hover: ghost inverts (text↔bg); primary lifts −2px.
- **Product card (B2B):** wash image area (wireframe placeholder) + `[ CATEGORY — N°0XX ]` + name (Archivo 800, 21px) + bracketed spec list (`[ FABRIC ]`, `[ MOQ ]`, `[ CUSTOM ]`) + "REQUEST QUOTE / RFQ →" rail. Hover: −6px lift, soft shadow, volt dimension line appears, arrow on RFQ. **Language is always RFQ/quote — never "order/buy/checkout."**
- **Footer "command center":** blueprint grid; `[ START YOUR RFQ ]` + numbered 01/02/03 fields (line-only inputs, mono, labels flip volt-deep/volt on focus) + `[ HQ COORDINATES ]` / `[ NETWORK ]` columns; certification marquee (names/logos grayscale→volt on hover; **copy must never claim RUN itself holds a certification** — final list pending Hateem); mono copyright bar; giant parallax logotype at 8–10% opacity (volt in dark).
- **Nav (to build in Phase 3):** floating bottom pill (Wembi) with volt scroll-spy dot + "Contact"-style volt pill for RFQ.

## 6. Imagery

Photography: light mode = natural warm; dark mode = olive duotone (`grayscale(65%) sepia(30%) hue-rotate(50deg) saturate(70%) brightness(.9)` as starting filter). Tilted-photo moments (H&K) for factory/people shots. Wireframe drawings are the placeholder/empty-state language everywhere. WebP/AVIF, responsive sizes per spec §16.

## 7. Provenance & verification

- References studied first-hand 2026-07-16 (browser pane): landonorris.com, wembi.ai, hildenkaira.fi, sharebien.com. Analysis + approved plan: `~/.claude/plans/i-like-the-direction-async-diffie.md` (machine-local); durable summary in BUILD_LOG 2026-07-16.
- Palette variant "A · Olive Ink" chosen from three rendered boards; motion "Balanced"; 3D globe for About map (reuses spec §7 engine).
- Spec §6 note: the original "no corporate blues/greens" palette prohibition was **removed by Hateem's explicit request** (DECISIONS.md 2026-07-16) rather than scoped to an exception — a standing change for all future palette decisions, not limited to volt. Volt remains used as a signal inside a paper/ink editorial system, never the whole identity, by design choice rather than spec constraint.
- Contrast: 18/18 AA both modes (script + pairs committed beside this file).
