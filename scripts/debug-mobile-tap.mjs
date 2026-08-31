import { chromium } from 'playwright-core';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE = 'http://localhost:4000';
const browser = await chromium.launch({ executablePath: CHROME });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await ctx.newPage();
page.on('pageerror', e => console.log('PAGEERROR:', String(e).slice(0, 120)));
await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
await page.waitForFunction(() => !document.querySelector('.loader-container'), null, { timeout: 15000 });
await page.waitForTimeout(600);
await page.locator('header button[aria-label="Toggle Menu"]').dispatchEvent('click');
await page.waitForTimeout(700);
// inspect the WORK button binding
const info = await page.evaluate(() => {
  const btns = [...document.querySelectorAll('div.fixed button')].map(b => ({ t: b.textContent.trim(), rect: b.getBoundingClientRect().top }));
  return btns;
});
console.log('overlay buttons:', JSON.stringify(info));
const res = await page.evaluate(() => {
  const b = [...document.querySelectorAll('div.fixed button')].find(x => x.textContent.trim() === 'WORK');
  if (!b) return 'no-button';
  b.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
  return 'dispatched';
});
console.log(res);
for (let i = 0; i < 10; i++) {
  await page.waitForTimeout(400);
  const u = new URL(page.url()).pathname;
  if (u === '/works') { console.log('NAVIGATED to /works at', (i + 1) * 400, 'ms'); break; }
}
console.log('final path:', new URL(page.url()).pathname);
await browser.close();
