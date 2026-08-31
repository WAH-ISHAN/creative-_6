import { chromium } from 'playwright-core';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE = 'http://localhost:4000';
const browser = await chromium.launch({ executablePath: CHROME });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
page.on('pageerror', e => console.log('PAGEERROR:', String(e).slice(0, 140)));
await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
await page.waitForFunction(() => !document.querySelector('.loader-container'), null, { timeout: 15000 }).catch(() => {});
// replicate v1 path: footer WORK
await page.evaluate(() => { const el = [...document.querySelectorAll('footer button')].find(b => b.textContent.trim() === 'Work'); el?.click(); });
await page.waitForURL('**/works', { timeout: 6000 });
await page.waitForTimeout(900);
console.log('at:', page.url());
const cardInfo = await page.evaluate(() => {
  const c = document.querySelector('.works-card');
  return { exists: !!c, title: c?.querySelector('h3')?.textContent };
});
console.log('first card:', JSON.stringify(cardInfo));
await page.evaluate(() => document.querySelector('.works-card')?.click());
for (let i = 1; i <= 8; i++) {
  await page.waitForTimeout(300);
  const p = new URL(page.url()).pathname;
  const h1 = await page.evaluate(() => [...document.querySelectorAll('h1')].filter(h => !h.closest('.loader-container'))[0]?.textContent?.trim());
  console.log(i * 300 + 'ms', p, '| h1=', h1);
  if (p !== '/works') break;
}
await browser.close();
