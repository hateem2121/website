# RUN APPAREL — RFQ System Master Plan (July 2026, Updated)

**Version:** 2.0 — Reconstructed edition · **Date:** July 12, 2026 · **Owner:** M. Hateem Jamshaid Iqbal ("Hateem")
**Role in the three-document system:** Document 3 — authoritative for field-level RFQ detail (steps, conditional logic, fabric/fibre lists, size lists, copy fragments), **as amended by spec §8**.

---

## 0. Status, lineage & how to read this document

**This is a reconstruction.** The original July-2026 RFQ Plan file is no longer available. This edition was rebuilt on July 12, 2026 from every reference the Build Master Prompt (v1.1) makes to the Plan, and it becomes authoritative **only upon Hateem's approval**. It carries the original filename so that the Build Master Prompt, `CLAUDE.md`, and the Project Instructions — all of which cite `RUN_APPAREL_RFQ_SYSTEM_MASTER_PLAN_JULY_2026_UPDATED.md` — remain valid without amendment.

**Two kinds of content live here, clearly separated:**
1. **Constitution-dictated** — rules the Build Master Prompt already fixes. These are restated here only where field-level detail requires it, and the Build Master Prompt is always the authority if wording ever differs.
2. **Regenerated ⚑** — content only the lost original held (fabric/fibre lists, size lists, branding options, all copy fragments). These are fresh drafts pending Hateem's line-by-line review. Every regenerated block is marked **⚑** and indexed in §16 for approval.

**Conventions:** references written as **spec §X** point into `RUN_APPAREL_Website_Build_Master_Prompt.md` (v1.1). This edition is **pre-reconciled with spec §8** — retired wording (e.g., "48 business hours") does not appear anywhere; spec §8 still wins if any conflict is ever found.

---

## 1. Purpose & principles

The RFQ (Request For Quote) engine is the site's primary conversion path: a guided, multi-step form that lets a B2B buyer describe one or many apparel styles in enough detail for RUN to return a meaningful quote — without ever feeling like an interrogation.

Principles:
- **Progressive, never punishing.** Identity is required; product detail is optional beyond one anchor per style (spec §8.2). A buyer with only a rough idea can still submit.
- **Guided by data, not free text alone.** Category → fabric family → fibre cascades keep answers structured for the ops team while staying skippable.
- **Two entry points, one engine** (spec §8.1): guests at `/rfq` with no account; portal buyers with identity prefilled and saved products arriving as ready style cards.
- **100% B2B, made-to-order framing** (spec §0.6). No prices shown, no checkout language.
- **Every client rule mirrored server-side** (spec §8.8) — the form is a convenience layer, never the security layer.

---

## 2. Flow overview

Four steps, with a persistent progress indicator:

**Step 1 · Details → Step 2 · Request → Step 3 · Review → Step 4 · Privacy & Submit**

- State is preserved when moving back and forth; per-step validation runs on "Next."
- **Portal path:** Step 1 is auto-filled and locked from the account; saved-list items arrive as pre-filled style cards; logged-in draft saving at v1 (spec §8.1). Guest magic-link drafts are deferred (spec §18).
- On submit: record created (spec §4.1 `rfqs`), reference number issued (format `RFQ-2026-000123`), confirmation email + internal notification sent (§14 below, spec §8.9), buyer lands on the thank-you page.

---

## 3. Step 1 — Details (identity)

Required: **name · company · country · email.** Optional: **phone.** (spec §8.2)

- **Country** is a searchable dropdown of ISO countries. Countries on the `exclusionList` global (spec Appendix B) remain visible but selecting one shows the polite message (copy C1, §9) and blocks progression; the same check re-runs server-side on submit.
- Country selection also drives the **currency auto-preselect** in Step 2 (§4.6) and the **EU double-opt-in flag** in Step 4 (§7).
- Portal path: all four identity fields prefilled and locked; phone editable.

---

## 4. Step 2 — Request (the style cards)

Step 2 opens with **request type**: `Bulk order quote` | `Sample request` (spec §4.1 `requestType`). Sample mode simplifies the form (§5).

Below it, one or more **style cards** — "Add another style" appends a card; cards are collapsible, each summarized by its anchor (product / category / first words of description). No hard limit on cards.

### 4.1 Style card anchor rule
Each card must contain **at least one of: productRef · category · description** (spec §8.2). Anything beyond the anchor is optional.
- **productRef** — set automatically when the buyer arrived via a product page's "Request a Quote" or a saved-list conversion; also selectable via product search. Selecting a product auto-sets its category.
- **category** — one of the five site-wide categories (spec §4.1 `categories`): Team Wear · Active Wear · Casual Wear · Outer Wear · Sports Accessories.
- **description** — free text, e.g. "quarter-zip training top with contrast panels."

### 4.2 Fabric → fibre cascade (conditional logic)
- Choosing a **category** filters the **fabric family** dropdown to that category's families (§8 library; powered by the `fabricLibrary` collection, spec §4.1).
- Choosing a **fabric family** filters the **fibre** multi-select to that family's allowed fibres.
- Buyers may skip fabric entirely, choose only a family, or specify fibres with **blend percentages**. **Rule: when more than one fibre is entered, percentages must total exactly 100%** (spec §4.1); a live running total shows remaining %. One fibre with no percentage = 100% implied.
- Every cascade level includes "Not sure — advise me" as a valid choice.

### 4.3 Colours
- **Unlimited colour rows** per style. Each row: colour name (free text) and/or hex/Pantone reference (optional), plus an **optional per-colour quantity**.
- **Rule:** colour quantities are validated **only when entered** — if any colour quantities are given alongside a style quantity, their sum must equal the style quantity (spec §4.1). No quantities = no validation.

### 4.4 Sizes ⚑
Per-style size breakdown, all optional:
- **Adult:** XS · S · M · L · XL · 2XL · 3XL · 4XL · 5XL
- **Youth** (spec §4.1 requires Youth support): 4–5Y · 6–7Y · 8–9Y · 10–11Y · 12–13Y · 14–15Y
- **One-Size** — automatically offered when category = Sports Accessories (spec §4.1).
Buyers may enter per-size quantities or leave sizes as a simple multi-select ("we'll size-curve with you").

### 4.5 Quantity & the MOQ soft warning
- **quantity** (per style, bulk mode): number input. When the value falls below the applicable threshold — per-product override if set, else the global `moqWarningDefault` (spec §8.3, seed 250, configurable in `siteSettings`) — show the **soft, non-blocking** warning (copy C2, §9). Submission is never blocked by quantity.
- No MOQ or price figure is displayed anywhere publicly until `showTeasers` is flipped (spec §8.3).

### 4.6 Target price & currency
- **targetPrice** (optional, per unit) + **currency**: auto-preselected from the Step-1 country via a static ISO-4217 map (e.g., US→USD, GB→GBP, EU members→EUR, CA→CAD, AE→AED, SA→SAR, BR→BRL, AU→AUD; default USD), always changeable by the buyer (spec §4.1). The map is a static lookup — no external API.

### 4.7 Certifications requested
- Multi-select of the certifications in RUN's compliance ecosystem (per the Company Master Prompt list: GOTS, OEKO-TEX Standard 100, OEKO-TEX Made in Green, GRS, RCS, Organic 100, ISO 9001, SMETA/Sedex, BSCI), each selectable per style.
- The **trust note** (copy C3, §9) renders with this field — ecosystem framing is binding (spec §21.7): certifications sit with Durus Industries and certified suppliers, never with RUN itself; additional certifications pursued on customer request.

### 4.8 Branding & customization options ⚑
Multi-select per style: All-over sublimation print · Screen print · Embroidery · Heat transfer / vinyl · Woven label · Printed (tagless) neck label · Hang tags · Custom packaging / poly bags · Plain (no branding) · Other (free text).
(Sublimation printing and precision embroidery are confirmed in-house capabilities per the Company Master Prompt; the remainder of this list is regenerated and needs confirmation against actual offerings.)

### 4.9 File uploads (tech packs, artwork, references)
Exactly per spec §8.7 and Appendix C: allowlist PDF, AI, EPS, PSD, SVG, PNG, JPG, WEBP, ZIP · 25 MB/file · 100 MB per RFQ · max 10 files · direct-to-R2 presigned upload to `run-private` · server-side MIME sniffing · unscanned-quarantine SOP. Upload UI: drag-and-drop + file picker, per-file progress, per-file remove, clear error messages for type/size rejections.

---

## 5. Sample route simplification

When request type = **Sample request**, the style cards simplify:
- Quantity becomes a small **sample quantity** field (1–10 per style); the MOQ warning never fires.
- Per-size quantity grids collapse to a simple size multi-select; per-colour quantities are hidden (colour rows remain).
- Target price is hidden.
- The **sample-charge note** (copy C4, §9) renders once above the cards — case-by-case wording; no fee amounts are stated anywhere (amounts are spec §19 open item 2).
- Everything else — anchor rule, cascades, certifications, branding, uploads — behaves identically.

---

## 6. Step 3 — Review

A read-only summary grouped as: **Contact · Request type · Style 1…n (anchor, fabric, colours, sizes, quantity, target price, certifications, branding) · Files.** Each group carries an "Edit" link that returns to the relevant step/card with focus placed correctly. Nothing is editable inline here — one place to edit, one place to review.

---

## 7. Step 4 — Privacy & Submit

- **Processing consent** (copy C5) — required checkbox, unticked by default; stored with timestamp + policy version (spec §8.6).
- **Marketing opt-in** (copy C6) — optional checkbox, **unticked**; for EU/EEA countries (static list) the record is flagged for **double opt-in** handling (spec §8.6). Consent source stored.
- Links to the Privacy Policy and Terms (`/legal/*`).
- **Submit**: button disables on click with a processing state; double-submit guarded client- and server-side. Success → thank-you page (§14). Failure → inline error with the data intact, never a dead end.

---

## 8. Fabric & fibre library ⚑ (seeds the `fabricLibrary` collection, spec §4.1 / Appendix A)

Organized under the five authoritative categories (spec §21.6). Team Wear includes Neoprene + swim/beach fabrics (Wetsuit Edition); Outer Wear includes Leather (spec Appendix A). Every family: `blendable` flag + allowed fibres. **Entire section regenerated — review each line.**

**Team Wear**
- **TW-1 · Sublimation polyester knits** (interlock, jersey) — fibres: polyester, recycled polyester; blendable with elastane. *Default for printed team kits.*
- **TW-2 · Polyester-elastane stretch knits** — polyester, recycled polyester, elastane; blendable.
- **TW-3 · Mesh / birdseye moisture-wicking knits** — polyester, recycled polyester; blendable: no.
- **TW-4 · Piqué / dimple performance knits** — polyester, recycled polyester; blendable with elastane.
- **TW-5 · Neoprene (Wetsuit Edition)** — neoprene (limestone-based option), with nylon or polyester jersey lamination; blendable: no. *Thickness options noted at quote stage (e.g., 2/3/5 mm).*
- **TW-6 · Swimwear tricot / lycra (Wetsuit Edition)** — nylon (polyamide), recycled nylon, polyester, elastane; blendable. *Chlorine-resistant option.*

**Active Wear**
- **AW-1 · Nylon-elastane compression knits** — nylon, recycled nylon, elastane; blendable.
- **AW-2 · Polyester-elastane performance knits** — polyester, recycled polyester, elastane; blendable.
- **AW-3 · Cotton-modal soft-touch knits** — cotton, organic cotton, modal, elastane; blendable.
- **AW-4 · Seamless knits** — nylon, polyester, elastane; blendable.
- **AW-5 · Rib knits (bands & trims)** — cotton, organic cotton, polyester, elastane; blendable.

**Casual Wear**
- **CW-1 · Single jersey** (tees) — cotton, organic cotton, recycled cotton, polyester, viscose; blendable.
- **CW-2 · Piqué** (polos) — cotton, organic cotton, polyester; blendable.
- **CW-3 · French terry** — cotton, organic cotton, polyester, recycled polyester; blendable.
- **CW-4 · Brushed fleece** (hoodies, sweats) — cotton, organic cotton, polyester, recycled polyester; blendable.
- **CW-5 · Interlock** — cotton, organic cotton, polyester; blendable.

**Outer Wear**
- **OW-1 · Woven shells** (windbreakers, ski) — polyester, recycled polyester, nylon, recycled nylon; blendable: no. *DWR / membrane options at quote stage.*
- **OW-2 · Softshell (bonded)** — polyester + elastane face, fleece backer; blendable.
- **OW-3 · Sherpa / pile fleece** — polyester, recycled polyester; blendable: no. *(Spelling per spec §21.4.)*
- **OW-4 · Puffer shells & insulation** — nylon or polyester shell; fill: down or recycled-polyester wadding; blendable: no.
- **OW-5 · Leather** — genuine leather (cow, sheep), PU alternative; blendable: no.

**Sports Accessories**
- **SA-1 · Synthetic leather / Amara** (gloves) — PU, microfiber; blendable: no.
- **SA-2 · Neoprene** (belts, supports) — neoprene; blendable: no.
- **SA-3 · Webbing & straps** — polyester, nylon; blendable: no.
- **SA-4 · Knit terry** (wristbands) — cotton, elastane; blendable.
- **SA-5 · Twill / canvas** (caps) — cotton, organic cotton, polyester; blendable.

---

## 9. Copy fragments ⚑ (verbatim blocks — all regenerated, review each)

- **C1 · Exclusion message** (spec Appendix B; editable in the `exclusionList` global): *"Thank you for your interest in RUN APPAREL. We're currently unable to take on new partnerships in {country}, so this form can't be submitted for that market. We appreciate your understanding."*
- **C2 · MOQ soft warning** (spec §8.3): *"Orders below {X} pcs per style may not be feasible — submit anyway and we'll advise the best route."*
- **C3 · Certifications trust note** (spec §21.7): *"These certifications are held within RUN's compliance ecosystem — by our parent company Durus Industries and by our certified fabric and trim suppliers — not by RUN APPAREL as its own entity. If your program requires a certification not listed here, tell us: we pursue additional certifications our customers require."*
- **C4 · Sample-charge note** (spec §8.5): *"Samples may be chargeable depending on complexity — quoted case-by-case and typically credited against your first bulk order. We'll confirm cost and turnaround in our response."*
- **C5 · Processing consent label:** *"I agree that RUN APPAREL may process the information in this form to prepare and respond to my request, as described in the Privacy Policy."*
- **C6 · Marketing opt-in label:** *"Keep me informed about RUN APPAREL capabilities, materials, and industry insights (optional — unsubscribe anytime)."*
- **C7 · Response promise** (spec §21.5 wording, everywhere it appears): *"We'll respond within 2 business days."*
- **C8 · Style-anchor validation error:** *"Tell us at least one thing about this style — pick a product, choose a category, or describe it in a sentence."*
- **C9 · Blend validation error:** *"Fibre percentages need to total 100% — you're at {n}%."*

---

## 10. Validation (client + server, mirrored)

Every rule below runs in the browser for instant feedback **and** is re-validated server-side with zod (spec §8.8); the server is authoritative.

1. Identity: name, company, country, email present; email format valid; phone optional.
2. Country not on the `exclusionList` (re-checked server-side against the live global — guards dropdown tampering, spec Appendix B).
3. Request type present (`bulk` | `sample`).
4. ≥1 style card; each card satisfies the anchor rule (§4.1 → error C8).
5. Fibre blends total 100% when >1 fibre entered (→ error C9).
6. Colour quantity sums equal style quantity **only when** both are entered.
7. Sample mode: sample quantity 1–10 per style.
8. Files: allowlist extension + server-side MIME sniff match, per-file ≤25 MB, total ≤100 MB, ≤10 files (spec Appendix C).
9. Processing consent ticked; timestamp + policy version recorded.
10. Honeypot empty; minimum-fill-time satisfied (§11).
11. All free-text inputs length-capped and sanitized; nothing from this form is ever rendered as HTML.

---

## 11. Anti-abuse (spec §8.8 governs)

- **Honeypot field** — visually hidden and hidden from assistive tech (`aria-hidden`, `tabindex="-1"`); any value = silent rejection.
- **Minimum-fill-time** — submissions completed faster than a configurable floor (default **5 seconds** ⚑) are rejected as bot traffic.
- Cloudflare rate-limit rules on `/api/rfq*` (spec §3.8).
- **No CAPTCHA at launch**; Turnstile is the documented escalation — ask Hateem before enabling (spec §8.8).

---

## 12. Accessibility

- Semantic form markup: every input labelled; grouped controls in `fieldset`/`legend`; steps as labelled regions.
- On step change: focus moves to the new step's heading; progress indicator updates via `aria-current`.
- Errors: inline messages tied to fields with `aria-describedby`, plus an error summary announced via `aria-live`; submit failures never clear entered data.
- Full keyboard operability — including add/remove for style cards and colour rows, and file upload.
- Visible focus states; WCAG AA contrast (inherits Phase-1 design tokens, spec §6); touch targets ≥44 px.
- Subtle/professional motion only (spec §6 animation matrix); honors `prefers-reduced-motion`.

---

## 13. Attribution & analytics (spec §8.9 / §13 govern)

- Capture `utm_source / utm_medium / utm_campaign / utm_term / utm_content`, landing page, and referrer — stored on the RFQ record **only under Analytics consent** (spec §13).
- GA4 events (consent-gated): `rfq_start`, `rfq_step` (with step number), `rfq_submit`.
- Cloudflare Web Analytics runs always (cookieless). No email open/click tracking at launch (spec §8.9).

---

## 14. Post-submit: thank-you page & emails

**Thank-you page** (noindexed, spec §12):
- Reference number displayed prominently + response promise (C7).
- "What happens next" — the three-step engagement flow from the Company Master Prompt: we review your request → you receive a custom proposal (3D designs, fabric & apparel samples, transparent pricing) → production on approval.
- **Anonymized case-study teasers** (from `caseStudies`, spec §4.1 — hidden if none published).
- **Guest path only:** "Create an account to track this RFQ" prompt (spec §8.1) — on later approval, the reference number links to the new buyer account.
- Back-to-catalog CTA.

**Buyer confirmation email** — from `no-reply@wear-run.com`, Reply-To `partner@wear-run.help` (spec §11): subject *"We've received your request — {referenceNumber}"* ⚑; body: thanks + reference number + response promise (C7) + compact summary (request type, style count, style anchors) + company footer with site URL.

**Internal notification** — to `partner@wear-run.help` (spec §11): reference number, contact block, request type, per-style summary, file count, consent flags, attribution (if consented), direct admin link.

---

## 15. Internal record & ops handoff

The stored record shape, statuses, and admin-only ops fields are defined **once**, in spec §4.1 (`rfqs` collection) — this Plan deliberately does not duplicate them (anti-drift). Buyer-visible status subset per spec §10: Received → In review → Quoted → Closed.

---

## 16. Regenerated-content register — Hateem's approval checklist

Everything below is a fresh draft (the "verbatim" originals are gone) and needs review before this edition becomes authoritative. Approve or correct by ID, in shorthand:

1. **§8 fabric & fibre library** — all families TW-1…SA-5, their fibres, and blendable flags.
2. **§4.4 size lists** — adult range, youth bands, One-Size rule.
3. **§4.8 branding options list** (sublimation + embroidery confirmed; the rest pending).
4. **§9 copy fragments C1–C9** plus the email subject line in §14.
5. **§11 minimum-fill-time default** (5 seconds).
6. **§4.6 currency-map examples** (principle is spec-fixed; the example pairs are illustrative).

Everything not listed above is constitution-dictated and was traced to its spec § during reconstruction.

**Standing caution:** if the original July-2026 Plan file ever resurfaces, stop and reconcile it against this edition with Hateem before either is used — two authorities is how drift returns.

---

*End of RFQ System Master Plan v2.0 (reconstructed) · approved by Hateem on [date] · amendments only with Hateem's approval, versioned and dated.*
