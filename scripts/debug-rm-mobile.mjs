import { chromium } from 'playwright-core';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE = 'http://localhost:4000';
const browser = await chromium.launch({ executablePath: CHROME });

// ── A · reduced-motion deep probe ──
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push(String(e)));
  page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4500);
  const state = await page.evaluate(() => ({
    loaderGone: !document.querySelector('.loader-container'),
    h1s: [...document.querySelectorAll('h1')].map(h => h.textContent.trim().slice(0, 30)),
    rootHTMLLen: document.getElementById('root').innerHTML.length,
    bodyCls: document.body.className,
    htmlCls: document.documentElement.className,
  }));
  console.log('REDUCED-MOTION STATE:', JSON.stringify(state, null, 1));
  console.log('ERRORS:', errs.slice(0, 6));
  await ctx.close();
}

// ── B · mobile hamburger probe ──
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => !document.querySelector('.loader-container'), null, { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(600);
  const btn = page.locator('header button[aria-label="Toggle Menu"]');
  console.log('burger count:', await btn.count(), 'visible:', await btn.first().isVisible().catch(() => 'n/a'));
  if (await btn.count()) {
    await btn.first().click({ force: true }).catch(e => console.log('click err:', String(e).slice(0, 80)));
    await page.waitForTimeout(800);
    const menuState = await page.evaluate(() => {
      const overlay = document.querySelector('header .fixed');
      if (!overlay) return { found: false };
      const s = getComputedStyle(overlay);
      return { found: true, cls: overlay.className.slice(-40), transform: s.transform, visibility: s.visibility, display: s.display, top: s.top };
    });
    console.log('MENU:', JSON.stringify(menuState));
    const labels = await page.evaluate(() => [...document.querySelectorAll('button')].filter(b => b.offsetParent !== null).map(b => b.textContent.trim()).slice(0, 12));
    console.log('visible buttons:', labels);
  }
  await ctx.close();
}

await browser.close();
