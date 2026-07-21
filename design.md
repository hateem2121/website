# RUN APPAREL — Brand & Design Guide ("Paper & Ink")

**A portable, plain-language design guide you can use anywhere** — a print shop, a
business-card designer, a slide deck, another design tool, or a new teammate. It needs no
code knowledge and no special software.

> **One source of truth.** The exact, code-level version of this system lives at
> `docs/design/DESIGN.md` (locked by Hateem on 2026-07-16). If this file and that one ever
> disagree, **that one wins** — tell Hateem so this export can be corrected. Every value
> below is copied from it; nothing here is newly invented. Colours are WCAG-AA verified
> (a readability standard for people with low vision — 18 of 18 text/background pairs pass).

---

## 0. The idea in one line

**One identity, two lighting conditions.**
- **Light mode = "The Workshop"** — warm paper, ink-black type, bright "volt" green stamps.
- **Dark mode = "The Night Shift"** — deep olive, off-white type, volt glowing.

Running through both: a **technical-drawing** feel — blueprint grids, garment wireframes,
`N°001` numbering, and `[ BRACKETED ]` labels. Editorial and engineered, never flashy.

---

## 1. Colours

"Hex" below is the universal colour code designers and printers understand (e.g. `#CDF345`).
Copy these exactly — do not eyeball or re-pick them.

### The signal colour (same in both modes)

| Name | Hex | What it's for |
|---|---|---|
| **Volt** | `#CDF345` | THE brand accent — a bright yellow-green. Buttons, pills, highlights, stamps. **Never use volt as small text on a light/paper background** — it's unreadable there. |
| **Volt Deep** | `#5F7414` | Volt's darker cousin, used *only* when volt-coloured **text or thin lines** must sit on a light background (this version is readable; plain volt is not). |

### Light mode — "The Workshop" (the default)

| Name | Hex | What it's for |
|---|---|---|
| Paper (background) | `#F1EFEA` | The page |
| Surface (card) | `#FAF9F6` | Cards, panels |
| Wash | `#E4E1D8` | Image placeholders, soft fills |
| Raised | `#FFFFFF` | Pop-ups, overlays |
| Ink (text) | `#1D1F1A` | All reading text |
| Muted | `#63665B` | Secondary / less-important text |

### Dark mode — "The Night Shift"

| Name | Hex | What it's for |
|---|---|---|
| Base (background) | `#1C1F18` | The page (never pure black) |
| Surface | `#23271F` | Cards, panels |
| Wash | `#2C3126` | Nested cards, hover states |
| Raised | `#363C2F` | Pop-ups, overlays |
| Text | `#ECEBE4` | Off-white reading text (never pure white — pure white glares) |
| Muted | `#A2A695` | Secondary text |

### How the accent flips between modes

Think of it as the *same rule seen under two lights*:

| Element | Light mode | Dark mode |
|---|---|---|
| Tag / label `[ LABEL ]` | Volt block, ink text on top | See-through, volt text |
| Main button | Ink fill, volt text | Volt fill, ink text |
| Big headline | Ink | Volt |
| Serif accent word | Volt Deep | Volt |

**Rule:** the two modes are *both* designed on purpose. Never make one by simply inverting
the other.

---

## 2. Typography (fonts)

Budget: **at most two downloaded font families** (keeps the site fast).

| Role | Font | How to use it |
|---|---|---|
| **Display** (big headlines) | **Archivo**, weight 800–900 | UPPERCASE, tight letter-spacing, tight lines. Bold and structural. |
| **Body** (reading text) | **Archivo**, weight 400–500 | Sentence case. ~17px. Lines no wider than ~60 characters. |
| **Serif accent** | **Instrument Serif**, *italic* | *Only* 1–2 accent words inside a big headline, lowercase, coloured Volt Deep (light) / Volt (dark). **Never** for body text. |
| **Labels / specs** | **System monospace** (the computer's built-in typewriter-style font — no download) | `[ BRACKETED ]` labels, `N°001` numbers, spec lists, buttons. Small, UPPERCASE, wide letter-spacing. |

> **Open item (font licence):** a font called *Neue Stance* may one day replace Archivo for
> *headlines only* — **but only after** Hateem confirms he owns a commercial web licence for
> it. Until confirmed, the answer is **Archivo everywhere**. Do not use Neue Stance on
> anything public without that sign-off. ("Web licence = paid permission to use a font on a
> website; a web licence can cost money, so it's Hateem's decision.")

---

## 3. Spacing, corners & shapes

- **Rounded corners:** cards/panels ~18px · buttons/pills ~8px · nav pills fully round.
- **Blueprint grid:** faint 1px lines about 22–30px apart — used on hero panels, footers,
  and image placeholders. (Think engineering graph paper, barely visible.)
- **Garment wireframes:** RUN's signature — line drawings of clothing with dashed seams and
  volt "dimension lines" (like `CHEST 56 CM`). These are the standard look for empty spaces,
  loading states, and product placeholders.
- **One dramatic band per page, max:** a light page may carry a single full-width ink band
  (or a dark page a single paper band) for contrast — never more than one.

---

## 4. Movement (for anything animated)

Character: **precise, unhurried, alive.** Quick little reactions (buttons, hovers) plus
slow, soft settles for big moments. Nothing bounces or feels jumpy.

- Big pages (home, heritage): headlines rise on load, gentle parallax, counting stats.
- Quiet pages (forms, admin, legal): soft focus highlights, buttons fill on hover.
- **Always** respect a visitor's "reduce motion" setting — if they've asked their device for
  less animation, they get a calm, static version.

---

## 5. Voice & tone (how RUN writes)

RUN's wording changes by context but the substance stays the same.

| Context | How it sounds |
|---|---|
| Social & marketing | Bold, confident, punchy. Short declarative lines. Heritage-meets-innovation. |
| Sales & partner outreach | Confident but grounded. Warm, consultative — partnership first, not transactional. |
| Proposals & formal docs | Crisp and professional. Let facts and figures persuade. |
| Product & catalogue copy | Technical and precise. Spec-driven, with real sensory detail (fabric feel, fit). |

**Brand anchors (recurring phrases):** *"The Extra Mile," "For a Better Tomorrow," "Never
Look Back."*

**Tagline:** The Extra Mile | For a Better Tomorrow | Never Look Back
**Positioning:** Sustainable · High-Performance · Ethically Manufactured Sports Apparel

**Always avoid:**
- **Retail/consumer language.** RUN is **100% B2B** (business-to-business — it sells to
  companies, not the public). Never "buy," "order," "add to cart," "checkout." The action is
  always **"Request a Quote" / RFQ** ("RFQ = Request for Quotation, a buyer asking for
  pricing on a custom job").
- **Claiming RUN itself is certified.** RUN does **not** hold certifications in its own name —
  they sit with its parent company (Durus Industries) and its fabric/trim suppliers. Say RUN
  is *backed by* or *operates within* a certified supply chain — never that RUN *is*
  certified.
- Generic sustainability buzzwords with no fact behind them.

---

## 6. Who RUN is (quick facts for any document)

- **What:** B2B-only apparel manufacturing division of Durus Industries (Pvt) Ltd.
- **Heritage:** roots to 1889; RUN APPAREL established as a dedicated division in 2020.
- **HQ:** 13 Km Daska Road, Sialkot, 51040, Pakistan.
- **Five product categories** (all equally core — none is "secondary"):
  1. **Team Wear** — cycling, tennis, football, soccer, surf uniforms + a wetsuit/beachwear line
  2. **Active Wear** — sports bras, athletic tops & bottoms, full body suits
  3. **Casual Wear** — T-shirts, polos, sweatshirts, hoodies, tracksuits
  4. **Outer Wear** — windbreakers, sherpa jackets, puffer jackets, ski wear, leather jackets
  5. **Sports Accessories** — performance gloves, weight belts, wristbands, caps, branded gear

---

## 7. The quick "don't break these" list

1. Use the exact hex colours above — don't re-pick by eye.
2. Volt is a **signal**, never the whole design. It accents a paper-and-ink system.
3. Never volt text on paper (unreadable) — use **Volt Deep** for volt-coloured text on light.
4. Two font families max; **Archivo everywhere** until the Neue Stance licence is confirmed.
5. Light and dark are both real designs — never invert one to make the other.
6. B2B voice only: **"Request a Quote," never "buy/order."**
7. Never say RUN itself is certified.
8. Respect "reduce motion."
9. If in doubt, check `docs/design/DESIGN.md` — it's the authority, and changes to locked
   values are always Hateem's call.

---

*Portable export of the locked "Paper & Ink" system. Authority: `docs/design/DESIGN.md`.
Company facts: `RUN_APPAREL_Master_Prompt.md`. Keep this file in sync when either changes.*
