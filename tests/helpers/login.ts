import type { Page } from '@playwright/test'
import { expect } from '@playwright/test'

export interface LoginOptions {
  page: Page
  serverURL?: string
  user: {
    email: string
    password: string
  }
}

/**
 * Logs the user into the admin panel via the login page.
 */
export async function login({ page, serverURL, user }: LoginOptions): Promise<void> {
  // Relative by default so the `baseURL` in playwright.config.ts is the single source of
  // truth for which server is under test. The old hardcoded :3000 silently pointed these
  // tests at whatever happened to be on that port — or nothing at all.
  const at = (path: string) => (serverURL ? `${serverURL}${path}` : path)

  await page.goto(at('/admin/login'))

  await page.fill('#field-email', user.email)
  await page.fill('#field-password', user.password)
  await page.click('button[type="submit"]')

  await page.waitForURL((url) => url.pathname === '/admin')

  const dashboardArtifact = page.locator('span[title="Dashboard"]')
  await expect(dashboardArtifact).toBeVisible()
}
