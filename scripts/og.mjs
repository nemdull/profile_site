// 共有したときに出る画像（public/og.png、1200×630）を、いまの見た目から作り直す。
//   npm run build && npm run og
//
// ビルドした結果を手元で配信して、いちばん上の画面をブラウザーで撮るだけ。
// 見た目を変えたら、これを走らせ直せば画像もそろう（ブラウザーは、画面のテストと同じ Playwright のもの）。
import { fileURLToPath } from 'node:url'

import { chromium } from '@playwright/test'
import { preview } from 'vite'

const OUTPUT = fileURLToPath(new URL('../public/og.png', import.meta.url))

// 画像には要らないもの（上の帯・ボタン・リンク・奥の部屋）を外して、見出しと月を画像の大きさに合わせる
const FRAME = `
  .hud, .scroll-cue, .hero-actions, .hero-links, .portal { display: none !important; }
  .hero { --s3: 72px !important; }
  .hero-content { padding: 0 56px !important; gap: 22px 48px !important; }
  .moon-wrap { width: 340px !important; }
  .readout { font-size: 20px !important; }
  .readout .note { font-size: 18px !important; }
`

const server = await preview({ preview: { port: 4318 } })
const browser = await chromium.launch()

try {
  const address = server.httpServer.address()
  const port = typeof address === 'object' && address ? address.port : 4318
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } })
  await page.goto(`http://localhost:${port}/`)
  // 点検が終わって、札に結果が出そろうのを待つ
  await page.locator('.console[data-phase="done"]').waitFor({ timeout: 30_000 })
  await page.addStyleTag({ content: FRAME })
  await page.waitForTimeout(500)
  await page.screenshot({ path: OUTPUT })
  console.log(`作成: ${OUTPUT}`)
} finally {
  await browser.close()
  await server.close()
}
