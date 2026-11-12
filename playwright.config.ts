import { defineConfig, devices } from '@playwright/test'

// 画面を実際に開いて確かめるテスト（e2e/）。ビルドした結果を配信して、それに対して走らせる。
//   npm run build && npm run test:e2e
export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'pc', use: { ...devices['Desktop Chrome'] } },
    { name: 'phone', use: { ...devices['Pixel 7'] } },
    // iPhone の Safari と同じ描画エンジン（WebKit）。入れるのに時間がかかるので、CI でだけ走らせる。
    // 手元で走らせるなら: npx playwright install webkit && CI=1 npm run test:e2e
    ...(process.env.CI ? [{ name: 'iphone', use: { ...devices['iPhone 14'] } }] : []),
  ],
  webServer: {
    command: 'npm run preview -- --port 4173 --strictPort',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
})
