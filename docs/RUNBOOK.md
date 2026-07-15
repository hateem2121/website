# RUNBOOK — RUN APPAREL Website

Plain-language operations manual: what the moving parts are, how to check on them, and what to do when something breaks. Kept current by Claude Code; every §15 smoke test is logged at the bottom. (A *runbook* = the instruction sheet you reach for during an incident, so nobody has to think from scratch under stress.)

---

## 1. Quick facts

| Thing | Value |
|---|---|
| Live preview URL | https://run-apparel.hateemjamshaid.workers.dev |
| Production domain | wear-run.com — **not connected until Phase 8 cutover** |
| Worker name | `run-apparel` |
| Database | Cloudflare D1 `run-apparel-db` (id `39ac4f94-0ee3-437b-849f-20b00c34b7c3`, region ENAM) |
| Storage buckets | R2 `run-assets` (public assets) · `run-private` (uploads, backups — never public) |
| Repo | github.com/hateem2121/website, single branch `main` |
| DNS | wear-run.com → Hostinger · wear-run.help → Cloudflare |
| Budget ceiling | **$5/month total** (Workers Paid) — spec §0.2 |

## 2. Deploy pipeline (how code reaches the internet)

**Cloudflare Workers Builds** watches `main` on GitHub. Every push: it runs `corepack enable && pnpm install && pnpm exec opennextjs-cloudflare build`, then `npx wrangler deploy`. There is no other deploy path (spec §3.10 "pick one, document it" — this is the pick; GitHub Actions is reserved for backups).

- **See builds / logs:** Cloudflare dashboard → Workers & Pages → `run-apparel` → Deployments.
- **Roll back a bad deploy:** same page → pick the previous good deployment → "Rollback". Code rollback: `git revert <bad-commit>` and push (never rewrite history — CLAUDE.md §8).
- `PAYLOAD_SECRET` lives only as an encrypted Worker secret (dashboard → the Worker → Settings → Variables and Secrets). Never in the repo or chat.

## 3. Backups (three layers)

1. **Nightly SQL dump** — GitHub Action [`backup.yml`](../.github/workflows/backup.yml) runs at 02:17 UTC: exports `run-apparel-db` to a `.sql` file and uploads it to `run-private/backups/run-apparel-db-YYYY-MM-DD.sql`, then re-downloads and byte-compares it to verify. Needs two repo secrets (`CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`) — see comments at the top of the workflow file.
   - **Retention:** 30 days, enforced by an R2 lifecycle rule (set once): dashboard → R2 → `run-private` → Settings → Object lifecycle rules → Add rule → prefix `backups/`, action *Delete uploaded objects*, 30 days.
   - **Run one manually:** GitHub → Actions → "Nightly D1 backup" → Run workflow.
2. **D1 Time Travel** — Cloudflare keeps a continuous 30-day undo history of the database automatically (nothing to configure). See §4.
3. **R2 media durability + Hateem's local raw-master archive** (spec §15).

**Quarterly restore drill** (proves backups actually restore — schedule: Oct 2026, Jan 2027, …): download the newest dump from `run-private/backups/`, load it into a scratch local D1 (`wrangler d1 create scratch-restore && wrangler d1 execute scratch-restore --local --file <dump>.sql`), check row counts against production, then delete the scratch DB. Log the result in §7.

## 4. D1 Time Travel (the 30-day undo)

Time Travel can put the database back to any moment in the last 30 days (e.g. before an accidental deletion or a bad migration).

- Check the current restore point: `npx wrangler d1 time-travel info run-apparel-db`
- Restore to a moment: `npx wrangler d1 time-travel restore run-apparel-db --timestamp=<unix-or-ISO>`
- ⚠️ Restoring rewinds the **whole database**. Take a fresh export first (run the backup Action manually) so the current state is preserved before you rewind.

## 5. Monitoring, billing safety & protections

- **Workers Logs:** enabled via `observability.enabled: true` in `wrangler.jsonc`. View: dashboard → Workers & Pages → `run-apparel` → Logs. Check after every deploy and when anything misbehaves.
- **Billing notifications (spec §3.9 — there is no hard spending cap, alerts are the control):** dashboard → Notifications → Add → "Billing — usage threshold". Documented thresholds: alert when monthly spend reaches **$6** (something unusual) and **$10** (investigate immediately). Also enable the generic "Billable Usage" notification for Workers requests.
- **Protections status:**
  - Cloudflare Access in front of `/admin` — **approved 2026-07-12, pending setup** (Zero Trust → Access → Applications → Add self-hosted; domain `run-apparel.hateemjamshaid.workers.dev`, path `admin`; policy: allow only Hateem's email).
  - Bot Fight Mode + rate-limit rules are **zone-scoped** (they attach to a domain on Cloudflare, not to workers.dev), so the full §3.8 set lands at the Phase-8 cutover when wear-run.com joins Cloudflare. Bot Fight Mode can be enabled on `wear-run.help` now (Security → Bots). workers.dev already bot-blocks non-browser traffic by default (observed: curl → 403).

## 6. Email & DMARC ramp (Phase 5 dependency, plan recorded now)

DMARC is a DNS policy that tells receiving mail servers what to do with mail that fails authentication. Ramp per spec §3.6, once Resend sending is set up on wear-run.com: start `p=none` (observe reports only) → after 2–4 clean weeks `p=quarantine` (suspicious mail to spam) → after 2–4 more clean weeks `p=reject`. Never jump straight to reject. Hostinger's catch-all inbound on both domains must keep working — SPF records get **merged**, never replaced.

## 7. §15 smoke-test log (mandatory: after first deploy, after every Payload/adapter/OpenNext upgrade, before real content entry)

| Date | Versions (payload · @payloadcms/db-d1-sqlite · next · @opennextjs/cloudflare · wrangler) | Scope & result |
|---|---|---|
| 2026-07-13 | 3.86.0 · 3.86.0 · 16.2.10 · 1.20.1 · ~4.61.1 | **PASS (SQL layer):** temp-table create→read→update→delete→re-query on production D1 via connector; delete persisted (guards payload#15070). |
| 2026-07-13 | same | **PASS:** first deploy reachable; Hateem created first admin via `/admin` (Payload auth + D1 write through the live app). |
| 2026-07-15 | same | **PASS (read layer):** schema intact (8 Payload tables), migration recorded, both R2 buckets present; public page + `/admin` login page render in a real browser. |
| 2026-07-15 | same | **PENDING:** Payload-path CRUD on `users` + `media` incl. delete-persistence re-query, and media upload → R2 → delete → verify-gone. Blocked on Hateem authorizing production test-writes / admin-UI session. Items 3–4 of §15 (buyer emails, RFQ round-trip) defer to Phases 5–6. |

## 8. Incident quick cards

- **Site down / erroring:** Workers Logs (§5) → if a deploy caused it, roll back (§2). Check Cloudflare status page for platform incidents.
- **Data damaged or wrongly deleted:** stop writes (don't "fix" by hand); manual backup run; then Time Travel restore (§4).
- **Suspected secret leak:** rotate `PAYLOAD_SECRET` (Worker → Settings), rotate the GitHub-stored Cloudflare token (create new → update repo secret → delete old). Rotating logs all users out — that is fine.
- **Backup Action failing:** Actions tab → open the red run → the failing step names the missing piece (usually an expired/mis-scoped token). Fix the secret; run manually to confirm.
