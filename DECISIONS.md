# DECISIONS.md — RUN APPAREL Website Build

Append-only record of Hateem's approvals and sign-offs (format per CLAUDE.md §4: date · decision · one-line context). **Never rewrite or delete an entry.** If planned work would contradict a recorded decision, stop and ask.

---

- 2026-07-12 · Constitution v1 filed at repo root (`CLAUDE.md`, Build Master Prompt v1.1, Company Master Prompt, RFQ Plan v2.0-reconstructed) · Per Hateem's Session-1 instruction; documents are read-only to Claude (spec §0.1, CLAUDE.md §2).
- 2026-07-12 · Phase 0 execution plan approved · Session 1 plan (constitution filed, memory files, chunked Phase 0 stages A–G through the spec §17 row-0 gate); execution may begin.
- 2026-07-12 · CF1 — Cloudflare Email Routing NOT used · Hostinger already runs catch-all on both wear-run.com and wear-run.help, forwarding all mail (incl. `partner@`) to `hateem@wear-run.com`; enabling Cloudflare Email Routing would seize MX and break it. Chunk E5 dropped; SPF-merge safeguard retained but now applies between Hostinger's and Resend's SPF on wear-run.com.
- 2026-07-12 · Cloudflare access = scoped API token · Claude runs the D1/R2/DNS automation via a revocable API token Hateem adds to this environment (`CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID`).
- 2026-07-12 · Deploy mechanism = Cloudflare Workers Builds · Build/deploy on git push via Cloudflare's Git integration; GitHub Actions reserved for the nightly backup (spec §3.10 pick-one).
- 2026-07-12 · Cloudflare Access on `/admin` = ENABLED · Free Zero Trust login wall in front of the CMS admin (spec §3.8, optional-but-recommended).
