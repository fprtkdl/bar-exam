// 사용: node scripts/shot.mjs "<url>" <out.png> [width=1280]  (시스템 Chrome 사용, 전체 페이지)
import { mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
import { chromium } from 'playwright-core'

const [url, out, width = '1280'] = process.argv.slice(2)
if (!url || !out) {
  console.error('usage: node scripts/shot.mjs <url> <out.png> [width]')
  process.exit(1)
}
mkdirSync(dirname(out), { recursive: true })
const browser = await chromium.launch({ channel: 'chrome', headless: true })
try {
  const page = await browser.newPage({ viewport: { width: Number(width), height: 800 } })
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  await page.screenshot({ path: out, fullPage: true })
  console.log(out)
} finally {
  await browser.close()
}
