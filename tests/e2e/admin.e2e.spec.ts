import { test, expect, Page } from '@playwright/test'
import { login } from '../helpers/login'
import { seedTestUser, cleanupTestUser, testUser } from '../helpers/seedUser'

test.describe('Admin Panel', () => {
  let page: Page

  test.beforeAll(async ({ browser }) => {
    await seedTestUser()

    const context = await browser.newContext()
    page = await context.newPage()

    await login({ page, user: testUser })
  })

  test.afterAll(async () => {
    await cleanupTestUser()
  })

  // Paths are relative so playwright.config.ts's baseURL decides which server is under
  // test. The collection is `admins`, not the template's `users` — renamed in Phase 2
  // (the physical table is still `users` via dbName, which is why the old URLs looked
  // plausible while never resolving).
  test('can navigate to dashboard', async () => {
    await page.goto('/admin')
    await expect(page).toHaveURL(/\/admin\/?$/)
    const dashboardArtifact = page.locator('span[title="Dashboard"]').first()
    await expect(dashboardArtifact).toBeVisible()
  })

  test('can navigate to list view', async () => {
    await page.goto('/admin/collections/admins')
    // Payload appends its own list-view query params (?depth=1&limit=10), so anchoring the
    // pattern to end-of-string would never match.
    await expect(page).toHaveURL(/\/admin\/collections\/admins(\?|$)/)
    const listViewArtifact = page.locator('h1', { hasText: 'Staff accounts' }).first()
    await expect(listViewArtifact).toBeVisible()
  })

  test('can navigate to edit view', async () => {
    await page.goto('/admin/collections/admins/create')
    await expect(page).toHaveURL(/\/admin\/collections\/admins\/[a-zA-Z0-9-_]+/)
    const editViewArtifact = page.locator('input[name="email"]')
    await expect(editViewArtifact).toBeVisible()
  })
})

// NOT tested here: spec §4's "buyers can never reach /admin". That rule is enforced by
// `admin.user: 'admins'` in payload.config.ts — Payload refuses admin access whenever the
// logged-in user's collection differs, before any role check runs. Proving it needs a
// session authenticated as a BUYER, which the buyer portal (Phase 6) introduces. Asserting
// it from an admin session, as an earlier draft of this file did, proves nothing: an admin
// is supposed to see the buyers collection.
