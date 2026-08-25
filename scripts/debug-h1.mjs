import { chromium } from 'playwright-core';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE = 'http://localhost:4000';
const browser = await chromium.launch({ executablePath: CHROME });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(BASE + '/', { waitUntil: 'load' });
await page.waitForTimeout(2500);
const info = await page.evaluate(() => ({
  h1s: [...document.querySelectorAll('h1')].map(h => ({ txt: h.textContent.trim().slice(0, 40), cls: h.className.slice(0, 60), parent: h.parentElement?.className.slice(0, 50) })),
  loaderVisible: !!document.querySelector('.loader-container'),
  rootChildren: document.getElementById('root').children.length,
}));
console.log(JSON.stringify(info, null, 1));

// Now check a detail route with generous wait
await page.goto(BASE + '/works/ceylon-gems', { waitUntil: 'load' });
await page.waitForTimeout(2500);
const info2 = await page.evaluate(() => ({
  url: location.pathname,
  h1s: [...document.querySelectorAll('h1')].map(h => h.textContent.trim().slice(0, 40)),
  loaderVisible: !!document.querySelector('.loader-container'),
  title: document.title,
  hasDetailHero: !!document.querySelector('.project-gallery'),
}));
console.log(JSON.stringify(info2, null, 1));
await browser.close();
