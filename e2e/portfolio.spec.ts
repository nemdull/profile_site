import { readFileSync } from 'node:fs'

import { expect, test, type Page } from '@playwright/test'

const allowedHosts: string[] = JSON.parse(readFileSync(new URL('../src/content/allowed-hosts.json', import.meta.url), 'utf8'))

const HEADLINE = 'ねむい。だるい。だから自動化する。'
const CHECKS = 7

const board = (page: Page) => page.locator('.console')
const lamp = (page: Page) => page.locator('.chip')

/** 点検が最後まで走り終わるのを待つ */
async function checksFinished(page: Page) {
  await expect(board(page)).toHaveAttribute('data-phase', 'done', { timeout: 20_000 })
}

test.describe('開いたとき', () => {
  test('見出しが出て、点検が 7 項目とも通る', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('heading', { level: 1, name: HEADLINE })).toBeVisible()
    await expect(lamp(page)).toHaveText(`点検 ${CHECKS}/${CHECKS} 合格`, { timeout: 20_000 })
    await expect(board(page).locator('li[data-status="pass"]')).toHaveCount(CHECKS)
    await expect(board(page).locator('li[data-status="fail"]')).toHaveCount(0)
  })

  test('横にはみ出さない', async ({ page }) => {
    for (const width of [320, 390, 768, 1280]) {
      await page.setViewportSize({ width, height: 800 })
      await page.goto('/')
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
      expect(overflow, `幅 ${width}px`).toBe(0)
    }
  })

  test('外へのリンクは、ぜんぶ https で、決めたサイトだけ', async ({ page }) => {
    await page.goto('/')
    const links = await page.locator('a[href]:not([href^="#"])').evaluateAll((anchors) =>
      anchors.map((anchor) => {
        const url = new URL((anchor as HTMLAnchorElement).href)
        return { protocol: url.protocol, host: url.hostname, text: anchor.textContent ?? '' }
      }),
    )

    expect(links.length).toBeGreaterThan(20)
    for (const link of links) {
      expect(link.protocol, link.text).toBe('https:')
      expect(allowedHosts, `${link.text}（${link.host}）`).toContain(link.host)
    }
  })

  test('キーボードの最初の Tab で「本文へ移動」に行ける', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('Tab')
    await expect(page.getByRole('link', { name: '本文へ移動' })).toBeFocused()
  })
})

test.describe('発進前チェック', () => {
  // 隕石を 5 回ぶつけて直すので、ほかのテストより時間がかかる
  test.setTimeout(120_000)

  test('隕石を 5 回ぶつけると、5 種類の壊れ方をすべて見つけ、修理で元に戻る', async ({ page }) => {
    await page.goto('/')
    await checksFinished(page)

    const found = new Set<string>()
    for (let round = 0; round < 5; round++) {
      await page.getByRole('button', { name: '隕石をぶつける' }).click()
      await expect(board(page)).toHaveAttribute('data-failed', 'true', { timeout: 20_000 })
      await checksFinished(page)

      // 壊したのは 1 か所なので、落ちるのも 1 項目だけ。ほかの項目を巻き込まないこと
      const failed = board(page).locator('li[data-status="fail"]')
      await expect(failed).toHaveCount(1)
      await expect(lamp(page)).toHaveText('異常 1 件')
      found.add((await failed.locator('.row-label').textContent()) ?? '')

      // 「壊れた所を見る」で、原因の場所に印が付く
      await failed.getByRole('button', { name: '壊れた所を見る' }).click()
      await expect(page.locator('[data-ping="true"]')).toBeVisible()

      await page.getByRole('button', { name: '修理する' }).click()
      await expect(board(page)).not.toHaveAttribute('data-failed', 'true', { timeout: 20_000 })
      await checksFinished(page)
      await expect(lamp(page)).toHaveText(`点検 ${CHECKS}/${CHECKS} 合格`)
    }

    expect([...found].sort()).toEqual(
      [
        '「できること」に、ぜんぶ根拠が付いている',
        'アイコンの画像が読み込めている',
        'リンクの行き先が、決めたサイトだけ',
        '外へのリンクが、ぜんぶ https',
        '見出しが表示されている',
      ].sort(),
    )
    // 直したあとは、見出しも元どおり
    await expect(page.getByRole('heading', { level: 1, name: HEADLINE })).toBeVisible()
  })
})

test.describe('「動きを減らす」設定のとき', () => {
  test.use({ contextOptions: { reducedMotion: 'reduce' } })

  test('動き続けるものが無く、点検もそれを確かめている', async ({ page }) => {
    await page.goto('/')
    await checksFinished(page)

    const moving = await page.evaluate(
      () =>
        document.getAnimations().filter((animation) => {
          const length = Number(animation.effect?.getComputedTiming().activeDuration ?? 0)
          return animation.playState === 'running' && length > 100
        }).length,
    )
    expect(moving).toBe(0)
    await expect(board(page).locator('li').last()).toContainText('設定はオン。動きを止めています')
    // 見出しは、動きが無くても最初から読める
    await expect(page.locator('h1 .ch').first()).toHaveCSS('opacity', '1')
  })
})

test.describe('sf-meter のメーター', () => {
  test('項目を押すと、その実現度を指す', async ({ page }) => {
    await page.goto('/#works')
    const gauge = page.locator('.gauge')

    await gauge.getByRole('button', { name: 'タイムマシン' }).click()
    await expect(gauge.getByRole('img')).toHaveAccessibleName('タイムマシンの実現度は 1')
    await expect(gauge.locator('.gauge-score')).toHaveText(/実現度\s*1$/)

    await gauge.getByRole('button', { name: '量子暗号通信' }).click()
    await expect(gauge.locator('.gauge-score')).toHaveText(/実現度\s*88$/)
    await expect(gauge.getByRole('button', { name: '量子暗号通信' })).toHaveAttribute('aria-pressed', 'true')
  })
})
