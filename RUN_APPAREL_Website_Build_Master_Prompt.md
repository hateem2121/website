# RUN APPAREL (PVT) LTD — Website Build Master Prompt

**Version:** 1.1 (post-delivery audit refinements) · **Date:** July 12, 2026 · **Owner:** M. Hateem Jamshaid Iqbal ("Hateem")
**Builder:** Claude Code Agent (sole technical collaborator) · **Maintainers:** Hateem + Claude Code, solo operation

---

## How to use this document

This is the authoritative build specification for the RUN APPAREL B2B website. It is one of a **three-document system** that must be provided to Claude Code together at the start of work:

1. **`RUN_APPAREL_Master_Prompt.md`** (the Company Master Prompt) — authoritative for company facts, heritage, categories, positioning, voice & tone, and compliance framing. Never contradict it except where §21 (Overrides) of this document explicitly amends it.
2. **This document** — authoritative for architecture, stack, features, schemas, phases, and build rules.
3. **`RUN_APPAREL_RFQ_SYSTEM_MASTER_PLAN_JULY_2026_UPDATED.md`** (the RFQ Plan) — authoritative for field-level RFQ form detail (conditional logic, fabric lists, size lists, copy fragments), **as amended by §8 of this document**. Where the RFQ Plan and §8 conflict, §8 wins.

All three documents were finalized through a multi-round requirements interview, two July-2026 deep-research verification passes, and a full audit. Decisions herein are settled; do not re-litigate them without Hateem's instruction.

---

## 0. Prime Directives (read first, apply always)

1. **Never assume. When uncertain, stop and ask Hateem.** This is the standing rule of the entire project. Ambiguity is resolved by a question, not a guess.
2. **Budget is $5/month total infrastructure** (Cloudflare Workers Paid). No new paid services, subscriptions, or usage tiers may be introduced without Hateem's explicit approval. Free tiers must be genuinely free long-term, not trials.
3. **Hateem is a capable non-developer.** Explain every architectural trade-off in plain language (e.g., "egress = the fee charged when someone downloads a file"). Surface conflicts proactively. Present options with a recommendation.
4. **Verify at build start, then pin.** Confirm the latest stable versions *within the major lines locked in §2*, pin them in `package.json` (no floating `latest`), and record them. Never adopt a new major version (Payload 4, R3F 10, Next 17, Tailwind 5) without asking Hateem first.
5. **Approval gates are mandatory.** Design directions, page copy, file-size limits, and each phase's acceptance checklist require Hateem's sign-off before proceeding (see §17).
6. **100% B2B.** No retail/consumer language, no checkout, no prices presented as buy-now. Everything is made-to-order.
7. **Ship static-first.** Every public page must be prerendered and served as a static asset. Dynamic Worker invocations are reserved for portal, RFQ, admin, and API routes. This is both a performance rule and the cost-control mechanism.
8. **Everything must remain portable.** Copy-paste component registries (code vendored into repo), MIT/free licenses only, nightly database exports, documented migration paths. No dead ends.

---

## 1. Project summary

A production-ready B2B website for **RUN APPAREL (PVT) LTD** (Sialkot, Pakistan — custom apparel manufacturer, division of Durus Industries, heritage to 1889) at **`wear-run.com`**, serving international buyers across RUN's four export regions — Europe, North America, South America, and the Middle East (per the Company Master Prompt).

**Core capabilities:**
- Public, SEO-optimized marketing site + catalog: every article shown with an interactive **3D viewer** (rotate + zoom + colorway switcher) built from CLO3D exports.
- **RFQ engine**: multi-style, guided, conditional-logic quote requests — available to guests and logged-in buyers.
- **Gated buyer portal**: self-signup with manual approval; gated PDF catalog + company profile, detailed pricing tiers, downloads, saved products with one-click convert-to-RFQ, and RFQ tracking.
- Full **CMS** (content, headings, images, products, 3D uploads, blog, global settings) manageable by 2–4 non-technical editors without code changes.
- Lead generation: public inquiry form, WhatsApp floating button, GA4 + Apollo company identification (consent-gated), notification emails.

**Language:** English only at launch; structure must be i18n-ready (clean route structure, no hardcoded strings in components, RTL-capable UI foundation) for later multilingual expansion including Arabic.

---

## 2. Locked architecture & stack (verified July 2026)

One vendor, one bill: **Cloudflare Workers Paid — $5/month flat.** Database and storage are included services. All research verification was performed against July-2026 sources.

| Layer | Locked choice | Notes |
|---|---|---|
| Hosting/compute | **Cloudflare Workers (Paid, $5/mo)** via `@opennextjs/cloudflare` + Wrangler | Commercial use permitted. Paid tier required (Payload bundle size > free limit; removes 10ms CPU cap). Static asset requests are free & unlimited; zero egress/bandwidth charges platform-wide. Included: 10M dynamic requests + 30M CPU-ms/mo; overage $0.30/M req. |
| Framework | **Next.js 16.2.x + React 19.2 + TypeScript** | Current stable line; Turbopack default. App Router. |
| CMS | **Payload 3.x (latest 3.x, self-hosted)** starting from the **official `with-cloudflare-d1` template** | MIT, open source (Figma-owned, actively maintained). Do NOT use v4 beta. Admin at `/admin`. Live Preview enabled for pages & products. |
| Database | **Cloudflare D1** via official `@payloadcms/db-d1-sqlite` adapter | Included in $5: 25B row-reads + 50M row-writes/mo, 5GB storage included (10GB max/DB). Time Travel 30-day restore. Read replicas: `readReplicas: 'first-primary'` once traffic warrants. Growth path if ever outgrown: Payload adapter swap to Postgres (Neon) — documented, not needed now. |
| Object storage | **Cloudflare R2** — two buckets (see §3) | Free tier: 10GB, 1M writes, 10M reads/mo; **zero egress forever**. Public bucket behind `assets.wear-run.com`. |
| Auth | **Payload built-in auth** — `admins` + `buyers` auth-enabled collections | No external auth vendor. Manual approval via status field. Email verification via Resend. |
| Styling | **Tailwind CSS v4.1.x** | CSS-first config, OKLCH colors. |
| UI components | **shadcn/ui** (foundation) → **UI-Layouts** + **React Bits** (creative/animated) → **Cursify** (cursor accents) | All copy-paste registries: code vendored into repo. UI-Layouts & Cursify are MIT (verified); **free components only — the paid "Blocks Pro" tier is excluded**. Cursor effects must auto-disable on touch devices and respect `prefers-reduced-motion`. UI-Layouts offers an MCP server for component discovery — Claude Code may use it. |
| Motion | **Motion** (MIT, ex-Framer Motion) for UI transitions; **GSAP** (100% free incl. all plugins since Apr 2025) for scroll-driven storytelling (ScrollTrigger, SplitText) | Division of labor: Motion = component/layout/enter-exit; GSAP = heritage/scroll narratives. |
| 3D | **React Three Fiber v9 (stable) + drei + three.js**, WebGL | Do NOT use R3F v10 alpha / WebGPU yet — documented upgrade path only. |
| 3D asset pipeline | **gltf-transform** CLI: meshopt geometry compression + KTX2 (ETC1S/UASTC) textures; Draco fallback | Target: 50MB+ CLO3D exports → 3–8MB delivery files. See §7. |
| Transactional email | **Resend free tier**, sending as `no-reply@wear-run.com` | Verify current free limits at build (secondary sources said ~3,000/mo, 100/day). Swap-in fallback if volume exceeds: Brevo free (300/day, carries branding). |
| Human email | **Hostinger** mailboxes on `wear-run.help` (existing plan) | `partner@` = real mailbox; `info@` and `privacy@` = aliases → `partner@`. |
| Analytics | **GA4** + **Cloudflare Web Analytics** (cookieless) + **Apollo Website Visitors** (company-level only) | GA4 + Apollo strictly consent-gated (§13). CF Web Analytics runs always (no cookies). |
| CI / backups | **GitHub** (repo exists) + **GitHub Actions** | Nightly D1 SQL export → private R2 bucket (30-day retention). Optional: GLB compression job. |

**Known platform constraints (design around, do not fight):**
- **No `sharp` on Workers** → Payload image resizing strategy: generate needed sizes at upload time client-side/pipeline, or use Cloudflare Image Transformations (verify its current free allowance at build; do not exceed free tier without asking).
- **GraphQL not fully guaranteed on Workers** → use Payload's Local API + REST exclusively.
- **Node middleware not supported by OpenNext on Workers** (as of research) → implement auth gating in server components / route handlers / `run_worker_first` patterns; re-verify OpenNext support matrix at build.
- **D1 adapter maturity:** a Dec-2025 bug (silent DELETE failures via stale binding, payload issue #15070) mandates the production smoke test in §15 before any real content entry. Pin the latest adapter version.
- Payload's default `pino-pretty` logger breaks on Workers → the official template's console logger is already configured; keep it.

---

## 3. Infrastructure setup specification

**Cloudflare account (Hateem's, card on file — required for Workers Paid + R2):**
1. Subscribe to **Workers Paid ($5/mo)**.
2. Deploy from the official Payload `with-cloudflare-d1` template (Deploy-to-Cloudflare or `create-payload-app` + template), connected to Hateem's GitHub repo.
3. **D1:** one database, e.g. `run-apparel-db`. Enable Time Travel awareness in runbook. Bind as `D1`.
4. **R2:** two buckets:
   - `run-assets` (PUBLIC): compressed GLBs, KTX2 texture sets, optimized images, poster frames. Custom domain **`assets.wear-run.com`** (never the rate-limited `r2.dev` domain). Long-cache headers (immutable, content-hashed filenames).
   - `run-private` (PRIVATE): RFQ file uploads, raw GLB masters, gated PDFs (catalog + company profile), nightly DB exports. **No public access ever.** Served only via short-lived presigned URLs to authorized users; `Content-Disposition: attachment` on RFQ uploads.
5. **Domains & DNS:**
   - `wear-run.com` → Cloudflare zone: site (apex + `www` redirect→apex), `assets.` subdomain → R2 public bucket.
   - `wear-run.help` → DNS records for Hostinger mail (MX, SPF, DKIM per Hostinger docs) wherever its DNS lives; Hateem has full access to both registrars.
6. **Email DNS:**
   - `wear-run.com`: Resend domain verification — SPF + DKIM records; **DMARC** starting `p=none` → ramp to `quarantine` → `reject` after 2–4 clean weeks. Sender: `no-reply@wear-run.com`.
   - `wear-run.help`: Hostinger SPF/DKIM; DMARC same ramp. Mailboxes: create `partner@` (real), `info@` + `privacy@` as aliases → `partner@`.
7. **Secrets:** all via `wrangler secret` / Cloudflare dashboard (Resend API key, Payload secret, presign credentials). **Never in the repo.**
8. **WAF & protection (free tier):** enable Bot Fight Mode; rate-limiting rules on `/api/rfq*`, `/api/inquiry*`, `/api/auth*` (e.g., 5 req/min/IP on submits — tune at build); optional but recommended: **Cloudflare Access** (free ≤50 users) in front of `/admin`.
9. **Billing safety:** configure Cloudflare usage/billing **notifications** (there is no universal hard cap — alerts + WAF + static-first architecture are the controls). Document thresholds in the runbook.
10. **GitHub Actions:**
    - `backup.yml` — nightly `wrangler d1 export` → upload SQL dump to `run-private/backups/` with 30-day retention.
    - Deploys run through Cloudflare's Git integration (Workers Builds) or Actions — pick one, document it.

---

## 4. Payload CMS specification

Start from the official template's `Users` + `Media` and extend. Enable **Live Preview** for `pages` and `products`. All labels/descriptions written for non-technical editors. Access control: role-based; buyers can never reach `/admin`.

### 4.1 Collections

**`admins`** (auth-enabled — the template's Users, renamed/scoped)
- Fields: name, email, role (`admin` | `editor`). 2–4 people. Admin manages buyers/RFQs/settings; editor manages content/products.

**`buyers`** (auth-enabled, separate collection — portal accounts)
- Fields: name, company, country (ISO), email (login), phone (opt), website (opt), **status: `pending` | `approved` | `rejected`** (default `pending`), verifiedEmail (bool, via Payload verify flow → Resend), savedProducts (rel: products, many), notes (admin-only), createdAt.
- Signup: public self-signup → email verification → status `pending` → admin approves/rejects in a dedicated **Approval Queue** admin view → approval/rejection email (Resend).
- Access: portal routes require `status === 'approved'` + verified email. Country signup check against Exclusion List (§8.4 / Appendix B).

**`categories`** — exactly the five authoritative categories from the Company Master Prompt, seeded and order-locked:
1. Team Wear (includes the Wetsuit Edition line) · 2. Active Wear · 3. Casual Wear · 4. Outer Wear · 5. Sports Accessories
- Fields: name, slug, heroImage, intro (rich text), SEO fields. These five are the single site-wide taxonomy — nav, catalog, RFQ dropdown, reporting. Do not invent additional top-level categories.

**`products`** (the catalog articles — public, growing from <20)
- Identity: title, slug, category (rel), shortDescription, longDescription (rich text), status (draft/published).
- Specs group (all optional per-article; made-to-order framing): fabricComposition, gsm, availableSizes (multi), keyFeatures (array), certificationsNote (auto-included ecosystem framing — never "RUN is certified").
- **Colorways array** (min 1): name, swatchHex, textureSetKey (path prefix in `run-assets` for this colorway's KTX2 set), posterImage (per-colorway JPG/WebP poster), gallery (opt).
- **model3d group:** glbFile (R2 ref — the compressed, shared-geometry GLB), fileSizeKB (auto), pipelineVersion, fallbackMode (`viewer` | `coming-soon` — per interview 1.4, placeholder until model ready).
- Commercial teasers: moqStartingAt (number, opt), priceStartingAtUSD (number, opt), **showTeasers (bool, default OFF)** — teasers render publicly ("MOQ from X pcs · from $Y") only when this is on AND values exist; per-article override of the global MOQ-warning default (§8.3).
- SEO group: metaTitle, metaDescription, ogImage.

**`fabricLibrary`** — data layer powering RFQ conditional logic
- Import the fabric/fibre lists **verbatim from the RFQ Plan**, re-homed under the five authoritative categories (Appendix A mapping). Confirmed additions: **neoprene + swim/beachwear fabrics under Team Wear (Wetsuit Edition)**; **leather under Outer Wear**. Structure: category → fabricFamilies[] → allowedFibres[] (+ flags: blendable, notes).

**`rfqs`** — every quote request (guest or portal)
- referenceNumber (auto, e.g. `RFQ-2026-000123`), source (`guest`|`portal`), buyer (rel, opt), submittedAt.
- Contact block: name, company, country, email, phone (opt) — prefilled+locked from account on portal path.
- requestType: `bulk` | `sample`.
- **styles[]** (multi-style cards): productRef (opt — prefilled from saved list), category (opt), description (opt) — **validation: at least one of productRef/category/description required per style**; fabricFamily, fibres[] with blend percentages (**must total 100% when >1 fibre entered**), certificationsRequested[] (with trust-note copy), branding options, colours[] (unlimited; totals validated only when quantities entered), sizes breakdown (incl. Youth; One-Size for accessories), quantity (soft MOQ warning, §8.3), targetPrice + currency (auto-preselect by country, ISO-4217 static map; changeable), files[] (private-bucket refs).
- Consents: processingConsent (required, timestamped), marketingOptIn (unticked; EU double-opt-in flag), consentSource.
- Attribution: utm_* fields, landingPage, referrer (consent-aware).
- Ops (admin-only): status (`new`|`in-review`|`quoted`|`won`|`lost`|`archived`), assignee (rel: admins), internalNotes, followUpDate, outcome.

**`inquiries`** — public contact form (per QF3: no signup forced for first contact)
- name, email, company (opt), country, message, techPackFile (opt, private bucket, same upload rules), consents, status, internalNotes. Country checked against Exclusion List.

**`pages`** — block-based marketing pages (hero, rich text, media, stats, timeline, logo-marquee, CTA-by-persona, FAQ blocks…). Live Preview on.

**`posts`** — blog/insights (title, slug, excerpt, cover, body, author label, SEO). 3–5 seed articles at launch (§5).

**`caseStudies`** — anonymized only (e.g., "A European cycling brand"): anonymizedClient, sector, region, challenge, solution, results, images. Never real client names without explicit new instruction.

**`media`** — template's upload collection → R2 (public bucket). Alt text required (SEO + accessibility).

### 4.2 Globals

- **`siteSettings`:** WhatsApp number (**seed with an obviously dummy value, e.g. `+00-000-0000000`**; floating button renders site-wide; number swappable in CMS — X3), public emails (`partner@wear-run.help`, `info@wear-run.help`, `privacy@wear-run.help`), responsePromise text (**"within 2 business days"**), moqWarningDefault (number, seed 250, **display OFF until Hateem confirms** — RQ4), address, social links, announcement bar.
- **`exclusionList`:** countries[] (seed: Bangladesh, China, India, Israel, Pakistan, Sri Lanka — from the RFQ Plan), politeMessage (editable). **Applies to all three entry points:** RFQ form, buyer signup, contact form (RQ3). Centrally managed here only.
- **`navigation`** + **`footer`:** menu structures, CMS-editable.

---

## 5. Site map & page specifications

All public pages: prerendered/static, CMS-managed copy, unique metadata + JSON-LD, persona-aware CTAs where noted. Copy workflow (B1): **Claude drafts every page from the Company Master Prompt → Hateem approves page-by-page** before publish.

| Route | Page | Key requirements |
|---|---|---|
| `/` | Home | Hero (bold, heritage-meets-innovation), category showcase, "Why Partners Choose RUN" (from company doc), sustainability strip, anonymized case-study teasers, **persona CTA block — three doors: Brands / Retailers / Sourcing Agents** (5.2-D), each routing to RFQ or Contact with persona context param. |
| `/about` (or `/heritage`) | About / Heritage | GSAP scroll-driven timeline (UI-Layouts Timeline component candidate). **Founder is "Allah Ditta Ghafuree" consistently, anchored to 1889; do not use the 1889–1980 end-date framing, and never name the founder "Sandal"** (X4 — same person). Later family members/entities in the timeline (e.g., M. Iqbal Sandal, Sandal Trading Corporation) keep their names per the Company Master Prompt; final nuance settled in copy review. |
| `/capabilities` | Capabilities / Manufacturing | 5-stage process with QC checkpoints, facility stats, machinery, 3D prototyping (CLO3D/Optitex) story. |
| `/sustainability` | Sustainability | Commitments with backing facts only (no empty buzzwords — company doc rule). **Certifications: logos + clarifying caption** (B4 — "held within RUN's compliance ecosystem by Durus Industries and certified suppliers"); logo files used only after Hateem confirms permission (Open Item). Never state RUN itself is certified. |
| `/catalog` + `/catalog/[category]` | Catalog | Five category landing pages double as SEO capability pages ("Custom Cycling Team Wear Manufacturer" etc.). Filterable article grid. **Fully public** (Q1 resolution). |
| `/catalog/[category]/[product]` | Article page | 3D viewer (§7) with colorway switcher; poster-first load; specs; made-to-order framing; teaser MOQ/price line only when enabled (RQ5/RQ4); "Request a Quote" (prefills RFQ style card) + "Save" (portal); related articles. |
| `/case-studies` | Case Studies | Anonymized cards (B2). Section hidden from nav automatically if zero published. |
| `/insights` + `/insights/[slug]` | Blog | 3–5 seed articles drafted by Claude at launch (B3-A) targeting OEM/manufacturer long-tail (e.g., choosing a team-wear manufacturer; sustainable fabric certifications explained; wetsuit manufacturing; tech-pack guide; Sialkot heritage). Hateem approves each. |
| `/contact` | Contact | Full public inquiry form (QF3-A, §9) + emails (partner@/info@/privacy@ — **team@ is retired**, §21), address, map optional, WhatsApp. |
| `/rfq` | RFQ engine | §8. Guest-accessible. |
| `/portal/*` | Buyer portal | §10. Login, signup, dashboard, saved list, My RFQs, downloads. |
| `/legal/*` | Privacy Policy, Cookie Policy, Terms | §14. Drafted by Claude for Hateem's review (H3-A). |

**System pages:** custom 404/500 (on-brand, routing back to catalog/contact), favicon set + default OG image (delivered with Phase-1 tokens).

**Not built at launch:** multilingual routes (structure-ready only), order/production tracking (E1-D deferred), guest save-for-later links (§18).

---

## 6. Design system directive

**Inputs:** vector logo only (A1). Claude defines colors + typography.

**Process (A2-D — mandatory gate before any page build):**
1. Present **2–3 distinct design directions** to Hateem — each with: palette, type pairing, sample hero, sample product card, motion character description. Directions should span e.g. dark performance-tech / light sustainability-forward / bold editorial, but each must feel distinct.
2. **Palette rule (A1): unique, unusual colors — explicitly NOT the default corporate blues/greens every apparel site uses.** Derive candidates from the logo, fabric/textile tones, or unexpected pairings; deliver as Tailwind v4 OKLCH tokens with accessible contrast (WCAG AA minimum, including on-photo text treatments).
3. Hateem picks one; it becomes the locked token set (CSS variables mapped through shadcn conventions, dark-mode considered).

**Animation intensity (4.4 — "mix, applied contextually"):**
- Subtle/professional: forms, portal, admin, legal, blog reading.
- Bold/immersive: home hero, heritage timeline, category landings (GSAP ScrollTrigger/SplitText; UI-Layouts scroll components).
- Minimal: catalog grids, spec tables (content first).
- Global rules: honor `prefers-reduced-motion` everywhere; Cursify cursor effects only as selective accents on desktop, auto-disabled on touch; no animation may block interaction or LCP.

**Voice:** per the Company Master Prompt's Voice & Tone matrix (marketing = bold/punchy; product copy = technical/precise). Brand anchors available: "The Extra Mile", "For a Better Tomorrow", "Never Look Back".

---

## 7. 3D pipeline & viewer specification

**Goal:** every article ships with an interactive 3D view (C2-A: full coverage at launch) that loads fast on mobile and desktop equally (I3-B), sourced from Hateem's CLO3D exports (raw files 50MB+).

### 7.1 Colorway architecture (the efficiency rule)
- **One shared-geometry GLB per article** (geometry + UVs + material slots), NOT one full GLB per colorway.
- **Per-colorway texture sets** (KTX2) swapped at runtime by replacing material texture maps. Naming convention: `products/{slug}/model.glb` + `products/{slug}/colorways/{colorway-slug}/{basecolor|normal|orm}.ktx2` + `poster.webp`.
- Escape hatch: if a specific article's colorways genuinely differ in geometry/print layout such that texture-swap fails, a per-colorway GLB is allowed for that article — Claude Code decides per asset and **asks Hateem if unclear**.

### 7.2 Compression pipeline (repo script: `scripts/compress-model.mjs` or npm script)
1. Input: raw CLO3D GLB/GLTF export (Hateem keeps raw masters; also archived to `run-private/masters/`).
2. `gltf-transform` steps: prune/dedup → weld → **meshopt compression** (Draco as fallback profile if a model misbehaves) → resize textures (max 2048px, 1024 where acceptable) → **KTX2** (ETC1S default; UASTC for detail-critical normal maps) → inspect/report.
3. Budgets: delivery GLB ≤ 8MB (target 3–6MB); per-colorway texture set ≤ 4MB; reject & flag anything over budget instead of silently shipping it.
4. Output uploaded to `run-assets` (via Payload admin upload or the script); poster image (WebP, ~1600px) generated per colorway for instant first paint + social/OG.
5. Document the exact commands + a CLO3D export checklist for Hateem (triangle budget guidance, texture baking, single mesh where possible, real-world scale, PBR maps).

### 7.3 Viewer component (R3F v9 + drei)
- Poster-first: static poster renders immediately; viewer lazy-loads on visibility/interaction (never blocks LCP; 3D is below-the-fold priority on mobile).
- Loaders: drei `useGLTF` with meshopt decoder (+ Draco decoder registered as fallback), `KTX2Loader` with basis transcoder; decoders self-hosted in repo/public (no third-party CDNs).
- Interactions (1.2-B): orbit rotate + zoom (touch: one-finger rotate, pinch zoom), **colorway switcher** (swatch row bound to the product's colorways array), auto-rotate idle option, reset view, fullscreen.
- Environment: neutral studio HDR (small, bundled), soft shadows, correct color management.
- Performance guards: capped DPR (≤2), suspend rendering off-screen, dispose on unmount, single canvas per page; degrade gracefully on WebGL failure → poster + gallery.
- Fallback (1.4-B): if `fallbackMode = coming-soon`, render poster/gallery with a tasteful "3D view coming soon" badge.

---

## 8. RFQ engine specification

**Source of truth for field-level detail:** the RFQ Plan document — 4 steps (Details → Request → Review → Privacy & Submit), conditional fabric/fibre cascades, blend-must-total-100%, colour/size logic, sample-route simplification, honeypot, server-side validation, accessibility, UTM capture, confirmation email + thank-you page (with anonymized case studies), internal record shape. Build all of it **as amended below** (audit-reconciled decisions — these override the Plan where they differ):

### 8.1 One engine, two entry points (RQ6)
- **Guest path** (`/rfq`): exactly per the Plan — no account required (QF3). Post-submit prompt: "Create an account to track this RFQ" → on approval, the referenceNumber links to the new buyer account.
- **Portal path**: Step 1 identity auto-filled and locked from the account; saved-list items arrive as pre-filled style cards (Q2-C: one-click cart→RFQ); submissions appear in **My RFQs**. Logged-in **draft saving at v1**; guest magic-link drafts are **deferred** (§18).

### 8.2 Field requirement rules (reconciles 6.1 + Plan + RQ10)
- **Identity fields required** (name, company, country, email; phone optional) — per the Plan.
- **Product/spec fields optional** (per 6.1) **except**: each style card requires **at least one of productRef / category / description** (RQ10) — no empty RFQs.

### 8.3 MOQ soft warning (RQ4)
- Global default 250 (configurable in `siteSettings`), **per-product override** field, warning copy soft ("orders below X pcs per style may not be feasible — we'll advise"). **No public display of MOQ/price teasers anywhere until Hateem confirms real numbers and flips `showTeasers`** (ties to RQ5: once confirmed, teasers are public marketing on product pages; detailed tiers stay portal-gated per E1).

### 8.4 Market exclusion (RQ3, Appendix B)
- The centrally-managed `exclusionList` gates **RFQ country dropdown, buyer signup, and contact form** identically, with the polite message from the Plan. Dropdown-level exclusion only (no IP-blocking at launch).

### 8.5 Response promise & sample wording
- Everywhere the Plan says "48 business hours" → **"within 2 business days"** (RQ7). Sample charges: case-by-case wording as drafted (RQ8).

### 8.6 Consents (RQ9)
- Processing consent: required, timestamped, versioned copy. Marketing opt-in: present, **unticked**, double opt-in for EU visitors, consent record stored (timestamp + source). Certifications multi-select keeps the Plan's trust note (ecosystem framing; extra certs pursued on customer request).

### 8.7 File uploads (Plan decision #2 → concrete defaults, Hateem approves in Phase 5)
- Allowlist: PDF, AI, EPS, PSD, SVG, PNG, JPG, WEBP, ZIP. Server-side MIME sniffing + extension check (reject mismatches). Defaults: **25MB/file, 100MB/RFQ, max 10 files** (Appendix C).
- **Direct-to-R2 presigned upload to `run-private`** — files never stream through the Worker. Quarantine architecture (honest $5-stack answer to the Plan's scanning requirement): never executed or rendered inline; admin download only via short-lived signed URLs with `Content-Disposition: attachment`; files labeled **"unscanned"** in admin; staff SOP = scan on download with local AV; paid scanning API documented as the upgrade path. ZIPs never auto-extracted.

### 8.8 Anti-abuse
- Honeypot field + minimum-fill-time check + Cloudflare rate-limit rules (§3.8) + server-side validation (zod) mirroring every client rule. No CAPTCHA at launch (B2B friction); Turnstile (free) is the documented escalation if spam appears — ask Hateem before enabling.

### 8.9 Notifications & tracking
- On submit: buyer confirmation email (reference number, "within 2 business days", summary) from `no-reply@wear-run.com`; internal notification to `partner@wear-run.help`. GA4 events (consent-gated): rfq_start, rfq_step, rfq_submit, with UTM attribution stored on the record. Email open/click tracking = **nice-to-have only**, not a launch requirement.

---

## 9. Public inquiry form (`/contact`)

Short form: name, email, company (opt), country (exclusion-gated), message, optional tech-pack upload (same §8.7 rules), processing consent (+ optional marketing opt-in). Saves to `inquiries`, notifies `partner@wear-run.help`, confirmation email to sender. Same anti-abuse stack. Purpose (QF3-A): zero-friction first contact — never force signup.

---

## 10. Buyer portal specification

- **Signup** (`/portal/signup`): name, company, country (exclusion-gated), email, password, website (opt), consent → Payload email-verification (Resend) → `pending` state screen ("Your account is under review — within 2 business days").
- **Approval (E2-B):** admin Approval Queue → approve/reject (+ optional reason) → automated email either way. Only `approved` + verified accounts can log in to portal content.
- **Dashboard:** welcome, quick links, latest RFQ statuses.
- **Gated content (E1 + Q1):** PDF Catalog + PDF Company Profile (from `run-private`, watermark-light OK, signed URLs), detailed pricing-tier tables when they exist, spec-sheet downloads.
- **Saved products ("Add to list")**: heart/save on article pages → list view → **"Request quote for these"** → §8 portal path with pre-filled style cards (Q2-C).
- **My RFQs:** table of the buyer's RFQs (reference, date, styles count, status); status values mirror admin pipeline (buyer-visible subset: Received → In review → Quoted → Closed).
- Account settings: profile fields, password reset (Resend), marketing preference toggle, account deletion request (routes to privacy@ workflow, §14).

---

## 11. Email system

**Split-domain architecture (RQ1-B, refined):** humans on `.help`, robots on `.com` — automated mail must match the site domain for trust/deliverability.

| Purpose | From | Via |
|---|---|---|
| Buyer verification / password reset / approval decisions | `no-reply@wear-run.com` | Resend |
| RFQ + inquiry confirmations to submitters | `no-reply@wear-run.com` (Reply-To: `partner@wear-run.help`) | Resend |
| Internal lead notifications | `no-reply@wear-run.com` → to `partner@wear-run.help` | Resend |
| Human replies & public addresses | `partner@` / `info@` / `privacy@` `wear-run.help` (info/privacy = aliases) | Hostinger |

Templates (React Email or minimal HTML, brand-tokened, plain-text alt): verify, approve, reject, reset, RFQ confirmation, inquiry confirmation, internal notification. All footers include company identity + site URL; marketing-consented mail (future) must include unsubscribe. Deliverability runbook: SPF/DKIM/DMARC on both domains (§3.6), send-volume awareness vs. Resend free limits (verify at build), Hostinger per-mailbox daily in/out limits noted for `partner@`.

---

## 12. SEO specification

**Ambition (I1-A + I2-B):** full push from day one, targeting all four export regions equally (Europe, North America, South America, Middle East). English only at launch; hreflang-ready structure (`en` + `x-default`) for later locales.

**Technical layer (every page):**
- CMS-managed metaTitle/metaDescription, canonical URLs, OG/Twitter cards with real images (product poster frames double as OG images).
- **JSON-LD:** `Organization` (site-wide, Sialkot address; `foundingDate: 2020` — RUN APPAREL as an entity per the company doc; the 1889 heritage belongs in description copy, never as the entity founding date), `WebSite`, `BreadcrumbList`, `Product` on article pages (made-to-order; no `offers` price until teasers are enabled — never fabricate pricing), `Article` on posts, `FAQPage` where FAQ blocks exist.
- Auto-generated XML sitemap (pages, categories, products, posts) + `robots.txt`. **Noindex/disallow:** `/portal/*`, `/admin/*`, RFQ step states, thank-you pages. `/rfq` landing itself is indexable.
- Semantic HTML, single `h1`, alt text enforced (media collection requires it), clean crawlable nav.
- Google Search Console + Bing Webmaster verification and sitemap submission at launch (Phase 8).

**Content layer:**
- The five category pages are the primary keyword landers ("custom team wear manufacturer", "private label activewear manufacturer", "custom wetsuit manufacturer", etc.) — each with substantial CMS copy, not thin grids.
- Public product pages (Q1) provide long-tail coverage; blog seeds (§5) target research-stage buyer queries; internal linking: posts → categories → products → RFQ.
- All copy respects the Company Master Prompt voice and the certification-framing rule.

**Performance is ranking:** §16 budgets are part of the SEO spec, not separate.

---

## 13. Analytics & consent

**Consent banner:** custom-built, lightweight (no paid CMP). Three categories, each individually accept/rejectable: *Necessary* (always on), *Analytics* (GA4), *Company identification* (Apollo). Behavior is identical for all visitors (consent-first everywhere — simplest and safest): **nothing non-essential loads before opt-in.** Consent choice stored (necessary storage) with timestamp + policy version; revocable from the Cookie Policy page.

- **Cloudflare Web Analytics:** cookieless, no personal data → runs always, consent-independent. This is the guaranteed baseline metric source.
- **GA4:** loaded only post-consent, configured with **Consent Mode v2** (default denied). Events: `rfq_start`, `rfq_step`, `rfq_submit`, `inquiry_submit`, `signup_submitted`, `portal_login`, `product_view`, `3d_interact`, `colorway_switch`, `whatsapp_click`, `catalog_download`. UTM attribution flows into RFQ/inquiry records (§8.9) only under the same consent.
- **Apollo Website Visitors:** snippet in the root layout (SPA-compatible placement), **company-level identification only** (the toggle Hateem's plan provides), loaded strictly post-consent, and **explicitly disclosed in the Privacy Policy** ("we use Apollo.io to identify the companies of business visitors"). Hateem supplies the snippet (§20).
- No ads or retargeting pixels at launch.

---

## 14. Legal pages (Claude drafts → Hateem reviews; H3-A)

Drafts are informed templates, not legal advice — recommend eventual counsel review, especially for GDPR exposure. Privacy contact: **privacy@wear-run.help**.

- **Privacy Policy:** controller = RUN APPAREL (PVT) LTD, Sialkot address; data collected (inquiries, RFQs incl. uploaded files, buyer accounts, emails, analytics, **Apollo company identification — named explicitly**); purposes + GDPR legal bases; recipients/subprocessors (Cloudflare, Resend, Hostinger, Google, Apollo); international transfer note (global edge network, US subprocessors); retention defaults — **propose 3 years for RFQs/inquiries (business records), accounts until deletion request** — Hateem confirms (§19); data-subject rights + how to exercise (privacy@); cookies cross-reference.
- **Cookie Policy:** table of exactly what's set (consent record, auth session, GA4 IDs post-consent), categories, durations, revocation instructions.
- **Terms of Use:** website + portal terms (account approval at RUN's discretion, acceptable use, termination), IP notice, **RFQ/quote disclaimer — nothing on the site or in a quote response is a binding offer until a formal agreement**; no consumer-sale terms anywhere (100% B2B).

---

## 15. Security, hardening, backups & the mandatory smoke test

Beyond §3 (WAF, rate limits, secrets, optional Access on `/admin`):

- **Headers:** strict CSP (self + `assets.wear-run.com` + consented analytics origins; nonce-based inline where needed), HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, minimal `Permissions-Policy`.
- **Auth hardening:** Payload `maxLoginAttempts` + `lockTime` on both auth collections; strong password minimums; secure/httpOnly/sameSite session cookies; no user enumeration in error copy.
- **Access control review (pre-launch checklist item):** buyers read only their own RFQs/profile; admin-only fields (internalNotes, status, assignee) invisible to non-admins; no public REST list endpoints exposing `buyers`, `rfqs`, or `inquiries`; drafts never leak.
- **Uploads:** per §8.7 (allowlist, MIME sniff, presigned direct-to-private, unscanned-label quarantine, attachment-only downloads, no ZIP extraction).
- **Dependencies:** Dependabot on; monthly `npm audit` + patch/minor updates within pinned majors.
- **Backups:** nightly D1 export → `run-private/backups/` (30-day retention) + D1 Time Travel (30 days) + R2 media as durable store + Hateem's local raw-master archive. **Quarterly restore drill:** load the latest export into a local/scratch D1 and verify integrity.
- **Monitoring:** Workers logs/observability for errors; Cloudflare usage + billing notifications (§3.9); optional free external uptime pinger.

**🔴 MANDATORY PRODUCTION SMOKE TEST** — run after first deploy and after **every** Payload/adapter/OpenNext upgrade, *before* real content entry (guards the Dec-2025 D1-adapter DELETE bug, payload#15070):
1. For **each** collection in production: create → read → update → **delete → re-query to confirm the delete actually persisted**.
2. Media upload → verify object in R2 → delete → verify removal.
3. Auth: buyer signup → verification email arrives → login → password reset → admin approve/reject emails.
4. RFQ end-to-end: multi-style + file upload → record correct in admin → both emails delivered.
5. Log results in the runbook with versions tested.

---

## 16. Performance budgets (launch gates, mobile 4G baseline)

- **Core Web Vitals:** LCP < 2.5s (target 2.0), CLS < 0.1, INP < 200ms on home, category, product, RFQ.
- **JS:** initial bundle on marketing pages < 200KB gzip; 3D viewer + decoders in lazy chunks excluded from initial load; no blocking third-party scripts (analytics load post-consent, async).
- **Media:** WebP/AVIF, responsive sizes, priority hints on hero/LCP image only; fonts ≤ 2 families, subset, self-hosted, `font-display: swap`.
- **3D:** §7.2 budgets (GLB ≤ 8MB, texture set ≤ 4MB); poster paints first; viewer never the LCP element.
- **Static verification:** build-output check that every public route is prerendered (Prime Directive 7).
- **Gate:** Lighthouse ≥ 90 (Performance, SEO, Accessibility, Best Practices) on key pages before Phase 8 sign-off.

---

## 17. Build phases & acceptance gates

No calendar dates (solo + Claude Code, own pace) — each phase closes only when Hateem ticks its checklist.

| Phase | Scope | Gate (Hateem sign-off) |
|---|---|---|
| **0 — Foundations** | Repo from official D1 template; Workers Paid; D1 + both R2 buckets bound; domains/DNS + email records (§3); secrets; deploy pipeline; nightly backup Action (build lives on the workers.dev preview URL until the Phase-8 DNS cutover) | Deployed starter reachable; **§15 smoke test green**; backup file visible in R2 |
| **1 — Design directions** | 2–3 directions per §6 | Direction picked; tokens locked |
| **2 — CMS schema** | All collections/globals/access/Live Preview/Approval Queue; seed 5 categories, exclusion list, dummy-WhatsApp settings | Hateem creates a test product unaided (walkthrough doc provided) |
| **3 — Public site core** | All §5 pages with drafted copy; nav/footer; SEO plumbing; blog seeds drafted | **Page-by-page copy approvals** complete |
| **4 — 3D & catalog** | Pipeline script + CLO3D checklist; first article end-to-end (raw → compressed → viewer with colorway switch) | Viewer approved on Hateem's real phone; budgets met |
| **5 — RFQ engine** | Guest path full (§8), uploads (Appendix C **approved here**), emails, anti-abuse | Test RFQ lands at partner@ correctly; copy + limits approved |
| **6 — Buyer portal** | §10 complete incl. saved-list→RFQ and My RFQs | Hateem completes the full buyer journey as a test user |
| **7 — Analytics · consent · legal** | Banner, GA4 CMv2, Apollo gating, legal pages | Verified nothing loads pre-consent; policies approved; retention set |
| **8 — Hardening & launch** | §15 checklist, §16 gates, DMARC ramp begun, Search Console, final content load | Launch checklist signed → DNS live → 48h post-launch watch |

---

## 18. Deferred — documented, not built at launch

Guest magic-link RFQ drafts · order/production tracking (E1-D) · multilingual incl. Arabic RTL · paid AV-scanning API for uploads · Turnstile (only if spam appears — ask first) · email open/click tracking · D1 read replicas (flip when traffic warrants) · paid CMP · Payload 4 / R3F 10 / Next 17 (ask first) · D1→Postgres migration (only if outgrown).

---

## 19. Open items log (owner: Hateem unless noted)

1. Real MOQ default + per-product values + starting prices → flip `showTeasers` (RQ4/RQ5).
2. Lead times, payment terms/Incoterms, sample fee amounts → capabilities/FAQ copy.
3. Certification logo permissions via Durus/suppliers + exact cert-to-entity mapping (B4).
4. Real WhatsApp number → replace dummy in `siteSettings` (X3).
5. Logo vector files (Phase 1) · 6. Photography handoff (Phase 3) · 7. Apollo snippet (Phase 7).
8. Resend account + domain verification (Phase 0/5, Claude Code guides). 9. Hostinger: create `partner@`, aliases `info@`/`privacy@` (Phase 0, X2).
10. Update the **Company Master Prompt source doc**: team@ retired → new addresses; "Sherpa" (X5); founder naming rule (X4). Claude drafts the edits.
11. Approve Appendix C upload limits (Phase 5 gate). 12. Confirm privacy retention periods (Phase 7).

---

## 20. Inputs required from Hateem at build start

Cloudflare account with card + Workers Paid (Phase 0) · GitHub repo access for Claude Code · DNS access to both domains (✅ confirmed held) · logo vectors · photography set · gated PDFs (catalog + company profile) · Apollo account access · Hostinger admin access · availability for the §17 gates.

---

## 21. Overrides of the Company Master Prompt (this document wins on these points only)

1. **`team@wear-run.com` is retired.** Public addresses: `partner@` / `info@` / `privacy@` `wear-run.help` (info/privacy alias → partner). Automated mail: `no-reply@wear-run.com`.
2. **WhatsApp:** the doc's `+92-336-1777313` is NOT used at launch — obviously-dummy CMS placeholder until Hateem supplies the real number (X3).
3. **Founder naming:** "Allah Ditta Ghafuree" consistently, anchored to **1889**; no 1889–1980 end-date framing; never introduce "Sandal" as the founder's name (X4). Remaining timeline facts per the company doc, settled finally in copy review.
4. **"Shepra" → "Sherpa"** everywhere (X5).
5. **Response promise:** "within 2 business days" supersedes any "48 business hours" phrasing (RQ7).
6. **Taxonomy:** the five §4.1 categories are the exclusive site-wide taxonomy; RFQ Plan fabric lists are re-homed under them (Appendix A).
7. **Certifications:** ecosystem framing is binding UI/copy law — logos only with caption after permission (B4); never "RUN is certified."

---

## Appendix A — Fabric library remap rule

Import fabric families + fibre lists **verbatim** from the RFQ Plan; re-home each under the five §4.1 categories (the Plan's own category labels are superseded). Confirmed additions: **Team Wear** gains Neoprene + swim/beach fabrics (Wetsuit Edition); **Outer Wear** gains Leather. Any fabric that doesn't map cleanly to one category → **ask Hateem**, don't guess.

## Appendix B — Exclusion list mechanics

Single source: `exclusionList` global (seed: Bangladesh, China, India, Israel, Pakistan, Sri Lanka). Enforced identically at RFQ, buyer signup, and contact form: excluded countries in the dropdown trigger the polite message from the Plan and block submit; server-side revalidation guards against tampering. No IP-geoblocking at launch. Admin-editable without deploy.

## Appendix C — File-upload defaults (await Phase-5 approval)

**25 MB/file · 100 MB per RFQ · max 10 files** · allowlist: PDF, AI, EPS, PSD, SVG, PNG, JPG, WEBP, ZIP · direct-to-R2 presigned to `run-private` · unscanned-label quarantine SOP (§8.7).

---

*End of Master Prompt v1.0 — hand this file, the Company Master Prompt, and the RFQ Plan to Claude Code together, confirm §20 inputs, and begin at Phase 0.*
