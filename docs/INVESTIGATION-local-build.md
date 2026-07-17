# Handoff prompt — investigate the macOS local build failure

> **✅ RESOLVED 2026-07-17 — see the BUILD_LOG.md Session-5 entry for the full evidence.**
> Root causes: (1) the `useContext` crash was the Claude Code desktop app leaking `NODE_ENV=development`
> into every shell it runs — `env -u NODE_ENV pnpm run build` goes green; it was never macOS, Node, or the
> repo. (2) `SQLITE_BUSY` is one Miniflare boot per build worker on one sqlite file — a `NEXT_PHASE`-gated
> stub fix is validated and awaits Hateem's approval. (3) The vitest failure was esbuild's realm check under
> vitest's jsdom global-mixing — fixed, `test:int` green. **Corrections to the text below:** the "strongest
> untested lead" (route-group layout wrapping the synthetic pages) is REFUTED — Next uses its builtin layout;
> and the "stale install ruled out" elimination did not hold — the store contained two React copies when this
> session began (real dirt, though proven not to be the cause of the crash).

Paste the block below into a **new Claude Code session** in `~/Sites/website-main`.
Everything above the block is context for Hateem; the block itself is self-contained.

**Why a fresh session:** the investigation needs a clean context window, and the last session
had already burned its budget on Phase 2. Nothing here is urgent — deploys work fine via CI.
It matters at **Phase 3**, when page copy needs local previewing.

---

```
Investigate why `pnpm exec next build` and `pnpm run test:int` fail on this Mac, when the same
code builds and deploys green on Cloudflare Workers Builds (Linux). Follow the session ritual in
CLAUDE.md first: read CLAUDE.md, BUILD_LOG.md, DECISIONS.md, then the 2026-07-17 BUILD_LOG entry
titled "Version audit (spec §0.4) + the local build/test mystery" — it records everything already
ruled out. Do NOT re-run those eliminations; they cost a full session.

THE TWO FAILURES

1. `pnpm exec next build` — compiles and typechecks clean, then dies in static generation while
   prerendering Next's OWN synthetic pages (`/_not-found`, `/_global-error`):
     TypeError: Cannot read properties of null (reading 'useContext')
       at .next/server/chunks/ssr/<hash>._.js  (inside Next's dist chunk, not our code)
   Immediately before it, React logs duplicate-key warnings naming `<html>`, `<meta>`, `<head>`.
   With `experimental: { cpus: 1, workerThreads: false }` the useContext error still occurs.
   With default workers (this Mac has 14 cores) a SECOND error appears and can mask the first:
     Fatal uncaught kj::Exception: workerd/util/sqlite.c++: SQLITE_BUSY: database is locked
     Failed to collect configuration for /admin/[[...segments]]
   i.e. many build workers each boot Miniflare against one local D1 sqlite. Both failures are real
   and independent; do not assume fixing one fixes the other.

2. `pnpm run test:int` (vitest, environment: 'jsdom'):
     Invariant violation: "new TextEncoder().encode("") instanceof Uint8Array" is incorrectly false
   Classic jsdom cross-realm issue. Possibly the same root cause as #1, possibly not.

ALREADY RULED OUT — each by a real test, not reasoning. Don't repeat these:
- Our Phase 2 code. A FULL control checkout of commit 18693f7 (pre-Phase-2, the code that has been
  live since Phase 0) fails IDENTICALLY.
- The custom admin view (Approval Queue). Removing it from payload.config changes nothing.
- Node version. Fails on 22.23.1, 24.14.1 AND 24.18.0. Node is NOT the cause.
- Stale install / cache. `rm -rf node_modules .next .wrangler` + clean install: no change.
- The pnpm patch on @payloadcms/drizzle. Verified applied (patch_hash in the .pnpm path).
- Dependency versions. Fails on both the old pins and the current latest-stable-within-major set.
  React 19.2.7 does NOT fix it (it only lets SQLITE_BUSY surface first and mask the useContext error).

STRONGEST UNTESTED LEAD
The app has TWO route groups — `src/app/(frontend)/` and `src/app/(payload)/` — each with its own
layout rendering `<html>`, and there is NO root `src/app/layout.tsx`. Next still has to synthesise
`/_not-found` and `/_global-error`, which need a root layout. Suspect Next picks the (payload)
layout, dragging Payload's client components into an SSR prerender with no React context — hence
`useContext` on a null React. The `<html>/<head>/<meta>` duplicate-key warnings point the same way.
Test it: add a minimal `src/app/layout.tsx`, and/or an explicit `src/app/not-found.tsx` +
`src/app/global-error.tsx`, and see whether the prerender stops touching Payload's layout.

CONSTRAINTS
- This is a LOCAL DEV problem only. CI is green and Phase 2 is deployed and verified — do not
  "fix" it by changing anything that risks the deploy path.
- Verify whether it's macOS-specific or would also bite CI on a 14-core runner (the SQLITE_BUSY
  half is core-count dependent and could surface in CI later).
- If the fix is a Next config change (e.g. `experimental.cpus`), weigh the CI cost — it slows
  every deploy build. Prefer a fix that is correct rather than one that merely serialises workers.
- Adding a dependency, or changing .node-version / next.config, needs Hateem's approval (CLAUDE.md §6).
- If it turns out to be an upstream Next.js bug, write a minimal reproduction and propose reporting
  it — but confirm it reproduces outside this repo first.

DELIVERABLE
Root cause with evidence (not a hypothesis presented as a conclusion — the last session did that
twice and was wrong both times). Then: a fix, or a plain-language explanation of why there isn't
one yet plus the documented workaround. Update BUILD_LOG.md either way.

NOTE: Node 22 is installed keg-only at /opt/homebrew/opt/node@22/bin (from the elimination test).
Remove it if it's not useful: `brew uninstall node@22`. Default Node is 24.18.0 (latest LTS).
```

---

## Current state, for reference

- **Deploys work.** Workers Builds (Linux) built and deployed Phase 2 today; `/api/categories`
  serves the 5 seeded categories.
- **`.node-version` is still 22** while the Mac runs 24.18.0. Known NOT to be the cause, so it was
  left alone rather than moving CI off a green configuration.
- **`pnpm exec tsc --noEmit` and `pnpm run lint` both pass** — the failure is confined to
  `next build`'s prerender step and to vitest.
