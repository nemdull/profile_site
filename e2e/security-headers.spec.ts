import { readFileSync } from 'node:fs'

import { expect, test, type Page } from '@playwright/test'

// 公開先（Vercel）で付く安全のヘッダーは vercel.json に書いてある。
// テスト用の配信（vite preview）には付かないので、ここでは同じヘッダーを応答に足してから開き、
// 「ヘッダーを付けても画面が壊れない」「止めたいものが実際に止まる」を確かめる。
type HeaderRule = { source: string; headers: { key: string; value: string }[] }

const vercelConfig: { headers: HeaderRule[] } = JSON.parse(
  readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'),
)
const siteHeaders: Record<string, string> = Object.fromEntries(
  vercelConfig.headers.flatMap((rule) => rule.headers).map(({ key, value }) => [key.toLowerCase(), value]),
)

const HEADLINE = 'ねむい。だるい。だから自動化する。'

/** vercel.json のヘッダーを、すべての応答に足す。ブラウザーが止めたものは violations に溜まる */
async function openWithSiteHeaders(page: Page) {
  const violations: string[] = []
  await page.exposeFunction('reportPolicyViolation', (violation: string) => {
    violations.push(violation)
  })
  await page.addInitScript(() => {
    document.addEventListener('securitypolicyviolation', (event) => {
      const report = (window as unknown as { reportPolicyViolation: (violation: string) => void }).reportPolicyViolation
      report(`${event.violatedDirective} ${event.blockedURI}`)
    })
  })
  await page.route('**/*', async (route) => {
    const response = await route.fetch()
    await route.fulfill({ response, headers: { ...response.headers(), ...siteHeaders } })
  })
  const response = await page.goto('/')
  return { response, violations }
}

test.describe('公開先と同じ安全のヘッダーを付けたとき', () => {
  test('決めたヘッダーが、ぜんぶ vercel.json にある', () => {
    expect(Object.keys(siteHeaders).sort()).toEqual([
      'content-security-policy',
      'cross-origin-opener-policy',
      'permissions-policy',
      'referrer-policy',
      'x-content-type-options',
      'x-frame-options',
    ])
    expect(siteHeaders['content-security-policy']).toContain("default-src 'self'")
    expect(siteHeaders['content-security-policy']).toContain("script-src 'self'")
    expect(siteHeaders['content-security-policy']).toContain("frame-ancestors 'none'")
    // スクリプトについては、抜け道になる指定を入れない
    expect(siteHeaders['content-security-policy']).not.toMatch(/script-src[^;]*'unsafe-(inline|eval)'/)
  })

  test('画面はそのまま動き、止められるものが 1 つも無い', async ({ page }) => {
    const { response, violations } = await openWithSiteHeaders(page)

    expect(response?.headers()['content-security-policy']).toBe(siteHeaders['content-security-policy'])
    await expect(page.getByRole('heading', { level: 1, name: HEADLINE })).toBeVisible()
    await expect(page.locator('.console')).toHaveAttribute('data-phase', 'done', { timeout: 20_000 })
    await expect(page.locator('.console li[data-status="fail"]')).toHaveCount(0)
    // 書体と画像を取りに行く、いちばん下まで見ておく
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
    await page.evaluate(() => document.fonts.ready.then(() => undefined))

    expect(violations).toEqual([])
  })

  test('あとから差し込まれたスクリプトは動かない', async ({ page }) => {
    const { violations } = await openWithSiteHeaders(page)
    await expect(page.getByRole('heading', { level: 1, name: HEADLINE })).toBeVisible()

    const ran = await page.evaluate(() => {
      const injected = document.createElement('script')
      injected.textContent = 'window.__injectedScriptRan = true'
      document.head.append(injected)
      return Boolean((window as unknown as { __injectedScriptRan?: boolean }).__injectedScriptRan)
    })

    expect(ran).toBe(false)
    await expect.poll(() => violations.some((violation) => violation.startsWith('script-src'))).toBe(true)
  })
})
