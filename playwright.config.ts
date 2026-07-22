import { defineConfig, devices } from '@playwright/test'

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import 'dotenv/config'

/**
 * See https://playwright.dev/docs/test-configuration.
 *
 * The server under test is a PRODUCTION build, not `next dev`. This matters more than it
 * looks: dev output is unminified and unsplit, so every byte count, bundle assertion and
 * timing measured against it is meaningless — a budget check against `next dev` would fail
 * loudly for reasons that never reach a visitor, and a lazy-loading assertion would pass or
 * fail for the wrong reasons entirely.
 *
 * Port 3789 is explicit because the Claude Code harness on this machine injects PORT=5002
 * into every shell, and Next honours PORT — see docs/INVESTIGATION-local-build.md.
 * NODE_ENV is stripped for the same class of reason (the harness leaks
 * NODE_ENV=development, which corrupts a production build).
 */
const PORT = 3789
const BASE_URL = `http://localhost:${PORT}`

export default defineConfig({
  testDir: './tests/e2e',
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    baseURL: BASE_URL,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },
  projects: [
    {
      /**
       * `channel: 'chromium'` is the full browser, NOT the default headless shell.
       * Since Playwright 1.49 the default gives a weak SwiftShader GL context, which is the
       * wrong thing to judge a 3D viewer against. The software-renderer path gets its own
       * project in the Phase-4 viewer suite.
       */
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], channel: 'chromium' },
    },
  ],
  webServer: {
    command: `env -u NODE_ENV -u PORT pnpm run build && env -u NODE_ENV PORT=${PORT} pnpm run start`,
    url: BASE_URL,
    // Locally, reuse whatever is already serving so the suite doesn't rebuild every run.
    // On CI always build fresh — reusing a server there would mean testing unknown code.
    reuseExistingServer: !process.env.CI,
    // A cold production build plus server start; well above the ~60s this usually takes.
    timeout: 300_000,
    stdout: 'pipe',
    stderr: 'pipe',
  },
})
