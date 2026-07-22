import { test, expect } from '@playwright/test'

/**
 * Public-site smoke tests.
 *
 * These replace the Payload starter template's assertions ("Welcome to your new project."),
 * which had survived every phase — meaning `pnpm test` was reporting green against a page
 * that stopped existing in Phase 3.
 *
 * Scope is deliberately narrow: that every public route renders, that the shell is present,
 * and that the standing copy rules hold in the RENDERED output. The copy rules are asserted
 * rather than trusted because they are the ones a well-meaning edit silently breaks — they
 * come from spec §5 and the Company Master Prompt, and several were caught in earlier phases
 * only after appearing in shipped HTML.
 *
 * Runs against a production build on port 3789 (see playwright.config.ts).
 */

const PUBLIC_ROUTES = [
  '/',
  '/about',
  '/capabilities',
  '/sustainability',
  '/catalog',
  '/catalog/team-wear',
  '/case-studies',
  '/insights',
  '/insights/how-to-choose-a-team-wear-manufacturer',
  '/rfq',
  '/contact',
]

test.describe('Public site', () => {
  for (const route of PUBLIC_ROUTES) {
    test(`${route} renders with a complete shell`, async ({ page }) => {
      const response = await page.goto(route)
      expect(response?.status(), `${route} should return 200`).toBe(200)

      // Exactly one <h1>: an accessibility requirement and a Lighthouse SEO check.
      await expect(page.locator('h1')).toHaveCount(1)

      // Landmarks the layout is responsible for.
      await expect(page.locator('main#content')).toBeVisible()
      await expect(page.locator('nav').first()).toBeAttached()
      await expect(page.locator('footer').first()).toBeAttached()

      // Every image must carry alt text — screen readers and the a11y gate both need it.
      const imagesMissingAlt = await page.locator('img:not([alt])').count()
      expect(imagesMissingAlt, `${route} has <img> without alt`).toBe(0)
    })
  }

  test('unknown routes render the styled 404, not a crash', async ({ page }) => {
    const response = await page.goto('/this-route-does-not-exist')
    expect(response?.status()).toBe(404)
    await expect(page.locator('main#content')).toBeVisible()
  })

  test('unknown category and article slugs 404', async ({ page }) => {
    for (const route of ['/catalog/not-a-category', '/insights/not-an-article']) {
      const response = await page.goto(route)
      expect(response?.status(), `${route} should 404`).toBe(404)
    }
  })
})

test.describe('Standing copy rules (spec §5, Company Master Prompt)', () => {
  test('founder framing, certification framing and RFQ voice hold across the site', async ({
    page,
  }) => {
    for (const route of PUBLIC_ROUTES) {
      await page.goto(route)
      const text = (await page.locator('body').innerText()).toLowerCase()

      // The founder is Allah Ditta Ghafuree, anchored to 1889, and is never named "Sandal".
      // Later family members legitimately carry that surname, so this asserts the specific
      // false construction rather than banning the word outright.
      expect(text, `${route}: founder must never be named "Sandal"`).not.toMatch(
        /founder[^.]{0,40}sandal|sandal[^.]{0,20}founded/,
      )

      // RUN operates within a certified ecosystem; it is never itself certified.
      expect(text, `${route}: must never claim RUN is certified`).not.toMatch(
        /run (apparel )?is certified|we are certified|our certifications/,
      )

      // This is a quote/RFQ business, not a shop. The words never appear.
      expect(text, `${route}: retail language is banned`).not.toMatch(
        /add to cart|checkout|buy now|shopping bag/,
      )

      // Spelling and response-promise rules settled in earlier phases.
      expect(text, `${route}: "Shepra" is a misspelling of Sherpa`).not.toContain('shepra')
      expect(text, `${route}: the promise is "within 2 business days"`).not.toContain(
        '48 business hours',
      )
    }
  })

  test('Organization JSON-LD dates the company to 2020, with 1889 in prose only', async ({
    page,
  }) => {
    await page.goto('/')
    const blocks = await page.locator('script[type="application/ld+json"]').allTextContents()
    const org = blocks.map((b) => JSON.parse(b)).find((d) => d['@type'] === 'Organization')

    expect(org, 'Home must emit Organization JSON-LD').toBeTruthy()
    // 1889 is the heritage story and belongs in prose — including inside the JSON-LD
    // `description`, which is prose. What must never happen is 1889 appearing as a
    // structured DATE, which would tell search engines the legal entity is 137 years old.
    expect(org.foundingDate).toBe('2020')
    for (const [key, value] of Object.entries(org)) {
      if (!/date|founding|established/i.test(key)) continue
      expect(String(value), `Organization.${key} must not carry 1889 as a date`).not.toContain(
        '1889',
      )
    }
  })
})
