import { chromium } from 'playwright-core';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE = 'http://localhost:4000';
const browser = await chromium.launch({ executablePath: CHROME });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
const errs = [];
page.on('pageerror', e => errs.push(String(e)));
await page.goto(BASE + '/admin', { waitUntil: 'domcontentloaded' });
await page.waitForFunction(() => !document.querySelector('.loader-container'), null, { timeout: 15000 }).catch(() => {});
await page.fill('.cfx-admin input[type="password"]', 'creativefx2026');
await page.locator('.cfx-admin button[type="submit"]').click();
await page.waitForTimeout(1500);
await page.click('aside nav button:has-text("Homepage")');
await page.waitForTimeout(1400);
const state = await page.evaluate(() => ({
  headers: [...document.querySelectorAll('main h3')].map(h => h.textContent.trim().slice(0, 60)).slice(0, 10),
  spans: [...document.querySelectorAll('span')].map(s => s.textContent.trim()).filter(t => t.includes('Featured')).slice(0, 5),
}));
console.log(JSON.stringify(state, null, 1));
console.log('PAGEERRORS:', errs.slice(0, 4));
await browser.close();
