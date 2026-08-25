import { chromium } from 'playwright-core';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE = 'http://localhost:4000';
const browser = await chromium.launch({ executablePath: CHROME });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(BASE + '/', { waitUntil: 'load' });
// wait for loader to fully finish (unmount)
await page.waitForFunction(() => !document.querySelector('.loader-container'), null, { timeout: 15000 });
await page.waitForTimeout(800);

await page.evaluate(() => {
  window.__shifts = [];
  new PerformanceObserver(list => {
    for (const e of list.getEntries()) {
      if (e.hadRecentInput) continue;
      window.__shifts.push({
        value: +(e.value.toFixed(4)),
        time: Math.round(e.startTime),
        sources: (e.sources || []).map(s => ({
          node: s.node ? (s.node.tagName + '.' + String(s.node.className || '').slice(0, 60)) : 'unknown',
          prev: s.previousRect ? [s.previousRect.x, s.previousRect.y, s.previousRect.width, s.previousRect.height] : null,
          curr: s.currentRect ? [s.currentRect.x, s.currentRect.y, s.currentRect.width, s.currentRect.height] : null,
        })).slice(0, 3),
      });
    }
  }).observe({ type: 'layout-shift', buffered: false });
});

for (let i = 0; i < 14; i++) { await page.evaluate(() => window.scrollBy(0, 500)); await page.waitForTimeout(260); }
const shifts = await page.evaluate(() => window.__shifts);
const total = shifts.reduce((a, s) => a + s.value, 0);
console.log('total CLS after loader:', total.toFixed(4), '| entries:', shifts.length);
shifts.filter(s => s.value > 0.02).sort((a, b) => b.value - a.value).slice(0, 6).forEach(s => {
  console.log('---', s.value, '@', s.time, 'ms');
  s.sources.forEach(x => console.log('   ', x.node, JSON.stringify(x.prev), '->', JSON.stringify(x.curr)));
});
await browser.close();
